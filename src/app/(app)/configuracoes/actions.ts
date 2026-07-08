"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getUsuarioAtual, podeGerenciarSistema } from "@/lib/auth";
import type { CategoriaOpcao } from "@/generated/prisma/enums";

function slugify(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

async function checarPermissao() {
  const usuario = await getUsuarioAtual();
  if (!podeGerenciarSistema(usuario.papel)) {
    throw new Error("Você não tem permissão para gerenciar as configurações do sistema.");
  }
}

export async function criarOpcao(categoria: CategoriaOpcao, formData: FormData) {
  await checarPermissao();

  const rotulo = formData.get("rotulo")?.toString().trim();
  if (!rotulo) throw new Error("Informe um nome para a opção.");

  let codigo = slugify(rotulo);
  if (!codigo) throw new Error("Nome inválido.");

  const existente = await prisma.opcaoLista.findUnique({
    where: { categoria_codigo: { categoria, codigo } },
  });
  if (existente) {
    codigo = `${codigo}_${Date.now().toString().slice(-5)}`;
  }

  const ultimo = await prisma.opcaoLista.findFirst({
    where: { categoria },
    orderBy: { ordem: "desc" },
  });

  await prisma.opcaoLista.create({
    data: { categoria, codigo, rotulo, ordem: (ultimo?.ordem ?? 0) + 1 },
  });

  revalidatePath("/configuracoes");
}

export async function editarOpcao(id: string, formData: FormData) {
  await checarPermissao();

  const rotulo = formData.get("rotulo")?.toString().trim();
  if (!rotulo) throw new Error("Informe um nome para a opção.");

  await prisma.opcaoLista.update({ where: { id }, data: { rotulo } });
  revalidatePath("/configuracoes");
}

export async function alternarAtivoOpcao(id: string) {
  await checarPermissao();

  const opcao = await prisma.opcaoLista.findUniqueOrThrow({ where: { id } });
  await prisma.opcaoLista.update({
    where: { id },
    data: { ativo: !opcao.ativo },
  });
  revalidatePath("/configuracoes");
}
