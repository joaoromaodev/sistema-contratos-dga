import { Button } from "@/components/ui/button";
import { logout } from "@/lib/actions/logout";

export default function SemAcessoPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-center">
      <h1 className="text-xl font-semibold">Acesso ainda não liberado</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        Seu login foi validado, mas seu usuário ainda não foi cadastrado no
        módulo CCON. Peça ao Coordenador do CCON para liberar seu acesso.
      </p>
      <form action={logout}>
        <Button type="submit" variant="outline">
          Sair
        </Button>
      </form>
    </div>
  );
}
