import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  listarContratos,
  type Categoria,
  type StatusFiltro,
  type OrdenarPor,
} from "@/lib/contratos";
import { getDiasAlerta, calcularStatusVigencia } from "@/lib/status";
import { StatusBadge } from "@/components/contratos/status-badge";
import { ContratosFiltros } from "./filtros";
import { TIPO_INSTRUMENTO_LABEL } from "@/lib/constantes-contrato";
import { formatarMoeda, valorReferencia } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { TipoInstrumento } from "@/generated/prisma/enums";

const CATEGORIA_TABS: { value: Categoria | "todos"; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "contratos", label: "Contratos" },
  { value: "convenios", label: "Convênios e Parcerias" },
];

export default async function ContratosPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const categoria = sp.categoria as Categoria | undefined;

  const { contratos, total, pagina, totalPaginas } = await listarContratos({
    categoria,
    tipoInstrumento: sp.tipoInstrumento as TipoInstrumento | undefined,
    busca: sp.busca,
    status: sp.status as StatusFiltro | undefined,
    ordenarPor: sp.ordenarPor as OrdenarPor | undefined,
    pagina: sp.pagina ? Number(sp.pagina) : undefined,
  });

  const diasAlertaPadrao = await getDiasAlerta();

  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Contratos e Convênios
          </h1>
          <p className="text-sm text-muted-foreground">
            {total} registro{total === 1 ? "" : "s"} encontrado
            {total === 1 ? "" : "s"}
          </p>
        </div>
        <Button render={<Link href="/contratos/novo" />} nativeButton={false}>
          <Plus />
          Novo Contrato
        </Button>
      </div>

      <div className="flex gap-1 border-b">
        {CATEGORIA_TABS.map((tab) => {
          const params = new URLSearchParams();
          if (tab.value !== "todos") params.set("categoria", tab.value);
          const query = params.toString();
          const href = `/contratos${query ? `?${query}` : ""}`;
          const ativo = (categoria ?? "todos") === tab.value;
          return (
            <Link
              key={tab.value}
              href={href}
              className={cn(
                "border-b-2 px-3 pb-2 text-sm font-medium transition-colors",
                ativo
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      <ContratosFiltros />

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Contraparte</TableHead>
              <TableHead>Objeto</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Situação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contratos.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-10 text-center text-muted-foreground"
                >
                  Nenhum contrato encontrado com os filtros atuais.
                </TableCell>
              </TableRow>
            )}
            {contratos.map((contrato) => {
              const { status, diasParaVencer } = calcularStatusVigencia(
                contrato.dataFimVigenciaAtual,
                diasAlertaPadrao,
                contrato.situacaoAdministrativa
              );
              return (
                <TableRow key={contrato.id}>
                  <TableCell className="font-mono text-xs">
                    <Link
                      href={`/contratos/${contrato.id}`}
                      className="hover:underline"
                    >
                      {contrato.codigoIdentificacao}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {TIPO_INSTRUMENTO_LABEL[contrato.tipoInstrumento]}
                  </TableCell>
                  <TableCell className="max-w-48 truncate">
                    {contrato.contraparteNome}
                  </TableCell>
                  <TableCell className="max-w-64 truncate text-muted-foreground">
                    {contrato.objeto}
                  </TableCell>
                  <TableCell>
                    {formatarMoeda(valorReferencia(contrato.valores))}
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      status={status}
                      diasParaVencer={diasParaVencer}
                      dataFimVigenciaAtual={contrato.dataFimVigenciaAtual}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {totalPaginas > 1 && (
        <div className="flex items-center justify-center gap-2 text-sm">
          {Array.from({ length: totalPaginas }).map((_, i) => {
            const p = i + 1;
            return (
              <Link
                key={p}
                href={`?pagina=${p}`}
                className={cn(
                  "flex size-8 items-center justify-center rounded-md",
                  p === pagina
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
              >
                {p}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
