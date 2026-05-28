'use client'

export const dynamic = 'force-dynamic'

import { useMemo, useState } from 'react'
import dynamicImport from 'next/dynamic'
import { ChevronDown, Truck, Check } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card } from '@/components/ui/Card'
import { Badge, type BadgeVariant } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import {
  pedidosByPosto,
  POSTO_LOGADO_ID,
  getDist,
  type Pedido,
  type PedidoStatus,
} from '@/lib/mock-data'
import { formatLitros, formatDataHora, timeAgo } from '@/lib/format'

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

type Tab = 'em_andamento' | 'concluidos' | 'atrasados'

export default function PedidosPostoPage() {
  const pedidos = useMemo(() => pedidosByPosto(POSTO_LOGADO_ID), [])
  const [tab, setTab] = useState<Tab>('em_andamento')
  const filtered = useMemo(() => {
    if (tab === 'em_andamento') return pedidos.filter((p) => p.status === 'em_transito' || p.status === 'aguardando_coleta')
    if (tab === 'concluidos') return pedidos.filter((p) => p.status === 'entregue')
    return pedidos.filter((p) => p.status === 'atrasado')
  }, [pedidos, tab])

  const counts = {
    em_andamento: pedidos.filter((p) => p.status === 'em_transito' || p.status === 'aguardando_coleta').length,
    concluidos: pedidos.filter((p) => p.status === 'entregue').length,
    atrasados: pedidos.filter((p) => p.status === 'atrasado').length,
  }

  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <SectionHeader
        eyebrow={`${pedidos.length} pedidos rastreados`}
        title="Rastreamento de entregas"
        subtitle="Acompanhe cada caminhão do lance aceito ao tanque, em tempo real."
      />

      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--tanqe-stone)' }}>
        {(['em_andamento', 'concluidos', 'atrasados'] as Tab[]).map((t) => {
          const active = t === tab
          const labels = { em_andamento: `Em andamento (${counts.em_andamento})`, concluidos: `Concluídos (${counts.concluidos})`, atrasados: `Atrasados (${counts.atrasados})` }
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                background: 'transparent',
                border: 'none',
                padding: '12px 18px',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: active ? 'var(--tanqe-orange)' : 'var(--tanqe-gray)',
                borderBottom: active ? '2px solid var(--tanqe-orange)' : '2px solid transparent',
                marginBottom: -1,
              }}
            >
              {labels[t]}
            </button>
          )
        })}
      </div>

      <div style={{ display: 'grid', gap: 12 }}>
        {filtered.map((p) => <PedidoCard key={p.id} pedido={p} />)}
        {filtered.length === 0 && (
          <Card>
            <p style={{ textAlign: 'center', color: 'var(--tanqe-gray)', padding: 32 }}>
              Nenhum pedido neste status.
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}

function PedidoCard({ pedido }: { pedido: Pedido }) {
  const [open, setOpen] = useState(false)
  const dist = getDist(pedido.distId)
  return (
    <div style={{ background: 'var(--tanqe-white)', border: '1px solid var(--tanqe-stone)', borderRadius: 4, overflow: 'hidden' }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: '100%',
          background: 'transparent',
          border: 'none',
          padding: '18px 24px',
          display: 'grid',
          gridTemplateColumns: 'auto 1fr auto auto auto',
          gap: 20,
          alignItems: 'center',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <Truck size={20} color="var(--tanqe-orange)" strokeWidth={1.75} />
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--tanqe-black)' }}>
            {pedido.combustivel} · {formatLitros(pedido.volume)}
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--tanqe-gray)', marginTop: 2 }}>
            {dist?.nome} · placa {pedido.caminhaoPlaca}
          </div>
        </div>
        <Badge variant={STATUS_VARIANT[pedido.status]}>{STATUS_LABEL[pedido.status]}</Badge>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--tanqe-gray)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          {pedido.status === 'entregue' ? `Entregue ${timeAgo(pedido.entregueEm || '')}` : `ETA ${formatDataHora(pedido.previsaoEntrega)}`}
        </span>
        <ChevronDown size={16} color="var(--tanqe-gray)" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
      </button>

      {open && (
        <div style={{ borderTop: '1px solid var(--tanqe-stone)', padding: '20px 24px', display: 'grid', gap: 20 }}>
          {/* Timeline */}
          <div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--tanqe-gray)', margin: 0, marginBottom: 16 }}>
              Etapas da entrega
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, position: 'relative' }}>
              {pedido.etapas.map((e, i) => {
                const isCurrent = !e.concluida && pedido.etapas.slice(0, i).every((x) => x.concluida)
                return (
                  <div key={e.nome} style={{ position: 'relative', textAlign: 'center' }}>
                    {i > 0 && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 11,
                          right: '50%',
                          width: '100%',
                          height: 2,
                          background: e.concluida ? 'var(--tanqe-success)' : 'var(--tanqe-stone)',
                        }}
                      />
                    )}
                    <div
                      style={{
                        position: 'relative',
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        margin: '0 auto',
                        background: e.concluida ? 'var(--tanqe-success)' : isCurrent ? 'var(--tanqe-orange)' : 'var(--tanqe-stone)',
                        color: 'var(--tanqe-white)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        animation: isCurrent ? 'tanqe-pulse 1.4s ease-in-out infinite' : undefined,
                      }}
                    >
                      {e.concluida && <Check size={12} strokeWidth={3} />}
                    </div>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500, marginTop: 8, color: e.concluida || isCurrent ? 'var(--tanqe-black)' : 'var(--tanqe-gray)' }}>
                      {e.nome}
                    </p>
                    {e.quandoIso && (
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--tanqe-gray)', margin: 0 }}>{timeAgo(e.quandoIso)}</p>
                    )}
                  </div>
                )
              })}
              <style>{`@keyframes tanqe-pulse { 0%,100%{box-shadow: 0 0 0 0 rgba(232,88,26,0.5)} 70%{box-shadow: 0 0 0 10px rgba(232,88,26,0)} }`}</style>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 24 }}>
            {/* Caminhão + motorista */}
            <Card>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--tanqe-gray)', margin: 0, marginBottom: 12 }}>
                Logística
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '8px 16px', fontFamily: 'var(--font-body)', fontSize: 14 }}>
                <span style={{ color: 'var(--tanqe-gray)' }}>Placa</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>{pedido.caminhaoPlaca}</span>
                <span style={{ color: 'var(--tanqe-gray)' }}>Motorista</span>
                <span style={{ fontWeight: 500 }}>{pedido.motorista}</span>
                <span style={{ color: 'var(--tanqe-gray)' }}>Telefone</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>{pedido.motoristaTelefone}</span>
                <span style={{ color: 'var(--tanqe-gray)' }}>Última posição</span>
                <span>{pedido.ultimaLocalizacao.cidade}</span>
              </div>
              {pedido.status === 'entregue' && (
                <div style={{ marginTop: 16 }}>
                  <Button variant="secondary" size="sm">Baixar comprovante</Button>
                </div>
              )}
            </Card>

            {/* Mapa */}
            <Card padding={0}>
              <MapView
                center={[pedido.ultimaLocalizacao.lat, pedido.ultimaLocalizacao.lng]}
                zoom={9}
                height={220}
                markers={[
                  { id: 'truck', lat: pedido.ultimaLocalizacao.lat, lng: pedido.ultimaLocalizacao.lng, label: 'Caminhão', subtitle: pedido.caminhaoPlaca },
                  { id: 'dest', lat: pedido.destinoLat, lng: pedido.destinoLng, label: 'Destino', subtitle: 'Seu posto' },
                ]}
              />
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
