"use server";

import { z } from "zod";
import { getUsuarioAtual } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

const AlterarSenhaSchema = z
  .object({
    senhaAtual: z.string().min(1, { message: "Informe sua senha atual." }),
    novaSenha: z
      .string()
      .min(6, { message: "A nova senha deve ter pelo menos 6 caracteres." }),
    confirmarSenha: z.string(),
  })
  .refine((data) => data.novaSenha === data.confirmarSenha, {
    message: "A confirmação não corresponde à nova senha.",
    path: ["confirmarSenha"],
  });

export type AlterarSenhaState = { error?: string; sucesso?: boolean } | undefined;

export async function alterarSenha(
  _prevState: AlterarSenhaState,
  formData: FormData
): Promise<AlterarSenhaState> {
  const usuario = await getUsuarioAtual();

  const validatedFields = AlterarSenhaSchema.safeParse({
    senhaAtual: formData.get("senhaAtual"),
    novaSenha: formData.get("novaSenha"),
    confirmarSenha: formData.get("confirmarSenha"),
  });

  if (!validatedFields.success) {
    return { error: validatedFields.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const { senhaAtual, novaSenha } = validatedFields.data;
  const supabase = await createClient();

  // Reautentica com a senha atual antes de trocar, já que qualquer sessão
  // aberta poderia alterar a senha sem isso.
  const { error: erroLogin } = await supabase.auth.signInWithPassword({
    email: usuario.email,
    password: senhaAtual,
  });
  if (erroLogin) {
    return { error: "Senha atual incorreta." };
  }

  const { error } = await supabase.auth.updateUser({ password: novaSenha });
  if (error) {
    return { error: `Erro ao alterar a senha: ${error.message}` };
  }

  return { sucesso: true };
}
