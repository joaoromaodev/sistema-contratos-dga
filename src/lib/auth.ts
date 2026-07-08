import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import type { PapelUsuario } from "@/generated/prisma/enums";

export type UsuarioAtual = {
  id: string;
  authId: string;
  nome: string;
  email: string;
  papel: PapelUsuario;
};

/**
 * Verifica a sessão e retorna o usuário autenticado + seu papel (RBAC).
 * Redireciona para /login se não autenticado, e para /sem-acesso se o
 * usuário existe no Supabase Auth mas ainda não foi provisionado na
 * tabela `usuarios` (papel/coordenadoria).
 */
export const getUsuarioAtual = cache(async (): Promise<UsuarioAtual> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const usuario = await prisma.usuario.findUnique({
    where: { authId: user.id },
    select: { id: true, authId: true, nome: true, email: true, papel: true, ativo: true },
  });

  if (!usuario || !usuario.ativo) {
    redirect("/sem-acesso");
  }

  return usuario;
});

export { podeEditar, podeExcluirOuArquivar, podeGerenciarSistema } from "@/lib/permissoes";
