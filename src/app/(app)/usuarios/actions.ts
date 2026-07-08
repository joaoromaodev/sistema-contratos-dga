"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getUsuarioAtual } from "@/lib/auth";
import { podeGerenciarSistema } from "@/lib/permissoes";
import { createAdminClient } from "@/lib/supabase/admin";
import type { PapelUsuario } from "@/generated/prisma/enums";

async function checarPermissao() {
  const usuario = await getUsuarioAtual();
  if (!podeGerenciarSistema(usuario.papel)) {
    throw new Error("Você não tem permissão para gerenciar usuários.");
  }
  return usuario;
}

function gerarSenhaTemporaria() {
  const alfabeto =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  return Array.from(
    { length: 12 },
    () => alfabeto[Math.floor(Math.random() * alfabeto.length)]
  ).join("");
}

export type CriarUsuarioState =
  | { error?: string; senhaTemporaria?: string; emailCriado?: string }
  | undefined;

export async function criarUsuario(
  _prevState: CriarUsuarioState,
  formData: FormData
): Promise<CriarUsuarioState> {
  await checarPermissao();

  const nome = formData.get("nome")?.toString().trim();
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const papel = formData.get("papel")?.toString() as PapelUsuario;

  if (!nome || !email || !papel) {
    return { error: "Preencha nome, e-mail e papel." };
  }

  const existente = await prisma.usuario.findUnique({ where: { email } });
  if (existente) {
    return { error: "Já existe um usuário com esse e-mail." };
  }

  const senhaTemporaria = gerarSenhaTemporaria();
  const admin = createAdminClient();

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password: senhaTemporaria,
    email_confirm: true,
  });

  if (error || !data.user) {
    return { error: `Erro ao criar usuário no Supabase Auth: ${error?.message}` };
  }

  await prisma.usuario.create({
    data: { authId: data.user.id, nome, email, papel },
  });

  revalidatePath("/usuarios");
  return { senhaTemporaria, emailCriado: email };
}

export async function editarUsuario(id: string, formData: FormData) {
  await checarPermissao();

  const nome = formData.get("nome")?.toString().trim();
  const papel = formData.get("papel")?.toString() as PapelUsuario;
  if (!nome || !papel) throw new Error("Preencha nome e papel.");

  await prisma.usuario.update({ where: { id }, data: { nome, papel } });
  revalidatePath("/usuarios");
}

export async function alternarAtivoUsuario(id: string) {
  const usuarioAtual = await checarPermissao();

  if (usuarioAtual.id === id) {
    throw new Error("Você não pode desativar seu próprio acesso.");
  }

  const usuario = await prisma.usuario.findUniqueOrThrow({ where: { id } });
  await prisma.usuario.update({
    where: { id },
    data: { ativo: !usuario.ativo },
  });
  revalidatePath("/usuarios");
}

/** Exclusão permanente do usuário (login + cadastro). Contratos que ele
 * criou/atualizou são preservados - só perdem a referência (SetNull). */
export async function excluirUsuario(id: string) {
  const usuarioAtual = await checarPermissao();

  if (usuarioAtual.id === id) {
    throw new Error("Você não pode excluir seu próprio usuário.");
  }

  const usuario = await prisma.usuario.findUniqueOrThrow({ where: { id } });

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(usuario.authId);
  if (error) {
    throw new Error(`Erro ao excluir login no Supabase Auth: ${error.message}`);
  }

  await prisma.usuario.delete({ where: { id } });

  revalidatePath("/usuarios");
}
