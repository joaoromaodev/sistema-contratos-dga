import type {
  TipoInstrumento,
  InstrumentoJuridico,
  ContraparteTipo,
  TipoValor,
} from "@/generated/prisma/enums";

export const TIPO_INSTRUMENTO_LABEL: Record<TipoInstrumento, string> = {
  AQUISICAO: "Aquisição",
  EMPREITADA_GLOBAL: "Empreitada Global",
  LOCACAO_IMOVEL: "Locação de Imóvel",
  PRESTACAO_SERVICOS: "Prestação de Serviços",
  CESSAO_RECIPROCA: "Cessão Recíproca",
  ENGENHARIA_DIVERSOS: "Engenharia e Diversos",
  PARCERIA_ENTIDADE_PUBLICA: "Parceria com Entidade Pública",
  PARCERIA_OSC: "Parceria com OSC",
};

export const INSTRUMENTO_JURIDICO_LABEL: Record<InstrumentoJuridico, string> = {
  CONTRATO_ADMINISTRATIVO: "Contrato Administrativo",
  CONVENIO: "Convênio",
  ACORDO_COOPERACAO_TECNICA: "Acordo de Cooperação Técnica",
  TERMO_EXECUCAO_DESCENTRALIZADA: "Termo de Execução Descentralizada",
  TERMO_PARCERIA: "Termo de Parceria",
};

export const CONTRAPARTE_TIPO_LABEL: Record<ContraparteTipo, string> = {
  PESSOA_JURIDICA_PRIVADA: "Pessoa Jurídica Privada",
  PESSOA_FISICA: "Pessoa Física",
  MUNICIPIO: "Município",
  ORGAO_PUBLICO: "Órgão Público",
  OSC: "Organização da Sociedade Civil (OSC)",
};

export const TIPO_VALOR_LABEL: Record<TipoValor, string> = {
  VALOR_UNICO: "Valor",
  MENSAL: "Valor Mensal",
  ANUAL: "Valor Anual",
  GLOBAL: "Valor Global",
  PARTE_SEDUC: "Valor - Parte SEDUC",
  PARTE_ENTIDADE: "Valor - Parte Entidade/Contraparte",
};

/** Estrutura de valores esperada por tipo de instrumento (para montar o formulário) */
export const VALORES_POR_TIPO: Record<TipoInstrumento, TipoValor[]> = {
  AQUISICAO: ["VALOR_UNICO"],
  EMPREITADA_GLOBAL: ["GLOBAL"],
  LOCACAO_IMOVEL: ["MENSAL", "ANUAL"],
  PRESTACAO_SERVICOS: ["MENSAL", "GLOBAL"],
  CESSAO_RECIPROCA: ["PARTE_SEDUC", "PARTE_ENTIDADE"],
  ENGENHARIA_DIVERSOS: ["PARTE_SEDUC", "PARTE_ENTIDADE"],
  PARCERIA_ENTIDADE_PUBLICA: ["PARTE_SEDUC", "PARTE_ENTIDADE"],
  PARCERIA_OSC: ["PARTE_SEDUC", "PARTE_ENTIDADE"],
};

/** Sugestão automática de natureza jurídica ao escolher o tipo (usuário pode alterar) */
export const INSTRUMENTO_JURIDICO_SUGERIDO: Record<TipoInstrumento, InstrumentoJuridico> = {
  AQUISICAO: "CONTRATO_ADMINISTRATIVO",
  EMPREITADA_GLOBAL: "CONTRATO_ADMINISTRATIVO",
  LOCACAO_IMOVEL: "CONTRATO_ADMINISTRATIVO",
  PRESTACAO_SERVICOS: "CONTRATO_ADMINISTRATIVO",
  CESSAO_RECIPROCA: "CONVENIO",
  ENGENHARIA_DIVERSOS: "CONVENIO",
  PARCERIA_ENTIDADE_PUBLICA: "ACORDO_COOPERACAO_TECNICA",
  PARCERIA_OSC: "TERMO_PARCERIA",
};

/** Se o tipo exige modalidade de licitação (contratos formais) */
export const EXIGE_MODALIDADE_LICITACAO: Record<TipoInstrumento, boolean> = {
  AQUISICAO: true,
  EMPREITADA_GLOBAL: true,
  LOCACAO_IMOVEL: true,
  PRESTACAO_SERVICOS: true,
  CESSAO_RECIPROCA: false,
  ENGENHARIA_DIVERSOS: false,
  PARCERIA_ENTIDADE_PUBLICA: false,
  PARCERIA_OSC: false,
};
