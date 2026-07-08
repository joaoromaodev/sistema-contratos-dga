"use client";

import { useRef, useState, useTransition } from "react";
import { Loader2, Plus, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { criarOpcao, editarOpcao, alternarAtivoOpcao } from "./actions";
import type { CategoriaOpcao } from "@/generated/prisma/enums";

type Opcao = {
  id: string;
  codigo: string;
  rotulo: string;
  ativo: boolean;
};

function LinhaOpcao({ opcao }: { opcao: Opcao }) {
  const [rotulo, setRotulo] = useState(opcao.rotulo);
  const [pending, startTransition] = useTransition();
  const alterado = rotulo !== opcao.rotulo;

  return (
    <div className="flex items-center gap-2 border-b py-2 last:border-0">
      <Input
        value={rotulo}
        onChange={(e) => setRotulo(e.target.value)}
        className="h-8 max-w-sm"
        disabled={pending}
      />
      <code className="hidden shrink-0 text-xs text-muted-foreground sm:block">
        {opcao.codigo}
      </code>
      {alterado && (
        <Button
          size="icon-sm"
          variant="ghost"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              const fd = new FormData();
              fd.set("rotulo", rotulo);
              await editarOpcao(opcao.id, fd);
            })
          }
        >
          {pending ? <Loader2 className="animate-spin" /> : <Check />}
        </Button>
      )}
      <div className="flex-1" />
      <Badge variant={opcao.ativo ? "default" : "secondary"} className="shrink-0">
        {opcao.ativo ? "Ativo" : "Inativo"}
      </Badge>
      <Button
        size="sm"
        variant="outline"
        disabled={pending}
        onClick={() => startTransition(() => alternarAtivoOpcao(opcao.id))}
      >
        {opcao.ativo ? "Desativar" : "Ativar"}
      </Button>
    </div>
  );
}

export function OpcaoListaManager({
  categoria,
  opcoes,
}: {
  categoria: CategoriaOpcao;
  opcoes: Opcao[];
}) {
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="flex flex-col gap-4">
      <div>{opcoes.map((o) => <LinhaOpcao key={o.id} opcao={o} />)}</div>

      <form
        ref={formRef}
        className="flex items-center gap-2"
        action={(formData) =>
          startTransition(async () => {
            await criarOpcao(categoria, formData);
            formRef.current?.reset();
          })
        }
      >
        <Input
          name="rotulo"
          placeholder="Nome da nova opção..."
          className="h-8 max-w-sm"
          required
          disabled={pending}
        />
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? <Loader2 className="animate-spin" /> : <Plus />}
          Adicionar
        </Button>
      </form>
    </div>
  );
}
