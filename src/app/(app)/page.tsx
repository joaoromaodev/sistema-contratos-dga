import { getUsuarioAtual } from "@/lib/auth";

export default async function Home() {
  const usuario = await getUsuarioAtual();

  return (
    <div className="flex flex-1 flex-col gap-1 p-6">
      <h1 className="text-2xl font-semibold tracking-tight">
        Olá, {usuario.nome.split(" ")[0]}
      </h1>
      <p className="text-sm text-muted-foreground">
        Painel do módulo CCON - indicadores de contratos e convênios em breve.
      </p>
    </div>
  );
}
