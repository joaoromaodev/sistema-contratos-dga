import type { PapelUsuario } from "@/generated/prisma/enums";

// Funções puras de RBAC - sem "server-only" porque também são usadas em
// Client Components (ex: para decidir quais itens mostrar na sidebar).

export function podeEditar(papel: PapelUsuario) {
  return papel === "COORDENADOR_CCON" || papel === "TECNICO_CCON";
}

export function podeExcluirOuArquivar(papel: PapelUsuario) {
  return papel === "COORDENADOR_CCON";
}

/** Configurações do sistema e gestão de usuários - restrito ao Coordenador */
export function podeGerenciarSistema(papel: PapelUsuario) {
  return papel === "COORDENADOR_CCON";
}
