import Link from "next/link";
import { notFound } from "next/navigation";
import { Pencil, Archive, ArchiveRestore } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buscarContratoPorId } from "@/lib/contratos";
import { getDiasAlerta, calcularStatusVigencia } from "@/lib/status";
import { getUsuarioAtual, podeEditar, podeArquivar, podeExcluirContrato } from "@/lib/auth";
import { StatusBadge } from "@/components/contratos/status-badge";
import { formatarData, formatarMoeda } from "@/lib/formatters";
import { TIPO_VALOR_LABEL } from "@/lib/constantes-contrato";
import { mapasRotulosTodos } from "@/lib/opcoes";
import { arquivarContrato } from "../actions";
import { AditivoPanel } from "./aditivo-panel";
import { ExcluirContratoDialog } from "./excluir-dialog";

function Campo({ label, valor }: { label: string; valor?: string | null }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm">{valor && valor.length > 0 ? valor : "—"}</p>
    </div>
  );
}

export default async function ContratoDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [contrato, usuario, rotulos] = await Promise.all([
    buscarContratoPorId(id),
    getUsuarioAtual(),
    mapasRotulosTodos(),
  ]);

  if (!contrato) notFound();

  const diasAlerta = await getDiasAlerta(contrato.tipoInstrumento);
  const { status, diasParaVencer } = calcularStatusVigencia(
    contrato.dataFimVigenciaAtual,
    diasAlerta,
    contrato.situacaoAdministrativa
  );

  const podeEditarContrato = podeEditar(usuario.papel);
  const podeArquivarContrato = podeArquivar(usuario.papel);
  const podeExcluirEsteContrato = podeExcluirContrato(usuario.papel);

  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          {contrato.numeroInstrumento && (
            <p className="font-mono text-xs text-muted-foreground">
              {contrato.numeroInstrumento}
            </p>
          )}
          <h1 className="text-2xl font-semibold tracking-tight">
            {contrato.contraparteNome}
          </h1>
          <p className="text-sm text-muted-foreground">
            {rotulos.tipoInstrumento[contrato.tipoInstrumento] ?? contrato.tipoInstrumento} ·{" "}
            {rotulos.instrumentoJuridico[contrato.instrumentoJuridico] ?? contrato.instrumentoJuridico}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge
            status={status}
            diasParaVencer={diasParaVencer}
            dataFimVigenciaAtual={contrato.dataFimVigenciaAtual}
          />
          {podeEditarContrato && (
            <Button
              variant="outline"
              size="sm"
              render={<Link href={`/contratos/${id}/editar`} />}
              nativeButton={false}
            >
              <Pencil />
              Editar
            </Button>
          )}
          {podeArquivarContrato && (
            <form action={arquivarContrato.bind(null, id)}>
              <Button variant="outline" size="sm" type="submit">
                {contrato.situacaoAdministrativa === "ATIVO" ? (
                  <>
                    <Archive /> Encerrar
                  </>
                ) : (
                  <>
                    <ArchiveRestore /> Reativar
                  </>
                )}
              </Button>
            </form>
          )}
          {podeExcluirEsteContrato && (
            <ExcluirContratoDialog
              contratoId={id}
              contraparteNome={contrato.contraparteNome}
            />
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados gerais</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Campo
            label={contrato.origemNumero === "GABINETE" ? "Referência do Gabinete" : "Processo"}
            valor={contrato.numeroProcesso}
          />
          <Campo label="Nº do contrato/termo/acordo" valor={contrato.numeroInstrumento} />
          <Campo
            label="Tipo de credor"
            valor={rotulos.contraparteTipo[contrato.contraparteTipo] ?? contrato.contraparteTipo}
          />
          <Campo label="CNPJ/CPF" valor={contrato.contraparteDocumento} />
          <Campo
            label="Modalidade de licitação"
            valor={
              contrato.modalidadeLicitacao
                ? (rotulos.modalidadeLicitacao[contrato.modalidadeLicitacao] ?? contrato.modalidadeLicitacao)
                : null
            }
          />
          <Campo label="Número da licitação" valor={contrato.numeroLicitacao} />
          <Campo
            label="Publicação no Diário Oficial"
            valor={contrato.publicacaoDiarioOficial ? formatarData(contrato.publicacaoDiarioOficial) : null}
          />
          <div className="sm:col-span-2 lg:col-span-3">
            <p className="text-xs text-muted-foreground">Objeto</p>
            <p className="text-sm">{contrato.objeto}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vigência e Valores</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Campo label="Início da vigência" valor={formatarData(contrato.dataInicioVigencia)} />
          <Campo label="Fim da vigência (atual)" valor={formatarData(contrato.dataFimVigenciaAtual)} />
          {contrato.valores.map((v) => (
            <div key={v.id}>
              <p className="text-xs text-muted-foreground">{TIPO_VALOR_LABEL[v.tipoValor]}</p>
              <p className="text-sm">
                {formatarMoeda(v.valorAtual)}
                {v.valorInicial !== null &&
                  Number(v.valorInicial) !== Number(v.valorAtual) && (
                    <span className="text-muted-foreground">
                      {" "}
                      (inicial: {formatarMoeda(v.valorInicial)})
                    </span>
                  )}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {contrato.observacoesPendencias && (
        <Card>
          <CardHeader>
            <CardTitle>Observações e Pendências</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{contrato.observacoesPendencias}</p>
          </CardContent>
        </Card>
      )}

      <AditivoPanel
        contratoId={id}
        aditivos={contrato.aditivos.map((a) => ({
          ...a,
          novoValor: a.novoValor === null ? null : Number(a.novoValor),
        }))}
        podeEditar={podeEditarContrato}
      />
    </div>
  );
}
