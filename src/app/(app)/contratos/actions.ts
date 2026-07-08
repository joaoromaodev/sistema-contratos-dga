"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getUsuarioAtual, podeEditar, podeExcluirOuArquivar } from "@/lib/auth";
import { proximoCodigoIdentificacao } from "@/lib/contratos";
import { ContratoFormSchema } from "@/lib/schemas/contrato-schema";
import { VALORES_POR_TIPO } from "@/lib/constantes-contrato";
import type { TipoInstrumento, TipoValor } from "@/generated/prisma/enums";

export type ContratoFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
} | undefined;

function extrairValores(formData: FormData, tipoInstrumento: TipoInstrumento) {
  const tipos = VALORES_POR_TIPO[tipoInstrumento];
  return tipos.map((tipoValor) => {
    const inicial = formData.get(`valorInicial__${tipoValor}`);
    const atual = formData.get(`valorAtual__${tipoValor}`);
    return {
      tipoValor: tipoValor as TipoValor,
      valorInicial: inicial ? Number(inicial) : null,
      valorAtual: atual ? Number(atual) : inicial ? Number(inicial) : null,
    };
  });
}

export async function salvarContrato(
  _prevState: ContratoFormState,
  formData: FormData
): Promise<ContratoFormState> {
  const usuario = await getUsuarioAtual();
  if (!podeEditar(usuario.papel)) {
    return { error: "Você não tem permissão para cadastrar/editar contratos." };
  }

  const contratoId = formData.get("id")?.toString() || undefined;

  const raw = Object.fromEntries(formData.entries());
  const validado = ContratoFormSchema.safeParse(raw);

  if (!validado.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of validado.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { error: "Corrija os campos destacados.", fieldErrors };
  }

  const dados = validado.data;
  const valores = extrairValores(formData, dados.tipoInstrumento);

  const payload = {
    tipoInstrumento: dados.tipoInstrumento,
    instrumentoJuridico: dados.instrumentoJuridico,
    origemNumero: dados.origemNumero,
    numeroProcesso: dados.numeroProcesso,
    numeroInstrumento: dados.numeroInstrumento || null,
    contraparteNome: dados.contraparteNome,
    contraparteTipo: dados.contraparteTipo,
    contraparteDocumento: dados.contraparteDocumento || null,
    objeto: dados.objeto,
    modalidadeLicitacao: dados.modalidadeLicitacao || null,
    dataInicioVigencia: new Date(dados.dataInicioVigencia),
    dataFimVigenciaAtual: new Date(dados.dataFimVigenciaAtual),
    publicacaoDiarioOficial: dados.publicacaoDiarioOficial
      ? new Date(dados.publicacaoDiarioOficial)
      : null,
    observacoesPendencias: dados.observacoesPendencias || null,
  };

  let id = contratoId;

  if (contratoId) {
    await prisma.$transaction([
      prisma.contrato.update({
        where: { id: contratoId },
        data: { ...payload, atualizadoPorId: usuario.id },
      }),
      prisma.contratoValor.deleteMany({ where: { contratoId } }),
      ...valores.map((v) =>
        prisma.contratoValor.create({ data: { ...v, contratoId } })
      ),
    ]);
  } else {
    const codigoIdentificacao = await proximoCodigoIdentificacao();
    const criado = await prisma.contrato.create({
      data: {
        ...payload,
        codigoIdentificacao,
        criadoPorId: usuario.id,
        valores: { create: valores },
      },
    });
    id = criado.id;
  }

  revalidatePath("/contratos");
  redirect(`/contratos/${id}`);
}

export async function arquivarContrato(id: string) {
  const usuario = await getUsuarioAtual();
  if (!podeExcluirOuArquivar(usuario.papel)) {
    throw new Error("Você não tem permissão para encerrar/arquivar contratos.");
  }
  const contrato = await prisma.contrato.findUniqueOrThrow({ where: { id } });
  const novaSituacao = contrato.situacaoAdministrativa === "ATIVO" ? "ENCERRADO" : "ATIVO";

  await prisma.contrato.update({
    where: { id },
    data: { situacaoAdministrativa: novaSituacao, atualizadoPorId: usuario.id },
  });

  revalidatePath("/contratos");
  revalidatePath(`/contratos/${id}`);
}

export type AditivoFormState = { error?: string } | undefined;

export async function registrarAditivo(
  contratoId: string,
  _prevState: AditivoFormState,
  formData: FormData
): Promise<AditivoFormState> {
  const usuario = await getUsuarioAtual();
  if (!podeEditar(usuario.papel)) {
    return { error: "Você não tem permissão para registrar aditivos." };
  }

  const tipo = formData.get("tipo")?.toString() as
    | "PRAZO"
    | "VALOR"
    | "PRAZO_E_VALOR"
    | "QUALITATIVO";
  const dataAssinatura = formData.get("dataAssinatura")?.toString();
  const novaDataFimVigencia = formData.get("novaDataFimVigencia")?.toString();
  const novoValor = formData.get("novoValor")?.toString();
  const descricao = formData.get("descricao")?.toString();

  if (!tipo || !dataAssinatura) {
    return { error: "Preencha o tipo e a data de assinatura do aditivo." };
  }

  const ultimo = await prisma.aditivo.findFirst({
    where: { contratoId },
    orderBy: { numeroSequencial: "desc" },
  });

  await prisma.$transaction([
    prisma.aditivo.create({
      data: {
        contratoId,
        numeroSequencial: (ultimo?.numeroSequencial ?? 0) + 1,
        tipo,
        dataAssinatura: new Date(dataAssinatura),
        novaDataFimVigencia: novaDataFimVigencia
          ? new Date(novaDataFimVigencia)
          : null,
        novoValor: novoValor ? Number(novoValor) : null,
        descricao: descricao || null,
      },
    }),
    ...(novaDataFimVigencia
      ? [
          prisma.contrato.update({
            where: { id: contratoId },
            data: {
              dataFimVigenciaAtual: new Date(novaDataFimVigencia),
              atualizadoPorId: usuario.id,
            },
          }),
        ]
      : []),
  ]);

  revalidatePath(`/contratos/${contratoId}`);
  revalidatePath("/contratos");
}
