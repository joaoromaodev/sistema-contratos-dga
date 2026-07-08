import { z } from "zod";

export const ContratoFormSchema = z.object({
  tipoInstrumento: z.enum([
    "AQUISICAO",
    "EMPREITADA_GLOBAL",
    "LOCACAO_IMOVEL",
    "PRESTACAO_SERVICOS",
    "CESSAO_RECIPROCA",
    "ENGENHARIA_DIVERSOS",
    "PARCERIA_ENTIDADE_PUBLICA",
    "PARCERIA_OSC",
  ]),
  instrumentoJuridico: z.enum([
    "CONTRATO_ADMINISTRATIVO",
    "CONVENIO",
    "ACORDO_COOPERACAO_TECNICA",
    "TERMO_EXECUCAO_DESCENTRALIZADA",
    "TERMO_PARCERIA",
  ]),
  origemNumero: z.enum(["PROCESSO", "GABINETE"]),
  numeroProcesso: z.string().trim().min(1, "Informe o número do processo ou a referência do gabinete."),
  numeroInstrumento: z.string().trim().optional(),
  contraparteNome: z.string().trim().min(1, "Informe o nome da contraparte."),
  contraparteTipo: z.enum([
    "PESSOA_JURIDICA_PRIVADA",
    "PESSOA_FISICA",
    "MUNICIPIO",
    "ORGAO_PUBLICO",
    "OSC",
  ]),
  contraparteDocumento: z.string().trim().optional(),
  objeto: z.string().trim().min(1, "Descreva o objeto do instrumento."),
  modalidadeLicitacao: z.string().trim().optional(),
  dataInicioVigencia: z.string().min(1, "Informe a data de início."),
  dataFimVigenciaAtual: z.string().min(1, "Informe a data de fim."),
  publicacaoDiarioOficial: z.string().optional(),
  observacoesPendencias: z.string().trim().optional(),
});

export type ContratoFormValues = z.infer<typeof ContratoFormSchema>;
