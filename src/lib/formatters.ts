export function formatarMoeda(valor: unknown) {
  if (valor === null || valor === undefined) return "—";
  const num = Number(valor);
  if (Number.isNaN(num)) return "—";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(num);
}

export function formatarData(data: Date | string | null | undefined) {
  if (!data) return "—";
  const d = typeof data === "string" ? new Date(data) : data;
  // datas de vigência são calendário puro (meia-noite UTC) - formatar em UTC
  // evita o efeito "volta um dia" em servidores com fuso negativo
  return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(d);
}

export function valorReferencia(
  valores: { tipoValor: string; valorAtual: unknown }[]
): number | null {
  if (!valores.length) return null;
  if (valores.length === 1) {
    const v = valores[0].valorAtual;
    return v === null || v === undefined ? null : Number(v);
  }
  // convênios/locação/prestação com 2 partes: soma as partes com valor
  const soma = valores.reduce((acc, v) => {
    const num = v.valorAtual === null || v.valorAtual === undefined ? 0 : Number(v.valorAtual);
    return acc + (Number.isNaN(num) ? 0 : num);
  }, 0);
  return soma || null;
}
