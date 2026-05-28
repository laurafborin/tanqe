'use client'

export const dynamic = 'force-dynamic'

import { useMemo } from 'react'
import Link from 'next/link'
import dynamicImport from 'next/dynamic'
import { ChevronRight } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { StatCard } from '@/components/ui/StatCard'
import { Card } from '@/components/ui/Card'
import { Badge, type BadgeVariant } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { LineChartTanqe } from '@/components/charts/LineChartTanqe'
import { BarChartTanqe } from '@/components/charts/BarChartTanqe'
import { PieChartTanqe } from '@/components/charts/PieChartTanqe'
import {
  LEILOES,
  POSTOS,
  DISTRIBUIDORAS,
  POSTO_LOGADO_ID,
  ANP_30D,
  ECONOMIA_12M,
  SPLIT_COMBUSTIVEL_POSTO,
  pedidosByPosto,
  getDist,
  getPosto,
  melhorLance,
  type PedidoStatus,
} from '@/lib/mock-data'
import { formatBRL, formatLitros, formatPrecoLitro, formatCountdown, timeAgo } from '@/lib/format'

const MapView = dynamicImport(() => import('@/components/map/MapView'), {
  ssr: false,
  loading: () => (
    <div style={{ height: 320, background: 'var(--tanqe-stone)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--tanqe-gray)' }}>
      Carregando mapa…
    </div>
  ),
})

const STATUS_COLOR: Record<PedidoStatus, string> = {
  em_transito: 'var(--tanqe-orange)',
  entregue: 'var(--tanqe-success)',
  atrasado: 'var(--tanqe-danger)',
  aguardando_coleta: 'var(--tanqe-gray)',
}

const STATUS_LABEL: Record<PedidoStatus, string> = {
  em_transito: 'Em trânsito',
  entregue: 'Entregue',
  atrasado: 'Atrasado',
  aguardando_coleta: 'Aguardando',
}

export default function PostoDashboard() {
  const posto = getPosto(POSTO_LOGADO_ID)!
  const meusLeiloes = useMemo(() => LEILOES.filter((l) => l.postoId === POSTO_LOGADO_ID), [])
  const ativos = meusLeiloes.filter((l) => l.status === 'aberto')
  const emEntrega = meusLeiloes.filter((l) => l.status === 'em_entrega')
  const pedidos = useMemo(() => pedidosByPosto(POSTO_LOGADO_ID), [])
  const ultimasEntregas = pedidos.slice(0, 4)
  const economiaMes = ECONOMIA_12M[ECONOMIA_12M.length - 1].economia
  const economiaSparkline = ECONOMIA_12M.slice(-7).map((m) => m.economia)
  const volumeSparkline = [78000, 80500, 82000, 81500, 83000, 84500]
  const anpSparkline = ANP_30D.slice(-7).map((d) => d.gasolinaComum)

  return (
    <div style={{ display: 'grid', gap: 32 }}>
      <SectionHeader
        eyebrow={`${posto.bandeira.toUpperCase()} · ${posto.cidade.toUpperCase()}/${posto.uf}`}
        title={`Bom dia, ${posto.nome.replace(/^Auto /, '')}.`}
        subtitle={`Você tem ${ativos.length} ${ativos.length === 1 ? 'leilão aberto' : 'leilões abertos'} e ${emEntrega.length} ${emEntrega.length === 1 ? 'entrega a caminho' : 'entregas a caminho'}.`}
      />

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
        <StatCard label="Economia este mês" value={formatBRL(economiaMes)} delta="+18,3%" sublabel="vs. preço médio ANP" sparklineData={economiaSparkline} />
        <StatCard label="Volume negociado" value={formatLitros(posto.volumeMensal)} delta="+12,0%" sublabel="vs. mês anterior" sparklineData={volumeSparkline} />
        <StatCard label="Leilões ativos" value={ativos.length} sublabel="Encerram em até 24h" sparklineData={anpSparkline} />
        <StatCard label="Score do posto" value={posto.score.toFixed(1)} star sublabel={`${posto.totalOperacoes} operações`} />
      </div>

      {/* Economia 12m + Split combustível */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,2fr) minmax(0,1fr)', gap: 24 }} className="dash-row">
        <Card title="Economia acumulada (12 meses)" eyebrow="Comparado à meta interna">
          <BarChartTanqe
            data={ECONOMIA_12M as unknown as Array<Record<string, unknown>>}
            xKey="mes"
            bars={[{ dataKey: 'economia', color: '#E8581A', name: 'Economia' }]}
            yFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`}
            height={240}
          />
        </Card>
        <Card title="Distribuição por combustível" eyebrow="Mix do volume (12m)">
          <PieChartTanqe
            data={SPLIT_COMBUSTIVEL_POSTO as unknown as Array<Record<string, unknown>>}
            nameKey="nome"
            valueKey="valor"
            valueFormatter={(v) => `${v}%`}
            height={240}
          />
        </Card>
      </div>

      {/* Preço ANP + Leilões em andamento */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,2fr)', gap: 24 }} className="dash-row">
        <Card title="Preço médio ANP" eyebrow="Últimos 30 dias">
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
        <Card title="Leilões em andamento" action={<Link href="/posto/leiloes" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--tanqe-orange)', textDecoration: 'none' }}>Ver todos →</Link>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {ativos.slice(0, 3).map((l) => {
              const ml = melhorLance(l)
              return (
                <Link
                  key={l.id}
                  href={`/posto/leilao/${l.id}`}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr auto',
                    gap: 20,
                    alignItems: 'center',
                    padding: 16,
                    border: '1px solid var(--tanqe-stone)',
                    borderRadius: 4,
                    textDecoration: 'none',
                    transition: 'border-color var(--dur-fast) var(--ease-out)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--tanqe-orange)')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--tanqe-stone)')}
                >
                  <Badge variant="aberto">{l.combustivel}</Badge>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--tanqe-black)' }}>
                      {formatLitros(l.volume)} · {l.regiao}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--tanqe-gray)', textDecoration: 'line-through' }}>{formatPrecoLitro(l.precoTeto)}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--tanqe-orange)', fontWeight: 600 }}>→ {formatPrecoLitro(ml?.precoLitro ?? l.precoAtual)}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--tanqe-black)' }}>{formatCountdown(l.endsAt)}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--tanqe-gray)', marginTop: 4 }}>{l.lances.length} lances</div>
                  </div>
                </Link>
              )
            })}
            {ativos.length === 0 && (
              <p style={{ color: 'var(--tanqe-gray)', textAlign: 'center', padding: 24 }}>Nenhum leilão aberto.</p>
            )}
          </div>
        </Card>
      </div>

      {/* Mapa + Entregas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.4fr) minmax(0,1fr)', gap: 24 }} className="dash-row">
        <Card title="Distribuidoras próximas" eyebrow={`${DISTRIBUIDORAS.length} parceiras`}>
          <MapView
            center={[posto.lat, posto.lng]}
            zoom={9}
            height={320}
            markers={DISTRIBUIDORAS.map((d) => ({ id: d.id, lat: d.lat, lng: d.lng, label: d.nome, subtitle: d.cidade, score: d.score }))}
          />
        </Card>
        <Card title="Últimas entregas" action={<Link href="/posto/pedidos" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--tanqe-orange)', textDecoration: 'none' }}>Ver todas →</Link>}>
          <div>
            {ultimasEntregas.map((p, i) => {
              const d = getDist(p.distId)
              return (
                <Link
                  key={p.id}
                  href="/posto/pedidos"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '14px 0',
                    borderBottom: i === ultimasEntregas.length - 1 ? 'none' : '1px solid var(--tanqe-stone)',
                    textDecoration: 'none',
                    color: 'inherit',
                  }}
                >
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: STATUS_COLOR[p.status], flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14 }}>{p.combustivel} · {formatLitros(p.volume)}</div>
                    <div style={{ fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: 12, color: 'var(--tanqe-gray)', marginTop: 2 }}>
                      {d?.nome} · {p.status === 'entregue' ? `entregue ${timeAgo(p.entregueEm || '')}` : STATUS_LABEL[p.status]}
                    </div>
                  </div>
                  <ChevronRight size={14} color="var(--tanqe-gray)" />
                </Link>
              )
            })}
            {ultimasEntregas.length === 0 && <p style={{ color: 'var(--tanqe-gray)', textAlign: 'center', padding: 24 }}>Nenhuma entrega recente.</p>}
          </div>
        </Card>
      </div>

      <style>{`@media (max-width: 1023px) { .dash-row { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  )
}
