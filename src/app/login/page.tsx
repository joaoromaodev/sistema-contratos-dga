import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-1 text-center">
          <p className="text-sm font-medium text-muted-foreground">
            DGA · Diretoria de Gestão Administrativa
          </p>
          <h1 className="text-xl font-semibold">
            CCON - Sistema de Contratos e Convênios
          </h1>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
