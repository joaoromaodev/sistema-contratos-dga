import { getUsuarioAtual } from "@/lib/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlterarSenhaForm } from "./alterar-senha-form";

export default async function PerfilPage() {
  const usuario = await getUsuarioAtual();

  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Meu perfil</h1>
        <p className="text-sm text-muted-foreground">
          Dados da sua conta no sistema.
        </p>
      </div>

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Dados da conta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          <p>
            <span className="text-muted-foreground">Nome:</span> {usuario.nome}
          </p>
          <p>
            <span className="text-muted-foreground">E-mail:</span>{" "}
            {usuario.email}
          </p>
          <p>
            <span className="text-muted-foreground">Papel:</span>{" "}
            {usuario.papel.replace(/_/g, " ")}
          </p>
        </CardContent>
      </Card>

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Alterar senha</CardTitle>
          <CardDescription>
            Informe sua senha atual e a nova senha desejada.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlterarSenhaForm />
        </CardContent>
      </Card>
    </div>
  );
}
