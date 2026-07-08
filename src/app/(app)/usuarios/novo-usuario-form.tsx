"use client";

import { useActionState } from "react";
import { Loader2, UserPlus, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { criarUsuario, type CriarUsuarioState } from "./actions";

export function NovoUsuarioForm() {
  const [state, action, pending] = useActionState<CriarUsuarioState, FormData>(
    criarUsuario,
    undefined
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Novo usuário</CardTitle>
        <CardDescription>
          Cria o login (Supabase Auth) e o cadastro no CCON de uma vez. Você
          recebe uma senha temporária para repassar à pessoa.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {state?.senhaTemporaria ? (
          <div className="space-y-3 rounded-lg border bg-muted/40 p-4">
            <p className="text-sm">
              Usuário <strong>{state.emailCriado}</strong> criado com sucesso.
              Repasse a senha temporária abaixo (ela não será mostrada de novo):
            </p>
            <div className="flex items-center gap-2">
              <code className="rounded bg-background px-3 py-1.5 text-sm">
                {state.senhaTemporaria}
              </code>
              <Button
                type="button"
                size="icon-sm"
                variant="outline"
                onClick={() =>
                  navigator.clipboard.writeText(state.senhaTemporaria!)
                }
              >
                <Copy />
              </Button>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
            >
              Cadastrar outro usuário
            </Button>
          </div>
        ) : (
          <form action={action} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="nome">Nome</Label>
              <Input id="nome" name="nome" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="papel">Papel</Label>
              <NativeSelect id="papel" name="papel" required defaultValue="TECNICO_CCON">
                <option value="TECNICO_CCON">Técnico CCON</option>
                <option value="COORDENADOR_CCON">Coordenador CCON</option>
                <option value="DIRETOR">Diretor</option>
              </NativeSelect>
            </div>
            {state?.error && (
              <p className="text-sm text-destructive sm:col-span-2">{state.error}</p>
            )}
            <div className="sm:col-span-2">
              <Button type="submit" disabled={pending}>
                {pending ? <Loader2 className="animate-spin" /> : <UserPlus />}
                Criar usuário
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
