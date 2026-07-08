-- CreateEnum
CREATE TYPE "TipoInstrumento" AS ENUM ('AQUISICAO', 'EMPREITADA_GLOBAL', 'LOCACAO_IMOVEL', 'PRESTACAO_SERVICOS', 'CESSAO_RECIPROCA', 'ENGENHARIA_DIVERSOS', 'PARCERIA_ENTIDADE_PUBLICA', 'PARCERIA_OSC');

-- CreateEnum
CREATE TYPE "InstrumentoJuridico" AS ENUM ('CONTRATO_ADMINISTRATIVO', 'CONVENIO', 'ACORDO_COOPERACAO_TECNICA', 'TERMO_EXECUCAO_DESCENTRALIZADA', 'TERMO_PARCERIA');

-- CreateEnum
CREATE TYPE "OrigemNumero" AS ENUM ('PROCESSO', 'GABINETE');

-- CreateEnum
CREATE TYPE "ContraparteTipo" AS ENUM ('PESSOA_JURIDICA_PRIVADA', 'PESSOA_FISICA', 'MUNICIPIO', 'ORGAO_PUBLICO', 'OSC');

-- CreateEnum
CREATE TYPE "SituacaoAdministrativa" AS ENUM ('ATIVO', 'ENCERRADO');

-- CreateEnum
CREATE TYPE "TipoValor" AS ENUM ('VALOR_UNICO', 'MENSAL', 'ANUAL', 'GLOBAL', 'PARTE_SEDUC', 'PARTE_ENTIDADE');

-- CreateEnum
CREATE TYPE "TipoAditivo" AS ENUM ('PRAZO', 'VALOR', 'PRAZO_E_VALOR', 'QUALITATIVO');

-- CreateEnum
CREATE TYPE "PapelUsuario" AS ENUM ('DIRETOR', 'COORDENADOR_CCON', 'TECNICO_CCON');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "authId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "papel" "PapelUsuario" NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contratos" (
    "id" TEXT NOT NULL,
    "numeroSequencial" SERIAL NOT NULL,
    "codigoIdentificacao" TEXT NOT NULL,
    "tipoInstrumento" "TipoInstrumento" NOT NULL,
    "instrumentoJuridico" "InstrumentoJuridico" NOT NULL,
    "origemNumero" "OrigemNumero" NOT NULL,
    "numeroProcesso" TEXT NOT NULL,
    "numeroInstrumento" TEXT,
    "contraparteNome" TEXT NOT NULL,
    "contraparteDocumento" TEXT,
    "contraparteTipo" "ContraparteTipo" NOT NULL,
    "objeto" TEXT NOT NULL,
    "modalidadeLicitacao" TEXT,
    "dataInicioVigencia" TIMESTAMP(3) NOT NULL,
    "dataFimVigenciaAtual" TIMESTAMP(3) NOT NULL,
    "situacaoAdministrativa" "SituacaoAdministrativa" NOT NULL DEFAULT 'ATIVO',
    "publicacaoDiarioOficial" TIMESTAMP(3),
    "observacoesPendencias" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "criadoPorId" TEXT,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,
    "atualizadoPorId" TEXT,

    CONSTRAINT "contratos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contrato_valores" (
    "id" TEXT NOT NULL,
    "contratoId" TEXT NOT NULL,
    "tipoValor" "TipoValor" NOT NULL,
    "valorInicial" DECIMAL(14,2),
    "valorAtual" DECIMAL(14,2),

    CONSTRAINT "contrato_valores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aditivos" (
    "id" TEXT NOT NULL,
    "contratoId" TEXT NOT NULL,
    "numeroSequencial" INTEGER NOT NULL,
    "tipo" "TipoAditivo" NOT NULL,
    "dataAssinatura" TIMESTAMP(3) NOT NULL,
    "novaDataFimVigencia" TIMESTAMP(3),
    "novoValor" DECIMAL(14,2),
    "descricao" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "aditivos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historico_alteracoes" (
    "id" TEXT NOT NULL,
    "contratoId" TEXT NOT NULL,
    "usuarioId" TEXT,
    "campoAlterado" TEXT NOT NULL,
    "valorAnterior" TEXT,
    "valorNovo" TEXT,
    "dataHora" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "historico_alteracoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configuracoes_alerta" (
    "id" TEXT NOT NULL,
    "tipoInstrumento" "TipoInstrumento",
    "diasAlerta" INTEGER NOT NULL DEFAULT 150,

    CONSTRAINT "configuracoes_alerta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_authId_key" ON "usuarios"("authId");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "contratos_codigoIdentificacao_key" ON "contratos"("codigoIdentificacao");

-- CreateIndex
CREATE INDEX "contratos_tipoInstrumento_idx" ON "contratos"("tipoInstrumento");

-- CreateIndex
CREATE INDEX "contratos_instrumentoJuridico_idx" ON "contratos"("instrumentoJuridico");

-- CreateIndex
CREATE INDEX "contratos_situacaoAdministrativa_idx" ON "contratos"("situacaoAdministrativa");

-- CreateIndex
CREATE INDEX "contratos_dataFimVigenciaAtual_idx" ON "contratos"("dataFimVigenciaAtual");

-- CreateIndex
CREATE INDEX "contrato_valores_contratoId_idx" ON "contrato_valores"("contratoId");

-- CreateIndex
CREATE UNIQUE INDEX "aditivos_contratoId_numeroSequencial_key" ON "aditivos"("contratoId", "numeroSequencial");

-- CreateIndex
CREATE INDEX "historico_alteracoes_contratoId_idx" ON "historico_alteracoes"("contratoId");

-- CreateIndex
CREATE UNIQUE INDEX "configuracoes_alerta_tipoInstrumento_key" ON "configuracoes_alerta"("tipoInstrumento");

-- AddForeignKey
ALTER TABLE "contratos" ADD CONSTRAINT "contratos_criadoPorId_fkey" FOREIGN KEY ("criadoPorId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contratos" ADD CONSTRAINT "contratos_atualizadoPorId_fkey" FOREIGN KEY ("atualizadoPorId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contrato_valores" ADD CONSTRAINT "contrato_valores_contratoId_fkey" FOREIGN KEY ("contratoId") REFERENCES "contratos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aditivos" ADD CONSTRAINT "aditivos_contratoId_fkey" FOREIGN KEY ("contratoId") REFERENCES "contratos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historico_alteracoes" ADD CONSTRAINT "historico_alteracoes_contratoId_fkey" FOREIGN KEY ("contratoId") REFERENCES "contratos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historico_alteracoes" ADD CONSTRAINT "historico_alteracoes_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
