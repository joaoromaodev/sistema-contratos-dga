"use client";

import { useActionState, useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { NativeSelect } from "@/components/ui/native-select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TIPO_VALOR_LABEL,
  valoresPara,
  instrumentoJuridicoSugeridoPara,
  exigeModalidadePara,
} from "@/lib/constantes-contrato";
import { salvarContrato, type ContratoFormState } from "./actions";
import type { OrigemNumero, TipoValor } from "@/generated/prisma/enums";

type Opcao = { codigo: string; rotulo: string };

type ValorInicial = { tipoValor: TipoValor; valorInicial: number | null; valorAtual: number | null };

export type ContratoFormInitialValues = {
  id?: string;
  tipoInstrumento?: string;
  instrumentoJuridico?: string;
  origemNumero?: OrigemNumero;
  numeroProcesso?: string;
  numeroInstrumento?: string | null;
  contraparteNome?: string;
  contraparteTipo?: string;
  contraparteDocumento?: string | null;
  objeto?: string;
  modalidadeLicitacao?: string | null;
  numeroLicitacao?: string | null;
  dataInicioVigencia?: string;
  dataFimVigenciaAtual?: string;
  publicacaoDiarioOficial?: string | null;
  observacoesPendencias?: string | null;
  valores?: ValorInicial[];
};

export type ContratoFormOpcoes = {
  tipoInstrumento: Opcao[];
  instrumentoJuridico: Opcao[];
  contraparteTipo: Opcao[];
  modalidadeLicitacao: Opcao[];
};

function toDateInputValue(value?: string | null) {
  if (!value) return "";
  return value.slice(0, 10);
}

export function ContratoForm({
  initialValues,
  opcoes,
}: {
  initialValues?: ContratoFormInitialValues;
  opcoes: ContratoFormOpcoes;
}) {
  const [state, action, pending] = useActionState<ContratoFormState, FormData>(
    salvarContrato,
    undefined
  );

  const [tipoInstrumento, setTipoInstrumento] = useState<string>(
    initialValues?.tipoInstrumento ?? ""
  );
  const [instrumentoJuridico, setInstrumentoJuridico] = useState<string>(
    initialValues?.instrumentoJuridico ?? ""
  );
  const [origemNumero, setOrigemNumero] = useState<OrigemNumero>(
    initialValues?.origemNumero ?? "PROCESSO"
  );

  const valoresIniciais = new Map(
    (initialValues?.valores ?? []).map((v) => [v.tipoValor, v])
  );

  const erro = (campo: string) => state?.fieldErrors?.[campo];

  return (
    <form action={action} className="flex flex-col gap-6">
      {initialValues?.id && (
        <input type="hidden" name="id" value={initialValues.id} />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Identificação</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="tipoInstrumento">Tipo de instrumento *</Label>
            <NativeSelect
              id="tipoInstrumento"
              name="tipoInstrumento"
              required
              value={tipoInstrumento}
              onChange={(e) => {
                const novoTipo = e.target.value;
                setTipoInstrumento(novoTipo);
                setInstrumentoJuridico(instrumentoJuridicoSugeridoPara(novoTipo));
              }}
            >
              <option value="" disabled>
                Selecione...
              </option>
              {opcoes.tipoInstrumento.map((o) => (
                <option key={o.codigo} value={o.codigo}>
                  {o.rotulo}
                </option>
              ))}
            </NativeSelect>
            {erro("tipoInstrumento") && (
              <p className="text-sm text-destructive">{erro("tipoInstrumento")}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="instrumentoJuridico">Natureza jurídica *</Label>
            <NativeSelect
              id="instrumentoJuridico"
              name="instrumentoJuridico"
              required
              value={instrumentoJuridico}
              onChange={(e) => setInstrumentoJuridico(e.target.value)}
            >
              <option value="" disabled>
                Selecione...
              </option>
              {opcoes.instrumentoJuridico.map((o) => (
                <option key={o.codigo} value={o.codigo}>
                  {o.rotulo}
                </option>
              ))}
            </NativeSelect>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="origemNumero">Origem da numeração *</Label>
            <NativeSelect
              id="origemNumero"
              name="origemNumero"
              required
              value={origemNumero}
              onChange={(e) => setOrigemNumero(e.target.value as OrigemNumero)}
            >
              <option value="PROCESSO">Processo (SEI/PAE)</option>
              <option value="GABINETE">Demanda do Gabinete (sem processo)</option>
            </NativeSelect>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="numeroProcesso">
              {origemNumero === "GABINETE" ? "Referência do Gabinete *" : "Número do processo *"}
            </Label>
            <Input
              id="numeroProcesso"
              name="numeroProcesso"
              required
              placeholder={origemNumero === "GABINETE" ? "ex: 001 GAB" : "ex: 2021/940713"}
              defaultValue={initialValues?.numeroProcesso}
            />
            {erro("numeroProcesso") && (
              <p className="text-sm text-destructive">{erro("numeroProcesso")}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="numeroInstrumento">Número do contrato/termo/acordo</Label>
            <Input
              id="numeroInstrumento"
              name="numeroInstrumento"
              placeholder="ex: 011/2018"
              defaultValue={initialValues?.numeroInstrumento ?? ""}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="publicacaoDiarioOficial">Publicação no Diário Oficial</Label>
            <Input
              id="publicacaoDiarioOficial"
              name="publicacaoDiarioOficial"
              type="date"
              defaultValue={toDateInputValue(initialValues?.publicacaoDiarioOficial)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Credor e Objeto</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="contraparteTipo">Tipo de credor *</Label>
            <NativeSelect
              id="contraparteTipo"
              name="contraparteTipo"
              required
              defaultValue={initialValues?.contraparteTipo ?? ""}
            >
              <option value="" disabled>
                Selecione...
              </option>
              {opcoes.contraparteTipo.map((o) => (
                <option key={o.codigo} value={o.codigo}>
                  {o.rotulo}
                </option>
              ))}
            </NativeSelect>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="contraparteDocumento">CNPJ/CPF</Label>
            <Input
              id="contraparteDocumento"
              name="contraparteDocumento"
              defaultValue={initialValues?.contraparteDocumento ?? ""}
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="contraparteNome">Credor *</Label>
            <Input
              id="contraparteNome"
              name="contraparteNome"
              required
              defaultValue={initialValues?.contraparteNome}
            />
            {erro("contraparteNome") && (
              <p className="text-sm text-destructive">{erro("contraparteNome")}</p>
            )}
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="objeto">Objeto *</Label>
            <Textarea
              id="objeto"
              name="objeto"
              required
              rows={3}
              defaultValue={initialValues?.objeto}
            />
            {erro("objeto") && (
              <p className="text-sm text-destructive">{erro("objeto")}</p>
            )}
          </div>

          {tipoInstrumento && exigeModalidadePara(tipoInstrumento) && (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="modalidadeLicitacao">Modalidade de licitação</Label>
                <NativeSelect
                  id="modalidadeLicitacao"
                  name="modalidadeLicitacao"
                  defaultValue={initialValues?.modalidadeLicitacao ?? ""}
                >
                  <option value="">Selecione...</option>
                  {opcoes.modalidadeLicitacao.map((o) => (
                    <option key={o.codigo} value={o.codigo}>
                      {o.rotulo}
                    </option>
                  ))}
                </NativeSelect>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="numeroLicitacao">Número da licitação</Label>
                <Input
                  id="numeroLicitacao"
                  name="numeroLicitacao"
                  placeholder="ex: 010/2026"
                  defaultValue={initialValues?.numeroLicitacao ?? ""}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vigência e Valores</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="dataInicioVigencia">Início da vigência *</Label>
            <Input
              id="dataInicioVigencia"
              name="dataInicioVigencia"
              type="date"
              required
              defaultValue={toDateInputValue(initialValues?.dataInicioVigencia)}
            />
            {erro("dataInicioVigencia") && (
              <p className="text-sm text-destructive">{erro("dataInicioVigencia")}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="dataFimVigenciaAtual">Fim da vigência (atual) *</Label>
            <Input
              id="dataFimVigenciaAtual"
              name="dataFimVigenciaAtual"
              type="date"
              required
              defaultValue={toDateInputValue(initialValues?.dataFimVigenciaAtual)}
            />
            {erro("dataFimVigenciaAtual") && (
              <p className="text-sm text-destructive">{erro("dataFimVigenciaAtual")}</p>
            )}
          </div>

          {tipoInstrumento &&
            valoresPara(tipoInstrumento).map((tipoValor) => {
              const inicial = valoresIniciais.get(tipoValor);
              return (
                <div key={tipoValor} className="contents">
                  <div className="space-y-1.5">
                    <Label htmlFor={`valorInicial__${tipoValor}`}>
                      {TIPO_VALOR_LABEL[tipoValor]} (inicial)
                    </Label>
                    <Input
                      id={`valorInicial__${tipoValor}`}
                      name={`valorInicial__${tipoValor}`}
                      type="number"
                      step="0.01"
                      min="0"
                      defaultValue={inicial?.valorInicial ?? ""}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor={`valorAtual__${tipoValor}`}>
                      {TIPO_VALOR_LABEL[tipoValor]} (atual)
                    </Label>
                    <Input
                      id={`valorAtual__${tipoValor}`}
                      name={`valorAtual__${tipoValor}`}
                      type="number"
                      step="0.01"
                      min="0"
                      defaultValue={inicial?.valorAtual ?? ""}
                    />
                  </div>
                </div>
              );
            })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Observações</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            name="observacoesPendencias"
            rows={3}
            placeholder="Pendências, observações gerais..."
            defaultValue={initialValues?.observacoesPendencias ?? ""}
          />
        </CardContent>
      </Card>

      {state?.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={pending}>
          {pending && <Loader2 className="animate-spin" />}
          Salvar
        </Button>
      </div>
    </form>
  );
}
