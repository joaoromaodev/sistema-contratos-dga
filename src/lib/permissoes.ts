import type { PapelUsuario } from "@/generated/prisma/enums";

// Funções puras de RBAC - sem "server-only" porque também são usadas em
// Client Components (ex: para decidir quais itens mostrar na sidebar).
//
// Diretor e Coordenador CCON têm acesso funcional idêntico (acesso completo).
// Técnico CCON é o único papel com restrições: não arquiva/exclui contratos
// nem gerencia usuários/configurações do sistema.

export function podeEditar(papel: PapelUsuario) {
  return papel === "COORDENADOR_CCON" || papel === "TECNICO_CCON" || papel === "DIRETOR";
}

export function podeExcluirOuArquivar(papel: PapelUsuario) {
  return papel === "COORDENADOR_CCON" || papel === "DIRETOR";
}

/** Configurações do sistema e gestão de usuários */
export function podeGerenciarSistema(papel: PapelUsuario) {
  return papel === "COORDENADOR_CCON" || papel === "DIRETOR";
}
