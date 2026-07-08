"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TIPO_INSTRUMENTO_LABEL } from "@/lib/constantes-contrato";

const STATUS_OPTIONS = [
  { value: "TODOS", label: "Todos (exceto encerrados)" },
  { value: "VIGENTE", label: "Vigente" },
  { value: "PROXIMO_A_VENCER", label: "Próximo a vencer" },
  { value: "VENCIDO", label: "Vencido" },
  { value: "ENCERRADO", label: "Encerrado" },
];

const ORDENAR_OPTIONS = [
  { value: "vigencia", label: "Vigência (mais próxima primeiro)" },
  { value: "contraparte", label: "Contraparte (A-Z)" },
  { value: "recente", label: "Cadastro mais recente" },
];

const TIPO_LABEL: Record<string, string> = {
  TODOS: "Todos os tipos",
  ...TIPO_INSTRUMENTO_LABEL,
};
const STATUS_LABEL: Record<string, string> = Object.fromEntries(
  STATUS_OPTIONS.map((o) => [o.value, o.label])
);
const ORDENAR_LABEL: Record<string, string> = Object.fromEntries(
  ORDENAR_OPTIONS.map((o) => [o.value, o.label])
);

export function ContratosFiltros() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [busca, setBusca] = useState(searchParams.get("busca") ?? "");
  const [, startTransition] = useTransition();

  const atualizarQuery = useCallback(
    (chave: string, valor: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (valor && valor !== "TODOS") {
        params.set(chave, valor);
      } else {
        params.delete(chave);
      }
      params.delete("pagina");
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [pathname, router, searchParams]
  );

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="relative w-full sm:max-w-xs">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por objeto, contraparte, processo..."
          className="pl-8"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") atualizarQuery("busca", busca);
          }}
          onBlur={() => atualizarQuery("busca", busca)}
        />
      </div>

      <Select
        defaultValue={searchParams.get("tipoInstrumento") ?? "TODOS"}
        onValueChange={(v) => atualizarQuery("tipoInstrumento", v as string)}
      >
        <SelectTrigger className="w-full sm:w-56">
          <SelectValue placeholder="Tipo de instrumento">
            {(value: string) => TIPO_LABEL[value] ?? "Todos os tipos"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="TODOS">Todos os tipos</SelectItem>
          {Object.entries(TIPO_INSTRUMENTO_LABEL).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        defaultValue={searchParams.get("status") ?? "TODOS"}
        onValueChange={(v) => atualizarQuery("status", v as string)}
      >
        <SelectTrigger className="w-full sm:w-52">
          <SelectValue placeholder="Situação">
            {(value: string) => STATUS_LABEL[value] ?? STATUS_OPTIONS[0].label}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        defaultValue={searchParams.get("ordenarPor") ?? "vigencia"}
        onValueChange={(v) => atualizarQuery("ordenarPor", v as string)}
      >
        <SelectTrigger className="w-full sm:w-64">
          <SelectValue placeholder="Ordenar por">
            {(value: string) => ORDENAR_LABEL[value] ?? ORDENAR_OPTIONS[0].label}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {ORDENAR_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
