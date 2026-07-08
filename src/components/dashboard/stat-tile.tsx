import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const VARIANTS = {
  neutral: "bg-muted text-foreground",
  vigente: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-400",
  atencao: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-400",
  critico: "bg-destructive/10 text-destructive",
  encerrado: "bg-secondary text-secondary-foreground",
} as const;

export function StatTile({
  label,
  value,
  icon: Icon,
  variant = "neutral",
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  variant?: keyof typeof VARIANTS;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-lg",
            VARIANTS[variant]
          )}
        >
          <Icon className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="text-2xl leading-tight font-semibold tabular-nums">
            {value}
          </p>
          <p className="truncate text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
