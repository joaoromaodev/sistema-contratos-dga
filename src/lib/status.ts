import { prisma } from "@/lib/prisma";
import type { TipoInstrumento } from "@/generated/prisma/enums";

export const DIAS_ALERTA_PADRAO = 150;

export type StatusVigencia =
  | "VIGENTE"
  | "PROXIMO_A_VENCER"
  | "VENCIDO"
  | "ENCERRADO";

const cacheAlertas = new Map<string, number>();

/** Busca (com cache em memória do processo) o limiar de dias de alerta configurado para o tipo, ou o padrão global/hardcoded. */
export async function getDiasAlerta(
  tipoInstrumento?: TipoInstrumento
): Promise<number> {
  const chave = tipoInstrumento ?? "__default__";
  if (cacheAlertas.has(chave)) return cacheAlertas.get(chave)!;

  const [porTipo, padrao] = await Promise.all([
    tipoInstrumento
      ? prisma.configuracaoAlerta.findUnique({ where: { tipoInstrumento } })
      : null,
    prisma.configuracaoAlerta.findFirst({ where: { tipoInstrumento: null } }),
  ]);

  const dias = porTipo?.diasAlerta ?? padrao?.diasAlerta ?? DIAS_ALERTA_PADRAO;
  cacheAlertas.set(chave, dias);
  return dias;
}

/** Datas de vigência são tratadas como "calendário puro" (meia-noite UTC) -
 * usar sempre os getters/Date.UTC em UTC evita o efeito de fuso horário
 * "voltar um dia" ao formatar/comparar em servidores fora de UTC-0. */
function dataCalendarioUTC(d: Date) {
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

export function calcularStatusVigencia(
  dataFimVigenciaAtual: Date,
  diasAlerta: number,
  situacaoAdministrativa: "ATIVO" | "ENCERRADO"
): { status: StatusVigencia; diasParaVencer: number } {
  const hojeMs = dataCalendarioUTC(new Date());
  const fimMs = dataCalendarioUTC(new Date(dataFimVigenciaAtual));

  const diasParaVencer = Math.round((fimMs - hojeMs) / (1000 * 60 * 60 * 24));

  if (situacaoAdministrativa === "ENCERRADO") {
    return { status: "ENCERRADO", diasParaVencer };
  }

  if (diasParaVencer < 0) {
    return { status: "VENCIDO", diasParaVencer };
  }
  if (diasParaVencer <= diasAlerta) {
    return { status: "PROXIMO_A_VENCER", diasParaVencer };
  }
  return { status: "VIGENTE", diasParaVencer };
}

export const STATUS_LABEL: Record<StatusVigencia, string> = {
  VIGENTE: "Vigente",
  PROXIMO_A_VENCER: "Próximo a vencer",
  VENCIDO: "Vencido",
  ENCERRADO: "Encerrado",
};
