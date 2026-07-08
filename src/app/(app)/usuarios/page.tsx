import { redirect } from "next/navigation";

import { getUsuarioAtual } from "@/lib/auth";
import { podeGerenciarSistema } from "@/lib/permissoes";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NovoUsuarioForm } from "./novo-usuario-form";
import { UsuariosLista } from "./usuarios-lista";

export default async function UsuariosPage() {
  const usuarioAtual = await getUsuarioAtual();
  if (!podeGerenciarSistema(usuarioAtual.papel)) {
    redirect("/");
  }

  const usuarios = await prisma.usuario.findMany({
    orderBy: { criadoEm: "asc" },
    select: { id: true, nome: true, email: true, papel: true, ativo: true },
  });

  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Gestão de Usuários
        </h1>
        <p className="text-sm text-muted-foreground">
          Cadastre e gerencie o acesso da equipe do CCON ao sistema.
        </p>
      </div>

      <NovoUsuarioForm />

      <Card>
        <CardHeader>
          <CardTitle>Usuários cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          <UsuariosLista usuarios={usuarios} usuarioAtualId={usuarioAtual.id} />
        </CardContent>
      </Card>
    </div>
  );
}
