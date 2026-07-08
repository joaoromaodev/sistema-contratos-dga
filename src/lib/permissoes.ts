import type { PapelUsuario } from "@/generated/prisma/enums";

// Funções puras de RBAC - sem "server-only" porque também são usadas em
// Client Components (ex: para decidir quais itens mostrar na sidebar).

/** Cadastrar/editar contratos e registrar aditivos */
export function podeEditar(papel: PapelUsuario) {
  return papel === "COORDENADOR_CCON" || papel === "TECNICO_CCON" || papel === "DIRETOR";
}

/** Encerrar/reativar contrato (situação administrativa) */
export function podeArquivar(papel: PapelUsuario) {
  return papel === "COORDENADOR_CCON" || papel === "TECNICO_CCON" || papel === "DIRETOR";
}

/** Excluir contrato permanentemente - mais restrito que encerrar/reativar */
export function podeExcluirContrato(papel: PapelUsuario) {
  return papel === "COORDENADOR_CCON" || papel === "DIRETOR";
}

/** Gestão de usuários (criar/editar/excluir/ativar) - restrito ao Diretor */
export function podeGerenciarUsuarios(papel: PapelUsuario) {
  return papel === "DIRETOR";
}

/** Configurações do sistema (listas configuráveis) */
export function podeGerenciarConfiguracoes(papel: PapelUsuario) {
  return papel === "COORDENADOR_CCON" || papel === "DIRETOR";
}
