'use client'

export const dynamic = 'force-dynamic'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { TrendingDown } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card } from '@/components/ui/Card'
import { Badge, type BadgeVariant } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { DataTable, type DataTableColumn } from '@/components/ui/DataTable'
import {
  lancesByDist,
  getPosto,
  DIST_LOGADA_ID,
  type Lance,
  type Leilao,
  type LanceStatus,
} from '@/lib/mock-data'
import { formatLitros, formatPrecoLitro, timeAgo, formatCountdown } from '@/lib/format'

interface Row { lance: Lance; leilao: Leilao; status: LanceStatus }

const STATUS_VARIANT: Record<LanceStatus, BadgeVariant> = {
  ganhando: 'ativo',
  vencedor: 'concluido',
  perdido: 'atrasado',
  recusado: 'cancelado',
}
const STATUS_LABEL: Record<LanceStatus, string> = {
  ganhando: 'Ganhando',
  vencedor: 'Venceu',
  perdido: 'Perdendo',
  recusado: 'Recusado',
}

type Tab = 'todos' | LanceStatus

export default function MeusLancesPage() {
  const router = useRouter()
  const meus = useMemo(() => lancesByDist(DIST_LOGADA_ID), [])
  const [tab, setTab] = useState<Tab>('todos')
  const filtered = useMemo(() => (tab === 'todos' ? meus : meus.filter((r) => r.status === tab)), [meus, tab])
  const counts: Record<Tab, number> = {
    todos: meus.length,
    ganhando: meus.filter((r) => r.status === 'ganhando').length,
    vencedor: meus.filter((r) => r.status === 'vencedor').length,
    perdido: meus.filter((r) => r.status === 'perdido').length,
    recusado: meus.filter((r) => r.status === 'recusado').length,
  }
  const winRate = meus.length > 0 ? Math.round((counts.vencedor / meus.length) * 100) : 0

  const cols: DataTableColumn<Row>[] = [
    { key: 'codigo', label: 'Leilão', render: (r) => <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>{r.leilao.codigo}</span> },
    { key: 'combustivel', label: 'Combustível', render: (r) => r.leilao.combustivel },
    { key: 'volume', label: 'Volume', align: 'right', render: (r) => formatLitros(r.leilao.volume) },
    { key: 'posto', label: 'Posto', render: (r) => getPosto(r.leilao.postoId)?.nome ?? '—' },
    { key: 'preco', label: 'Seu lance', align: 'right', render: (r) => <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{formatPrecoLitro(r.lance.precoLitro)}</span> },
    { key: 'status', label: 'Status', render: (r) => <Badge variant={STATUS_VARIANT[r.status]}>{STATUS_LABEL[r.status]}</Badge> },
    { key: 'quando', label: 'Quando', render: (r) => <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--tanqe-gray)' }}>{timeAgo(r.lance.timestamp)}</span> },
    {
      key: 'acao',
      label: '',
      align: 'right',
      render: (r) => {
        if (r.status === 'perdido' && r.leilao.status === 'aberto') {
          return (
            <Button
              variant="secondary"
              size="sm"
              icon={TrendingDown}
              onClick={(e) => {
                e.stopPropagation()
                router.push(`/distribuidora/leilao/${r.leilao.id}`)
              }}
            >
              Cobrir
            </Button>
          )
        }
        if (r.leilao.status === 'aberto') {
          return <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--tanqe-gray)' }}>encerra {formatCountdown(r.leilao.endsAt)}</span>
        }
        return null
      },
    },
  ]

  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <SectionHeader
        eyebrow={`${meus.length} lances · win rate ${winRate}%`}
        title="Meus lances"
        subtitle="Acompanhe cada oferta enviada e cubra rivais antes do leilão encerrar."
      />

      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--tanqe-stone)', overflowX: 'auto' }}>
        {(['todos', 'ganhando', 'vencedor', 'perdido'] as Tab[]).map((t) => {
          const active = t === tab
          const labels: Record<Tab, string> = { todos: 'Todos', ganhando: 'Ganhando', vencedor: 'Vencidos', perdido: 'Perdendo', recusado: 'Recusados' }
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                background: 'transparent', border: 'none', padding: '12px 18px', cursor: 'pointer',
                fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em',
                color: active ? 'var(--tanqe-orange)' : 'var(--tanqe-gray)',
                borderBottom: active ? '2px solid var(--tanqe-orange)' : '2px solid transparent', marginBottom: -1, whiteSpace: 'nowrap',
              }}
            >
              {labels[t]} ({counts[t]})
            </button>
          )
        })}
      </div>

      <Card padding={0}>
        <DataTable
          columns={cols}
          rows={filtered}
          rowKey={(r) => r.lance.id}
          onRowClick={(r) => router.push(`/distribuidora/leilao/${r.leilao.id}`)}
          emptyMessage="Nenhum lance neste filtro."
        />
      </Card>
    </div>
  )
}
