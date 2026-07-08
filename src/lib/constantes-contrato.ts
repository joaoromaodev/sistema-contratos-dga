import type { TipoValor } from "@/generated/prisma/enums";

// Os rótulos de tipo de instrumento, natureza jurídica, tipo de credor e
// modalidade de licitação NÃO ficam mais fixos aqui - são configuráveis pela
// tela de Configurações e vivem na tabela opcoes_lista (ver src/lib/opcoes.ts).
//
// As regras abaixo (estrutura de valores, sugestão de natureza jurídica e
// exigência de modalidade) continuam fixas no código por serem regras de
// negócio, não apenas rótulos. Para os 8 tipos padrão do CCON elas são
// específicas; para um tipo novo criado na tela de Configurações, aplica-se
// um padrão genérico razoável (ver funções `valoresPara`, `instrumentoJuridicoSugeridoPara`,
// `exigeModalidadePara`).

export const TIPO_VALOR_LABEL: Record<TipoValor, string> = {
  VALOR_UNICO: "Valor",
  MENSAL: "Valor Mensal",
  ANUAL: "Valor Anual",
  GLOBAL: "Valor Global",
  PARTE_SEDUC: "Valor - Parte SEDUC",
  PARTE_ENTIDADE: "Valor - Parte Credor",
};

/** Estrutura de valores esperada por tipo de instrumento (para montar o formulário) */
const VALORES_POR_TIPO: Record<string, TipoValor[]> = {
  AQUISICAO: ["VALOR_UNICO"],
  EMPREITADA_GLOBAL: ["GLOBAL"],
  LOCACAO_IMOVEL: ["MENSAL", "ANUAL"],
  PRESTACAO_SERVICOS: ["MENSAL", "GLOBAL"],
  CESSAO_RECIPROCA: ["PARTE_SEDUC", "PARTE_ENTIDADE"],
  ENGENHARIA_DIVERSOS: ["PARTE_SEDUC", "PARTE_ENTIDADE"],
  PARCERIA_ENTIDADE_PUBLICA: ["PARTE_SEDUC", "PARTE_ENTIDADE"],
  PARCERIA_OSC: ["PARTE_SEDUC", "PARTE_ENTIDADE"],
};
const VALORES_PADRAO: TipoValor[] = ["VALOR_UNICO"];

export function valoresPara(tipoInstrumento: string): TipoValor[] {
  return VALORES_POR_TIPO[tipoInstrumento] ?? VALORES_PADRAO;
}

/** Sugestão automática de natureza jurídica ao escolher o tipo (usuário pode alterar) */
const INSTRUMENTO_JURIDICO_SUGERIDO: Record<string, string> = {
  AQUISICAO: "CONTRATO_ADMINISTRATIVO",
  EMPREITADA_GLOBAL: "CONTRATO_ADMINISTRATIVO",
  LOCACAO_IMOVEL: "CONTRATO_ADMINISTRATIVO",
  PRESTACAO_SERVICOS: "CONTRATO_ADMINISTRATIVO",
  CESSAO_RECIPROCA: "CONVENIO",
  ENGENHARIA_DIVERSOS: "CONVENIO",
  PARCERIA_ENTIDADE_PUBLICA: "ACORDO_COOPERACAO_TECNICA",
  PARCERIA_OSC: "TERMO_PARCERIA",
};
const INSTRUMENTO_JURIDICO_PADRAO = "CONVENIO";

export function instrumentoJuridicoSugeridoPara(tipoInstrumento: string): string {
  return INSTRUMENTO_JURIDICO_SUGERIDO[tipoInstrumento] ?? INSTRUMENTO_JURIDICO_PADRAO;
}

/** Se o tipo exige modalidade de licitação (contratos formais) */
const EXIGE_MODALIDADE_LICITACAO: Record<string, boolean> = {
  AQUISICAO: true,
  EMPREITADA_GLOBAL: true,
  LOCACAO_IMOVEL: true,
  PRESTACAO_SERVICOS: true,
  CESSAO_RECIPROCA: false,
  ENGENHARIA_DIVERSOS: false,
  PARCERIA_ENTIDADE_PUBLICA: false,
  PARCERIA_OSC: false,
};

export function exigeModalidadePara(tipoInstrumento: string): boolean {
  return EXIGE_MODALIDADE_LICITACAO[tipoInstrumento] ?? false;
}

/** Categorias/rótulos das listas configuráveis, exibidos na tela de Configurações */
export const CATEGORIA_OPCAO_LABEL = {
  TIPO_INSTRUMENTO: "Tipo de Instrumento",
  INSTRUMENTO_JURIDICO: "Natureza Jurídica",
  CONTRAPARTE_TIPO: "Tipo de Credor",
  MODALIDADE_LICITACAO: "Modalidade de Licitação",
} as const;
