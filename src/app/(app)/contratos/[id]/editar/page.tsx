import { notFound } from "next/navigation";

import { buscarContratoPorId } from "@/lib/contratos";
import { ContratoForm } from "../../contrato-form";

export default async function EditarContratoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const contrato = await buscarContratoPorId(id);

  if (!contrato) notFound();

  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Editar Contrato · {contrato.codigoIdentificacao}
        </h1>
      </div>
      <div className="max-w-3xl">
        <ContratoForm
          initialValues={{
            id: contrato.id,
            tipoInstrumento: contrato.tipoInstrumento,
            instrumentoJuridico: contrato.instrumentoJuridico,
            origemNumero: contrato.origemNumero,
            numeroProcesso: contrato.numeroProcesso,
            numeroInstrumento: contrato.numeroInstrumento,
            contraparteNome: contrato.contraparteNome,
            contraparteTipo: contrato.contraparteTipo,
            contraparteDocumento: contrato.contraparteDocumento,
            objeto: contrato.objeto,
            modalidadeLicitacao: contrato.modalidadeLicitacao,
            dataInicioVigencia: contrato.dataInicioVigencia.toISOString(),
            dataFimVigenciaAtual: contrato.dataFimVigenciaAtual.toISOString(),
            publicacaoDiarioOficial:
              contrato.publicacaoDiarioOficial?.toISOString() ?? null,
            observacoesPendencias: contrato.observacoesPendencias,
            valores: contrato.valores.map((v) => ({
              tipoValor: v.tipoValor,
              valorInicial: v.valorInicial ? Number(v.valorInicial) : null,
              valorAtual: v.valorAtual ? Number(v.valorAtual) : null,
            })),
          }}
        />
      </div>
    </div>
  );
}
