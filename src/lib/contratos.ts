import "server-only";
import { prisma } from "@/lib/prisma";
import { getDiasAlerta } from "@/lib/status";
import type { Prisma } from "@/generated/prisma/client";
import type { TipoInstrumento } from "@/generated/prisma/enums";

export type Categoria = "contratos" | "convenios";
export type StatusFiltro = "VIGENTE" | "PROXIMO_A_VENCER" | "VENCIDO" | "ENCERRADO";
export type OrdenarPor = "vigencia" | "valor" | "contraparte" | "recente";

export type FiltrosContrato = {
  categoria?: Categoria;
  tipoInstrumento?: TipoInstrumento;
  busca?: string;
  status?: StatusFiltro;
  ordenarPor?: OrdenarPor;
  ordem?: "asc" | "desc";
  pagina?: number;
};

const PAGE_SIZE = 20;

export async function listarContratos(filtros: FiltrosContrato) {
  const where: Prisma.ContratoWhereInput = {};

  if (filtros.categoria === "contratos") {
    where.instrumentoJuridico = "CONTRATO_ADMINISTRATIVO";
  } else if (filtros.categoria === "convenios") {
    where.instrumentoJuridico = { not: "CONTRATO_ADMINISTRATIVO" };
  }

  if (filtros.tipoInstrumento) {
    where.tipoInstrumento = filtros.tipoInstrumento;
  }

  if (filtros.busca) {
    where.OR = [
      { objeto: { contains: filtros.busca, mode: "insensitive" } },
      { contraparteNome: { contains: filtros.busca, mode: "insensitive" } },
      { numeroProcesso: { contains: filtros.busca, mode: "insensitive" } },
      { numeroInstrumento: { contains: filtros.busca, mode: "insensitive" } },
      { codigoIdentificacao: { contains: filtros.busca, mode: "insensitive" } },
    ];
  }

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const diasAlertaPadrao = await getDiasAlerta();
  const limiteAlerta = new Date(hoje);
  limiteAlerta.setDate(limiteAlerta.getDate() + diasAlertaPadrao);

  if (filtros.status === "ENCERRADO") {
    where.situacaoAdministrativa = "ENCERRADO";
  } else if (filtros.status === "VENCIDO") {
    where.situacaoAdministrativa = "ATIVO";
    where.dataFimVigenciaAtual = { lt: hoje };
  } else if (filtros.status === "PROXIMO_A_VENCER") {
    where.situacaoAdministrativa = "ATIVO";
    where.dataFimVigenciaAtual = { gte: hoje, lte: limiteAlerta };
  } else if (filtros.status === "VIGENTE") {
    where.situacaoAdministrativa = "ATIVO";
    where.dataFimVigenciaAtual = { gt: limiteAlerta };
  } else {
    // sem filtro de status explícito: por padrão não mostra encerrados
    where.situacaoAdministrativa = "ATIVO";
  }

  const orderBy: Prisma.ContratoOrderByWithRelationInput =
    filtros.ordenarPor === "vigencia"
      ? { dataFimVigenciaAtual: filtros.ordem ?? "asc" }
      : filtros.ordenarPor === "contraparte"
        ? { contraparteNome: filtros.ordem ?? "asc" }
        : filtros.ordenarPor === "recente"
          ? { criadoEm: filtros.ordem ?? "desc" }
          : { dataFimVigenciaAtual: "asc" };

  const pagina = filtros.pagina && filtros.pagina > 0 ? filtros.pagina : 1;

  const [total, contratos] = await Promise.all([
    prisma.contrato.count({ where }),
    prisma.contrato.findMany({
      where,
      orderBy,
      skip: (pagina - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { valores: true },
    }),
  ]);

  return {
    contratos,
    total,
    pagina,
    totalPaginas: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    pageSize: PAGE_SIZE,
  };
}

export async function buscarContratoPorId(id: string) {
  return prisma.contrato.findUnique({
    where: { id },
    include: {
      valores: true,
      aditivos: { orderBy: { numeroSequencial: "asc" } },
      criadoPor: { select: { nome: true } },
      atualizadoPor: { select: { nome: true } },
    },
  });
}

export async function proximoCodigoIdentificacao(): Promise<string> {
  const ano = new Date().getFullYear();
  const ultimo = await prisma.contrato.findFirst({
    orderBy: { numeroSequencial: "desc" },
    select: { numeroSequencial: true },
  });
  const proximo = (ultimo?.numeroSequencial ?? 0) + 1;
  return `CCON-${ano}-${String(proximo).padStart(4, "0")}`;
}
