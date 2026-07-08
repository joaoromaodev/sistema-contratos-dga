import Link from "next/link";
import {
  FileCheck2,
  Clock,
  AlertTriangle,
  Archive,
  Wallet,
  HandCoins,
} from "lucide-react";

import { getUsuarioAtual } from "@/lib/auth";
import { getDashboardData } from "@/lib/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatTile } from "@/components/dashboard/stat-tile";
import { TipoBreakdown } from "@/components/dashboard/tipo-breakdown";
import { StatusBadge } from "@/components/contratos/status-badge";
import { formatarMoeda } from "@/lib/formatters";

export default async function Home() {
  const [usuario, dados] = await Promise.all([
    getUsuarioAtual(),
    getDashboardData(),
  ]);

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Olá, {usuario.nome.split(" ")[0]}
        </h1>
        <p className="text-sm text-muted-foreground">
          Panorama dos contratos e convênios ativos no CCON.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          label="Contratos e convênios ativos"
          value={dados.totalAtivos}
          icon={FileCheck2}
          variant="vigente"
        />
        <StatTile
          label="Próximos a vencer"
          value={dados.contadores.PROXIMO_A_VENCER}
          icon={Clock}
          variant="atencao"
        />
        <StatTile
          label="Vencidos"
          value={dados.contadores.VENCIDO}
          icon={AlertTriangle}
          variant="critico"
        />
        <StatTile
          label="Encerrados"
          value={dados.contadores.ENCERRADO}
          icon={Archive}
          variant="encerrado"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatTile
          label="Valor vigente - Contratos administrativos"
          value={formatarMoeda(dados.valorTotalContratos)}
          icon={Wallet}
          variant="neutral"
        />
        <StatTile
          label="Valor vigente - Convênios e parcerias"
          value={formatarMoeda(dados.valorTotalConvenios)}
          icon={HandCoins}
          variant="neutral"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por tipo</CardTitle>
          </CardHeader>
          <CardContent>
            <TipoBreakdown itens={dados.porTipo} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Atenção — vencendo em breve ou vencidos</CardTitle>
          </CardHeader>
          <CardContent>
            {dados.atencao.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhum contrato precisa de atenção no momento.
              </p>
            ) : (
              <ul className="flex flex-col gap-3">
                {dados.atencao.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/contratos/${item.id}`}
                      className="flex items-center justify-between gap-3 hover:underline"
                    >
                      <span className="truncate text-sm">{item.titulo}</span>
                      <StatusBadge
                        status={item.status}
                        diasParaVencer={item.diasParaVencer}
                        dataFimVigenciaAtual={item.dataFimVigenciaAtual}
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
