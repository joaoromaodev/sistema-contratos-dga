import { z } from "zod";

// tipoInstrumento, instrumentoJuridico e contraparteTipo referenciam códigos
// configuráveis (tabela opcoes_lista) - a validação de que o código existe e
// está ativo é feita em salvarContrato() consultando o banco, não aqui.
export const ContratoFormSchema = z.object({
  tipoInstrumento: z.string().trim().min(1, "Selecione o tipo de instrumento."),
  instrumentoJuridico: z.string().trim().min(1, "Selecione a natureza jurídica."),
  origemNumero: z.enum(["PROCESSO", "GABINETE"]),
  numeroProcesso: z.string().trim().min(1, "Informe o número do processo ou a referência do gabinete."),
  numeroInstrumento: z.string().trim().optional(),
  contraparteNome: z.string().trim().min(1, "Informe o credor."),
  contraparteTipo: z.string().trim().min(1, "Selecione o tipo de credor."),
  contraparteDocumento: z.string().trim().optional(),
  objeto: z.string().trim().min(1, "Descreva o objeto do instrumento."),
  modalidadeLicitacao: z.string().trim().optional(),
  numeroLicitacao: z.string().trim().optional(),
  dataInicioVigencia: z.string().min(1, "Informe a data de início."),
  dataFimVigenciaAtual: z.string().min(1, "Informe a data de fim."),
  publicacaoDiarioOficial: z.string().optional(),
  observacoesPendencias: z.string().trim().optional(),
});

export type ContratoFormValues = z.infer<typeof ContratoFormSchema>;
