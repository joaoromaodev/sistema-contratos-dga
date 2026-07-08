"use client";

import { useState, useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { excluirContrato } from "../actions";

export function ExcluirContratoDialog({
  contratoId,
  contraparteNome,
}: {
  contratoId: string;
  contraparteNome: string;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="destructive" size="sm">
            <Trash2 />
            Excluir
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir contrato permanentemente?</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir o contrato de <strong>{contraparteNome}</strong>?
            Essa ação não pode ser desfeita e todo o histórico de aditivos será perdido
            junto. Se a intenção é apenas parar de acompanhar este contrato, prefira
            &quot;Encerrar&quot; em vez de excluir.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={pending}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                await excluirContrato(contratoId);
              })
            }
          >
            {pending && <Loader2 className="animate-spin" />}
            Sim, excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
