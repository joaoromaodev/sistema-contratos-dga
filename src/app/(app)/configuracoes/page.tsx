import { redirect } from "next/navigation";

import { getUsuarioAtual, podeGerenciarSistema } from "@/lib/auth";
import { listarOpcoes } from "@/lib/opcoes";
import { CATEGORIA_OPCAO_LABEL } from "@/lib/constantes-contrato";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { OpcaoListaManager } from "./opcao-lista-manager";
import type { CategoriaOpcao } from "@/generated/prisma/enums";

const CATEGORIAS: CategoriaOpcao[] = [
  "TIPO_INSTRUMENTO",
  "INSTRUMENTO_JURIDICO",
  "CONTRAPARTE_TIPO",
  "MODALIDADE_LICITACAO",
];

export default async function ConfiguracoesPage() {
  const usuario = await getUsuarioAtual();
  if (!podeGerenciarSistema(usuario.papel)) {
    redirect("/");
  }

  const listas = await Promise.all(
    CATEGORIAS.map((categoria) => listarOpcoes(categoria, false))
  );

  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Configurações</h1>
        <p className="text-sm text-muted-foreground">
          Gerencie os valores disponíveis nas caixas de seleção do cadastro de
          contratos. Desativar uma opção não afeta contratos já cadastrados
          com ela, apenas a remove de novos cadastros.
        </p>
      </div>

      <Tabs defaultValue={CATEGORIAS[0]}>
        <TabsList>
          {CATEGORIAS.map((categoria) => (
            <TabsTrigger key={categoria} value={categoria}>
              {CATEGORIA_OPCAO_LABEL[categoria]}
            </TabsTrigger>
          ))}
        </TabsList>
        {CATEGORIAS.map((categoria, i) => (
          <TabsContent key={categoria} value={categoria}>
            <Card>
              <CardHeader>
                <CardTitle>{CATEGORIA_OPCAO_LABEL[categoria]}</CardTitle>
                <CardDescription>
                  {listas[i].length} opç{listas[i].length === 1 ? "ão" : "ões"} cadastrada
                  {listas[i].length === 1 ? "" : "s"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <OpcaoListaManager categoria={categoria} opcoes={listas[i]} />
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
