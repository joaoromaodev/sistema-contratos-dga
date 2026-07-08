import { getUsuarioAtual } from "@/lib/auth";

export default async function Home() {
  const usuario = await getUsuarioAtual();

  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <p className="text-sm text-muted-foreground">
        Bem-vindo(a), {usuario.nome} ({usuario.papel}). Dashboard em construção.
      </p>
    </div>
  );
}
