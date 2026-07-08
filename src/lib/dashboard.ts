import "server-only";
import { prisma } from "@/lib/prisma";
import { getDiasAlerta, calcularStatusVigencia, type StatusVigencia } from "@/lib/status";
import { mapaRotulos } from "@/lib/opcoes";

export async function getDashboardData() {
  const [ativos, encerradosCount, tipoInstrumentoLabel] = await Promise.all([
    prisma.contrato.findMany({
      where: { situacaoAdministrativa: "ATIVO" },
      select: {
        id: true,
        numeroInstrumento: true,
        numeroProcesso: true,
        contraparteNome: true,
        tipoInstrumento: true,
        instrumentoJuridico: true,
        dataFimVigenciaAtual: true,
        valores: { select: { valorAtual: true } },
      },
      orderBy: { dataFimVigenciaAtual: "asc" },
    }),
    prisma.contrato.count({ where: { situacaoAdministrativa: "ENCERRADO" } }),
    mapaRotulos("TIPO_INSTRUMENTO"),
  ]);

  const diasAlertaPadrao = await getDiasAlerta();

  const contadores: Record<StatusVigencia, number> = {
    VIGENTE: 0,
    PROXIMO_A_VENCER: 0,
    VENCIDO: 0,
    ENCERRADO: encerradosCount,
  };

  const atencao: {
    id: string;
    titulo: string;
    status: StatusVigencia;
    diasParaVencer: number;
    dataFimVigenciaAtual: Date;
  }[] = [];

  let valorTotalContratos = 0;
  let valorTotalConvenios = 0;
  const porTipo = new Map<string, number>();

  for (const c of ativos) {
    const { status, diasParaVencer } = calcularStatusVigencia(
      c.dataFimVigenciaAtual,
      diasAlertaPadrao,
      "ATIVO"
    );
    contadores[status]++;

    porTipo.set(c.tipoInstrumento, (porTipo.get(c.tipoInstrumento) ?? 0) + 1);

    const soma = c.valores.reduce(
      (acc, v) => acc + (v.valorAtual ? Number(v.valorAtual) : 0),
      0
    );
    if (c.instrumentoJuridico === "CONTRATO_ADMINISTRATIVO") {
      valorTotalContratos += soma;
    } else {
      valorTotalConvenios += soma;
    }

    if (status === "VENCIDO" || status === "PROXIMO_A_VENCER") {
      atencao.push({
        id: c.id,
        titulo: c.numeroInstrumento || c.numeroProcesso,
        status,
        diasParaVencer,
        dataFimVigenciaAtual: c.dataFimVigenciaAtual,
      });
    }
  }

  atencao.sort((a, b) => a.diasParaVencer - b.diasParaVencer);

  const porTipoOrdenado = Array.from(porTipo.entries())
    .map(([codigo, total]) => ({
      codigo,
      rotulo: tipoInstrumentoLabel[codigo] ?? codigo,
      total,
    }))
    .sort((a, b) => b.total - a.total);

  return {
    totalAtivos: ativos.length,
    contadores,
    valorTotalContratos,
    valorTotalConvenios,
    porTipo: porTipoOrdenado,
    atencao: atencao.slice(0, 8),
  };
}
