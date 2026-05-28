'use client'

export const dynamic = 'force-dynamic'

import { useMemo } from 'react'
import Link from 'next/link'
import dynamicImport from 'next/dynamic'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { StatCard } from '@/components/ui/StatCard'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { LineChartTanqe } from '@/components/charts/LineChartTanqe'
import { BarChartTanqe } from '@/components/charts/BarChartTanqe'
import {
  POSTOS,
  ANP_30D,
  RECEITA_12M_DIST,
  FUNIL_LEILOES_DIST,
  WINRATE_COMBUSTIVEL_DIST,
  DIST_LOGADA_ID,
  contratosByDist,
  pedidosByDist,
  leiloesAbertos,
  lancesByDist,
  getDist,
  getPosto,
  melhorLance,
} from '@/lib/mock-data'
import { formatBRL, formatLitros, formatPrecoLitro, formatCountdown, formatHora } from '@/lib/format'

const MapView = dynamicImport(() => import('@/components/map/MapView'), {
  ssr: false,
  loading: () => <div style={{ height: 320, background: 'var(--tanqe-stone)', borderRadius: 4 }} />,
})

export default function DistDashboardPage() {
  const dist = getDist(DIST_LOGADA_ID)!
  const contratos = useMemo(() => contratosByDist(DIST_LOGADA_ID), [])
  const pedidos = useMemo(() => pedidosByDist(DIST_LOGADA_ID), [])
  const oportunidades = useMemo(() => leiloesAbertos().slice(0, 4), [])
  const meusLances = useMemo(() => lancesByDist(DIST_LOGADA_ID), [])
  const vencedores = meusLances.filter((l) => l.status === 'vencedor').length
  const totalLances = meusLances.length
  const conversao = totalLances > 0 ? Math.round((vencedores / totalLances) * 100) : 0
  const receitaMes = RECEITA_12M_DIST[RECEITA_12M_DIST.length - 1].receita
  const receitaSpark = RECEITA_12M_DIST.slice(-7).map((m) => m.receita)

  return (
    <div style={{ display: 'grid', gap: 32 }}>
      <SectionHeader
        eyebrow={`DISTRIBUIDORA · BASE ${dist.cidade.toUpperCase()}/${dist.uf}`}
        title={`Bom dia, ${dist.nome}.`}
        subtitle={`Você tem ${oportunidades.length} oportunidades abertas e ${pedidos.filter((p) => p.status === 'em_transito').length} entregas em rota.`}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
        <StatCard label="Receita este mês" value={formatBRL(receitaMes, true)} delta="+9,2%" sublabel="vs. mês anterior" sparklineData={receitaSpark} />
        <StatCard label="Volume entregue" value={formatLitros(dist.volumeMensal)} delta="+14,5%" sublabel="vs. mês anterior" />
        <StatCard label="Oportunidades ativas" value={oportunidades.length} sublabel={`em ${new Set(oportunidades.map(o => o.regiao)).size} regiões`} />
        <StatCard label="Taxa de conversão" value={`${conversao}%`} sublabel={`${vencedores} vencidos / ${totalLances} lances`} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,2fr) minmax(0,1fr)', gap: 24 }} className="dash-row">
        <Card title="Receita 12 meses" eyebrow="Evolução do faturamento">
          <BarChartTanqe
            data={RECEITA_12M_DIST as unknown as Array<Record<string, unknown>>}
            xKey="mes"
            bars={[{ dataKey: 'receita', color: '#E8581A', name: 'Receita' }]}
            yFormatter={(v) => `R$ ${(v / 1_000_000).toFixed(1)}M`}
            height={240}
          />
        </Card>
        <Card title="Funil de leilões" eyebrow="Eficiência comercial">
          <BarChartTanqe
            data={FUNIL_LEILOES_DIST as unknown as Array<Record<string, unknown>>}
            xKey="etapa"
            bars={[{ dataKey: 'valor', color: '#E8581A', name: 'Leilões' }]}
            layout="vertical"
            height={240}
            yAxisWidth={110}
          />
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,2fr)', gap: 24 }} className="dash-row">
        <Card title="Preço ANP" eyebrow="Últimos 30 dias">
          <LineChartTanqe
            data={ANP_30D.filter((_, i) => i % 2 === 0) as unknown as Array<Record<string, unknown>>}
            xKey="dia"
            lines={[
              { dataKey: 'gasolinaComum', color: '#E8581A', name: 'Gasolina' },
              { dataKey: 'etanol', color: '#F9C9AE', name: 'Etanol' },
              { dataKey: 'dieselS10', color: '#0F0F0E', name: 'Diesel S10' },
            ]}
            yFormatter={(v) => `R$ ${v.toFixed(2)}`}
            height={260}
          />
        </Card>
        <Card title="Oportunidades em destaque" action={<Link href="/distribuidora/leiloes" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--tanqe-orange)', textDecoration: 'none' }}>Ver todas →</Link>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {oportunidades.map((l) => {
              const ml = melhorLance(l)
              const posto = getPosto(l.postoId)
              return (
                <div key={l.id} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 16, alignItems: 'center', padding: 16, border: '1px solid var(--tanqe-stone)', borderRadius: 4 }}>
                  <Badge variant="aberto">{l.combustivel}</Badge>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: 'var(--tanqe-black)' }}>{formatLitros(l.volume)} · {posto?.cidade}/{posto?.uf}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--tanqe-gray)' }}>
                      atual <span style={{ color: 'var(--tanqe-orange)', fontWeight: 600 }}>{formatPrecoLitro(ml?.precoLitro ?? l.precoAtual)}</span> · {l.lances.length} {l.lances.length === 1 ? 'lance' : 'lances'} · encerra {formatCountdown(l.endsAt)}
                    </div>
                  </div>
                  <Button href={`/distribuidora/leilao/${l.id}`} size="sm">Dar lance</Button>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.4fr) minmax(0,1fr)', gap: 24 }} className="dash-row">
        <Card title="Postos cadastrados" eyebrow={`${POSTOS.length} compradores ativos`}>
          <MapView
            center={[dist.lat, dist.lng]}
            zoom={9}
            height={320}
            markers={POSTOS.map((p) => ({ id: p.id, lat: p.lat, lng: p.lng, label: p.nome, subtitle: p.cidade, score: p.score }))}
          />
        </Card>
        <Card title="Entregas de hoje" action={<Link href="/distribuidora/pedidos" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--tanqe-orange)', textDecoration: 'none' }}>Ver todas →</Link>}>
          <div>
            {pedidos.slice(0, 4).map((p, i) => {
              const posto = getPosto(p.postoId)
              return (
                <div key={p.id} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 12, padding: '14px 0', borderBottom: i === pedidos.slice(0, 4).length - 1 ? 'none' : '1px solid var(--tanqe-stone)', alignItems: 'center' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.status === 'em_transito' ? 'var(--tanqe-orange)' : p.status === 'entregue' ? 'var(--tanqe-success)' : 'var(--tanqe-gray)' }} />
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, margin: 0 }}>{p.combustivel} · {formatLitros(p.volume)}</p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--tanqe-gray)', margin: 0 }}>{posto?.nome} · ETA {formatHora(p.previsaoEntrega)}</p>
                  </div>
                  <Button variant="ghost" size="sm">Atualizar</Button>
                </div>
              )
            })}
            {pedidos.length === 0 && <p style={{ color: 'var(--tanqe-gray)', textAlign: 'center', padding: 24 }}>Nenhuma entrega hoje.</p>}
          </div>
        </Card>
      </div>

      <style>{`@media (max-width: 1023px) { .dash-row { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  )
}
