import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { STATUS_LABEL, type StatusVigencia } from "@/lib/status";

function formatarMesAno(data: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(data);
}

export function StatusBadge({
  status,
  diasParaVencer,
  dataFimVigenciaAtual,
}: {
  status: StatusVigencia;
  diasParaVencer: number;
  dataFimVigenciaAtual: Date;
}) {
  if (status === "ENCERRADO") {
    return <Badge variant="secondary">{STATUS_LABEL.ENCERRADO}</Badge>;
  }

  if (status === "VENCIDO") {
    return (
      <Badge variant="destructive">
        Vencido há {Math.abs(diasParaVencer)} dia
        {Math.abs(diasParaVencer) === 1 ? "" : "s"}
      </Badge>
    );
  }

  if (status === "PROXIMO_A_VENCER") {
    return (
      <Badge
        className={cn(
          "border-transparent bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-400"
        )}
      >
        Próximo a vencer ({diasParaVencer}d)
      </Badge>
    );
  }

  return (
    <Badge
      className={cn(
        "border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-400"
      )}
    >
      Vigente até {formatarMesAno(dataFimVigenciaAtual)}
    </Badge>
  );
}
