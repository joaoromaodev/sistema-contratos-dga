"use client";

import { useActionState, useState } from "react";
import { ChevronDown, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { NativeSelect } from "@/components/ui/native-select";
import { formatarData, formatarMoeda } from "@/lib/formatters";
import { registrarAditivo, type AditivoFormState } from "../actions";

type Aditivo = {
  id: string;
  numeroSequencial: number;
  tipo: string;
  dataAssinatura: Date;
  novaDataFimVigencia: Date | null;
  novoValor: number | null;
  descricao: string | null;
};

const TIPO_ADITIVO_LABEL: Record<string, string> = {
  PRAZO: "Prazo",
  VALOR: "Valor",
  PRAZO_E_VALOR: "Prazo e Valor",
  QUALITATIVO: "Qualitativo",
};

export function AditivoPanel({
  contratoId,
  aditivos,
  podeEditar,
}: {
  contratoId: string;
  aditivos: Aditivo[];
  podeEditar: boolean;
}) {
  const [aberto, setAberto] = useState(false);
  const action = registrarAditivo.bind(null, contratoId);
  const [state, formAction, pending] = useActionState<AditivoFormState, FormData>(
    action,
    undefined
  );

  return (
    <div className="rounded-lg border">
      <button
        type="button"
        onClick={() => setAberto((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium"
      >
        <span>
          Histórico de aditivos{" "}
          <span className="text-muted-foreground">
            ({aditivos.length} registrado{aditivos.length === 1 ? "" : "s"})
          </span>
        </span>
        <ChevronDown
          className={`size-4 transition-transform ${aberto ? "rotate-180" : ""}`}
        />
      </button>

      {aberto && (
        <div className="border-t px-4 py-3">
          {aditivos.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhum aditivo registrado até o momento.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {aditivos.map((a) => (
                <li key={a.id} className="text-sm">
                  <span className="font-medium">
                    {a.numeroSequencial}º Aditivo · {TIPO_ADITIVO_LABEL[a.tipo]}
                  </span>{" "}
                  <span className="text-muted-foreground">
                    assinado em {formatarData(a.dataAssinatura)}
                  </span>
                  {a.novaDataFimVigencia && (
                    <span className="text-muted-foreground">
                      {" "}
                      · nova vigência final: {formatarData(a.novaDataFimVigencia)}
                    </span>
                  )}
                  {a.novoValor !== null && (
                    <span className="text-muted-foreground">
                      {" "}
                      · novo valor: {formatarMoeda(a.novoValor)}
                    </span>
                  )}
                  {a.descricao && (
                    <p className="text-muted-foreground">{a.descricao}</p>
                  )}
                </li>
              ))}
            </ul>
          )}

          {podeEditar && (
            <form action={formAction} className="mt-4 grid gap-3 border-t pt-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="tipo">Tipo de aditivo</Label>
                <NativeSelect id="tipo" name="tipo" required defaultValue="PRAZO">
                  <option value="PRAZO">Prazo</option>
                  <option value="VALOR">Valor</option>
                  <option value="PRAZO_E_VALOR">Prazo e Valor</option>
                  <option value="QUALITATIVO">Qualitativo</option>
                </NativeSelect>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="dataAssinatura">Data de assinatura</Label>
                <Input id="dataAssinatura" name="dataAssinatura" type="date" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="novaDataFimVigencia">Nova data de fim (se houver)</Label>
                <Input id="novaDataFimVigencia" name="novaDataFimVigencia" type="date" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="novoValor">Novo valor (se houver)</Label>
                <Input id="novoValor" name="novoValor" type="number" step="0.01" min="0" />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea id="descricao" name="descricao" rows={2} />
              </div>
              {state?.error && (
                <p className="text-sm text-destructive sm:col-span-2">{state.error}</p>
              )}
              <div className="sm:col-span-2">
                <Button type="submit" size="sm" disabled={pending}>
                  {pending && <Loader2 className="animate-spin" />}
                  Registrar aditivo
                </Button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
