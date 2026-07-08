export function TipoBreakdown({
  itens,
}: {
  itens: { codigo: string; rotulo: string; total: number }[];
}) {
  const max = Math.max(1, ...itens.map((i) => i.total));

  if (itens.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhum contrato ativo cadastrado ainda.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {itens.map((item) => (
        <div key={item.codigo} className="flex items-center gap-3">
          <span className="w-40 shrink-0 truncate text-sm">{item.rotulo}</span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${(item.total / max) * 100}%` }}
            />
          </div>
          <span className="w-6 shrink-0 text-right text-sm tabular-nums text-muted-foreground">
            {item.total}
          </span>
        </div>
      ))}
    </div>
  );
}
