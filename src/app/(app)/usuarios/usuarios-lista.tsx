"use client";

import { useState, useTransition } from "react";
import { Loader2, Check, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { NativeSelect } from "@/components/ui/native-select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { editarUsuario, alternarAtivoUsuario, excluirUsuario } from "./actions";
import type { PapelUsuario } from "@/generated/prisma/enums";

type Usuario = {
  id: string;
  nome: string;
  email: string;
  papel: PapelUsuario;
  ativo: boolean;
};

function LinhaUsuario({
  usuario,
  souEu,
}: {
  usuario: Usuario;
  souEu: boolean;
}) {
  const [nome, setNome] = useState(usuario.nome);
  const [papel, setPapel] = useState(usuario.papel);
  const [pending, startTransition] = useTransition();
  const alterado = nome !== usuario.nome || papel !== usuario.papel;

  return (
    <TableRow>
      <TableCell>
        <Input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="h-8 max-w-48"
          disabled={pending}
        />
      </TableCell>
      <TableCell className="text-muted-foreground">{usuario.email}</TableCell>
      <TableCell>
        <NativeSelect
          value={papel}
          onChange={(e) => setPapel(e.target.value as PapelUsuario)}
          className="h-8 max-w-48"
          disabled={pending}
        >
          <option value="TECNICO_CCON">Técnico CCON</option>
          <option value="COORDENADOR_CCON">Coordenador CCON</option>
          <option value="DIRETOR">Diretor (visualização)</option>
        </NativeSelect>
      </TableCell>
      <TableCell>
        <Badge variant={usuario.ativo ? "default" : "secondary"}>
          {usuario.ativo ? "Ativo" : "Inativo"}
        </Badge>
      </TableCell>
      <TableCell className="flex items-center gap-2">
        {alterado && (
          <Button
            size="icon-sm"
            variant="ghost"
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                const fd = new FormData();
                fd.set("nome", nome);
                fd.set("papel", papel);
                await editarUsuario(usuario.id, fd);
              })
            }
          >
            {pending ? <Loader2 className="animate-spin" /> : <Check />}
          </Button>
        )}
        {!souEu && (
          <Button
            size="sm"
            variant="outline"
            disabled={pending}
            onClick={() => startTransition(() => alternarAtivoUsuario(usuario.id))}
          >
            {usuario.ativo ? "Desativar" : "Ativar"}
          </Button>
        )}
        {!souEu && (
          <ConfirmDialog
            trigger={
              <Button size="icon-sm" variant="destructive" disabled={pending}>
                <Trash2 />
              </Button>
            }
            title="Excluir usuário permanentemente?"
            description={
              <>
                Tem certeza que deseja excluir <strong>{usuario.nome}</strong> (
                {usuario.email})? O login será removido e a pessoa não conseguirá
                mais acessar o sistema. Contratos que ela cadastrou ou editou são
                mantidos, apenas sem essa referência. Essa ação não pode ser
                desfeita — se a intenção é só bloquear o acesso temporariamente,
                prefira &quot;Desativar&quot;.
              </>
            }
            confirmLabel="Sim, excluir"
            onConfirm={() => excluirUsuario(usuario.id)}
          />
        )}
      </TableCell>
    </TableRow>
  );
}

export function UsuariosLista({
  usuarios,
  usuarioAtualId,
}: {
  usuarios: Usuario[];
  usuarioAtualId: string;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>E-mail</TableHead>
          <TableHead>Papel</TableHead>
          <TableHead>Situação</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {usuarios.map((u) => (
          <LinhaUsuario key={u.id} usuario={u} souEu={u.id === usuarioAtualId} />
        ))}
      </TableBody>
    </Table>
  );
}
