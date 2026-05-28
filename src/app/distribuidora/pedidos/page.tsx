'use client'

export const dynamic = 'force-dynamic'

import { useMemo, useState } from 'react'
import dynamicImport from 'next/dynamic'
import { ChevronDown, Truck } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card } from '@/components/ui/Card'
import { Badge, type BadgeVariant } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import {
  pedidosByDist,
  DIST_LOGADA_ID,
  getPosto,
  type Pedido,
  type PedidoStatus,
} from '@/lib/mock-data'
import { formatLitros, formatDataHora, formatHora, timeAgo } from '@/lib/format'

const MapView = dynamicImport(() => import('@/components/map/MapView'), { ssr: false })

const STATUS_VARIANT: Record<PedidoStatus, BadgeVariant> = {
  aguardando_coleta: 'pendente',
  em_transito: 'destaque',
  entregue: 'concluido',
  atrasado: 'atrasado',
}
const STATUS_LABEL: Record<PedidoStatus, string> = {
  aguardando_coleta: 'Aguardando coleta',
  em_transito: 'Em trânsito',
  entregue: 'Entregue',
  atrasado: 'Atrasado',
}

const NEXT_STATUS: Record<PedidoStatus, PedidoStatus | null> = {
  aguardando_coleta: 'em_transito',
  em_transito: 'entregue',
  entregue: null,
  atrasado: 'em_transito',
}

type Tab = 'hoje' | 'em_andamento' | 'concluidos'

export default function PedidosDistPage() {
  const pedidosInit = useMemo(() => pedidosByDist(DIST_LOGADA_ID), [])
  const [pedidos, setPedidos] = useState(pedidosInit)
  const [tab, setTab] = useState<Tab>('em_andamento')

  function avancarStatus(id: string) {
    setPedidos((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p
        const next = NEXT_STATUS[p.status]
        if (!next) return p
        return { ...p, status: next, entregueEm: next === 'entregue' ? new Date().toISOString() : p.entregueEm }
      }),
    )
  }

  const filtered = useMemo(() => {
    if (tab === 'hoje') {
      const today = new Date().toDateString()
      return pedidos.filter((p) => new Date(p.previsaoEntrega).toDateString() === today)
    }
    if (tab === 'em_andamento') return pedidos.filter((p) => p.status === 'em_transito' || p.status === 'aguardando_coleta')
    return pedidos.filter((p) => p.status === 'entregue')
  }, [pedidos, tab])

  const counts = {
    hoje: pedidos.filter((p) => new Date(p.previsaoEntrega).toDateString() === new Date().toDateString()).length,
    em_andamento: pedidos.filter((p) => p.status === 'em_transito' || p.status === 'aguardando_coleta').length,
    concluidos: pedidos.filter((p) => p.status === 'entregue').length,
  }

  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <SectionHeader
        eyebrow={`${pedidos.length} entregas em rastreamento`}
        title="Entregas"
        subtitle="Acompanhe o status de cada caminhão e atualize quando coletar e quando entregar."
      />

      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--tanqe-stone)' }}>
        {(['hoje', 'em_andamento', 'concluidos'] as Tab[]).map((t) => {
          const active = t === tab
          const labels = { hoje: `Hoje (${counts.hoje})`, em_andamento: `Em andamento (${counts.em_andamento})`, concluidos: `Concluídas (${counts.concluidos})` }
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                background: 'transparent', border: 'none', padding: '12px 18px', cursor: 'pointer',
                fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em',
                color: active ? 'var(--tanqe-orange)' : 'var(--tanqe-gray)',
                borderBottom: active ? '2px solid var(--tanqe-orange)' : '2px solid transparent', marginBottom: -1,
              }}
            >
              {labels[t]}
            </button>
          )
        })}
      </div>

      <div style={{ display: 'grid', gap: 12 }}>
        {filtered.map((p) => <EntregaCard key={p.id} pedido={p} onAdvance={() => avancarStatus(p.id)} />)}
        {filtered.length === 0 && (
          <Card>
            <p style={{ textAlign: 'center', color: 'var(--tanqe-gray)', padding: 32 }}>Nenhuma entrega neste filtro.</p>
          </Card>
        )}
      </div>
    </div>
  )
}

function EntregaCard({ pedido, onAdvance }: { pedido: Pedido; onAdvance: () => void }) {
  const [open, setOpen] = useState(false)
  const posto = getPosto(pedido.postoId)
  const next = NEXT_STATUS[pedido.status]
  const nextLabel = next === 'em_transito' ? 'Confirmar coleta' : next === 'entregue' ? 'Confirmar entrega' : null

  return (
    <div style={{ background: 'var(--tanqe-white)', border: '1px solid var(--tanqe-stone)', borderRadius: 4, overflow: 'hidden' }}>
      <div
        style={{
          padding: '16px 24px',
          display: 'grid',
          gridTemplateColumns: 'auto 1fr auto auto auto auto',
          gap: 16,
          alignItems: 'center',
        }}
      >
        <Truck size={20} color="var(--tanqe-orange)" strokeWidth={1.75} />
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14 }}>{pedido.combustivel} · {formatLitros(pedido.volume)}</div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--tanqe-gray)', marginTop: 2 }}>
            {posto?.nome} · {posto?.cidade}/{posto?.uf}
          </div>
        </div>
        <Badge variant={STATUS_VARIANT[pedido.status]}>{STATUS_LABEL[pedido.status]}</Badge>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--tanqe-gray)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          {pedido.status === 'entregue' ? `Entregue ${timeAgo(pedido.entregueEm || '')}` : `ETA ${formatHora(pedido.previsaoEntrega)}`}
        </span>
        {nextLabel && <Button size="sm" variant="secondary" onClick={onAdvance}>{nextLabel}</Button>}
        <button onClick={() => setOpen((v) => !v)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4 }}>
          <ChevronDown size={16} color="var(--tanqe-gray)" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
        </button>
      </div>

      {open && (
        <div style={{ borderTop: '1px solid var(--tanqe-stone)', padding: '20px 24px', display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 24 }} className="dash-row">
          <div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--tanqe-gray)', margin: 0, marginBottom: 8 }}>Logística</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', rowGap: 8, columnGap: 14, fontFamily: 'var(--font-body)', fontSize: 13 }}>
              <span style={{ color: 'var(--tanqe-gray)' }}>Placa</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>{pedido.caminhaoPlaca}</span>
              <span style={{ color: 'var(--tanqe-gray)' }}>Motorista</span>
              <span>{pedido.motorista}</span>
              <span style={{ color: 'var(--tanqe-gray)' }}>Telefone</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>{pedido.motoristaTelefone}</span>
              <span style={{ color: 'var(--tanqe-gray)' }}>Saída</span>
              <span>{pedido.saidaEm ? formatDataHora(pedido.saidaEm) : '—'}</span>
              <span style={{ color: 'var(--tanqe-gray)' }}>Previsão entrega</span>
              <span>{formatDataHora(pedido.previsaoEntrega)}</span>
            </div>
          </div>
          <MapView
            center={[pedido.ultimaLocalizacao.lat, pedido.ultimaLocalizacao.lng]}
            zoom={9}
            height={220}
            markers={[
              { id: 'truck', lat: pedido.ultimaLocalizacao.lat, lng: pedido.ultimaLocalizacao.lng, label: 'Caminhão', subtitle: pedido.caminhaoPlaca },
              { id: 'dest', lat: pedido.destinoLat, lng: pedido.destinoLng, label: posto?.nome || 'Destino', subtitle: posto?.cidade },
            ]}
          />
        </div>
      )}
      <style>{`@media (max-width: 900px) { .dash-row { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  )
}
