import "server-only";
import { prisma } from "@/lib/prisma";
import type { CategoriaOpcao } from "@/generated/prisma/enums";

export async function listarOpcoes(categoria: CategoriaOpcao, apenasAtivas = true) {
  return prisma.opcaoLista.findMany({
    where: apenasAtivas ? { categoria, ativo: true } : { categoria },
    orderBy: [{ ordem: "asc" }, { rotulo: "asc" }],
  });
}

export async function mapaRotulos(categoria: CategoriaOpcao): Promise<Record<string, string>> {
  const opcoes = await listarOpcoes(categoria, false);
  return Object.fromEntries(opcoes.map((o) => [o.codigo, o.rotulo]));
}

/** Opções (codigo+rotulo) das 4 categorias de uma vez - usado no formulário de cadastro/edição */
export async function formOpcoes() {
  const [tipoInstrumento, instrumentoJuridico, contraparteTipo, modalidadeLicitacao] =
    await Promise.all([
      listarOpcoes("TIPO_INSTRUMENTO"),
      listarOpcoes("INSTRUMENTO_JURIDICO"),
      listarOpcoes("CONTRAPARTE_TIPO"),
      listarOpcoes("MODALIDADE_LICITACAO"),
    ]);
  const projetar = (lista: { codigo: string; rotulo: string }[]) =>
    lista.map((o) => ({ codigo: o.codigo, rotulo: o.rotulo }));
  return {
    tipoInstrumento: projetar(tipoInstrumento),
    instrumentoJuridico: projetar(instrumentoJuridico),
    contraparteTipo: projetar(contraparteTipo),
    modalidadeLicitacao: projetar(modalidadeLicitacao),
  };
}

/** Busca os mapas de rótulo das 4 categorias de uma vez (usado nas listagens/detalhe) */
export async function mapasRotulosTodos() {
  const [tipoInstrumento, instrumentoJuridico, contraparteTipo, modalidadeLicitacao] =
    await Promise.all([
      mapaRotulos("TIPO_INSTRUMENTO"),
      mapaRotulos("INSTRUMENTO_JURIDICO"),
      mapaRotulos("CONTRAPARTE_TIPO"),
      mapaRotulos("MODALIDADE_LICITACAO"),
    ]);
  return { tipoInstrumento, instrumentoJuridico, contraparteTipo, modalidadeLicitacao };
}
