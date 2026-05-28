'use client'

export const dynamic = 'force-dynamic'

import { useMemo } from 'react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card } from '@/components/ui/Card'
import { StatCard } from '@/components/ui/StatCard'
import { BarChartTanqe } from '@/components/charts/BarChartTanqe'
import { AreaChartTanqe } from '@/components/charts/AreaChartTanqe'
import { PieChartTanqe } from '@/components/charts/PieChartTanqe'
import {
  RECEITA_12M_DIST,
  TICKET_MEDIO_12M_DIST,
  WINRATE_COMBUSTIVEL_DIST,
  PARTICIPACAO_REGIAO_DIST,
  FUNIL_LEILOES_DIST,
  contratosByDist,
  lancesByDist,
  DIST_LOGADA_ID,
} from '@/lib/mock-data'
import { formatBRL, formatPctRaw } from '@/lib/format'

export default function AnalyticsDistPage() {
  const contratos = useMemo(() => contratosByDist(DIST_LOGADA_ID), [])
  const lances = useMemo(() => lancesByDist(DIST_LOGADA_ID), [])
  const totalReceita = contratos.reduce((s, c) => s + c.valor, 0)
  const ticketMedio = contratos.length > 0 ? totalReceita / contratos.length : 0
  const lancesVencedores = lances.filter((l) => l.status === 'vencedor').length
  const winRate = lances.length > 0 ? (lancesVencedores / lances.length) * 100 : 0

  return (
    <div style={{ display: 'grid', gap: 32 }}>
      <SectionHeader
        eyebrow="Analytics · BI comercial"
        title="Performance da distribuidora"
        subtitle="Funil de leilões, receita, win rate e cobertura regional. Use pra calibrar estratégia de pricing."
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
        <StatCard label="Receita 12m" value={formatBRL(RECEITA_12M_DIST.reduce((s, m) => s + m.receita, 0), true)} delta="+9,2%" sublabel="vs. ano anterior" sparklineData={RECEITA_12M_DIST.map((m) => m.receita)} />
        <StatCard label="Win rate global" value={formatPctRaw(winRate)} delta="+4,8 p.p." sublabel="leilões vencidos / participados" />
        <StatCard label="Ticket médio" value={formatBRL(ticketMedio, true)} delta="+6,1%" sublabel="por contrato" sparklineData={TICKET_MEDIO_12M_DIST.map((m) => m.ticket)} />
        <StatCard label="Total de operações" value={contratos.length} sublabel="contratos fechados" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 24 }} className="dash-row">
        <Card title="Receita ao longo do tempo" eyebrow="12 meses">
          <AreaChartTanqe
            data={RECEITA_12M_DIST as unknown as Array<Record<string, unknown>>}
            xKey="mes"
            areas={[{ dataKey: 'receita', color: '#E8581A', name: 'Receita' }]}
            yFormatter={(v) => `R$ ${(v / 1_000_000).toFixed(1)}M`}
            height={260}
          />
        </Card>
        <Card title="Ticket médio" eyebrow="Por contrato, 12 meses">
          <AreaChartTanqe
            data={TICKET_MEDIO_12M_DIST as unknown as Array<Record<string, unknown>>}
            xKey="mes"
            areas={[{ dataKey: 'ticket', color: '#F4874A', name: 'Ticket' }]}
            yFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`}
            height={260}
          />
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 24 }} className="dash-row">
        <Card title="Win rate por combustível" eyebrow="% de vitórias entre lances dados">
          <BarChartTanqe
            data={WINRATE_COMBUSTIVEL_DIST as unknown as Array<Record<string, unknown>>}
            xKey="combustivel"
            bars={[{ dataKey: 'winRate', color: '#E8581A', name: 'Win rate' }]}
            layout="vertical"
            yFormatter={(v) => `${v}%`}
            yAxisWidth={140}
            height={260}
          />
        </Card>
        <Card title="Participação por região" eyebrow="Operações fechadas">
          <PieChartTanqe
            data={PARTICIPACAO_REGIAO_DIST as unknown as Array<Record<string, unknown>>}
            nameKey="regiao"
            valueKey="valor"
            valueFormatter={(v) => `${v}%`}
            height={260}
          />
        </Card>
      </div>

      <Card title="Funil de leilões" eyebrow="Eficiência comercial (12 meses)">
        <BarChartTanqe
          data={FUNIL_LEILOES_DIST as unknown as Array<Record<string, unknown>>}
          xKey="etapa"
          bars={[{ dataKey: 'valor', color: '#E8581A', name: 'Volume' }]}
          layout="vertical"
          yAxisWidth={110}
          height={260}
        />
      </Card>

      <style>{`@media (max-width: 1023px) { .dash-row { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  )
}
