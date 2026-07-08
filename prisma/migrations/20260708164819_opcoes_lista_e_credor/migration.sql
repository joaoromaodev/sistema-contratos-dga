/*
  Warnings:

  - The `tipoInstrumento` column on the `configuracoes_alerta` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `tipoInstrumento` on the `contratos` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `instrumentoJuridico` on the `contratos` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `contraparteTipo` on the `contratos` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "CategoriaOpcao" AS ENUM ('TIPO_INSTRUMENTO', 'INSTRUMENTO_JURIDICO', 'CONTRAPARTE_TIPO', 'MODALIDADE_LICITACAO');

-- AlterTable (cast preserva os dados existentes em vez de dropar a coluna)
ALTER TABLE "configuracoes_alerta" ALTER COLUMN "tipoInstrumento" TYPE TEXT USING "tipoInstrumento"::TEXT;

-- AlterTable (cast preserva os dados existentes em vez de dropar a coluna)
ALTER TABLE "contratos" ADD COLUMN     "numeroLicitacao" TEXT,
ALTER COLUMN "tipoInstrumento" TYPE TEXT USING "tipoInstrumento"::TEXT,
ALTER COLUMN "instrumentoJuridico" TYPE TEXT USING "instrumentoJuridico"::TEXT,
ALTER COLUMN "contraparteTipo" TYPE TEXT USING "contraparteTipo"::TEXT;

-- DropEnum
DROP TYPE "ContraparteTipo";

-- DropEnum
DROP TYPE "InstrumentoJuridico";

-- DropEnum
DROP TYPE "TipoInstrumento";

-- CreateTable
CREATE TABLE "opcoes_lista" (
    "id" TEXT NOT NULL,
    "categoria" "CategoriaOpcao" NOT NULL,
    "codigo" TEXT NOT NULL,
    "rotulo" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "opcoes_lista_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "opcoes_lista_categoria_codigo_key" ON "opcoes_lista"("categoria", "codigo");

-- Nota: os índices em configuracoes_alerta.tipoInstrumento, contratos.tipoInstrumento
-- e contratos.instrumentoJuridico já existiam (criados sobre as colunas enum
-- originais) e são preservados automaticamente pelo ALTER COLUMN TYPE acima -
-- recriá-los aqui geraria erro de "relation already exists".
