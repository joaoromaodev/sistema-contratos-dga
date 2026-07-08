import { ContratoForm } from "../contrato-form";
import { formOpcoes } from "@/lib/opcoes";

export default async function NovoContratoPage() {
  const opcoes = await formOpcoes();

  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Novo Contrato</h1>
        <p className="text-sm text-muted-foreground">
          Cadastre um novo contrato, convênio, acordo ou termo de parceria.
        </p>
      </div>
      <div className="max-w-3xl">
        <ContratoForm opcoes={opcoes} />
      </div>
    </div>
  );
}
