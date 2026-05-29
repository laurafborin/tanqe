'use client'

export const dynamic = 'force-dynamic'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card } from '@/components/ui/Card'
import { Badge, type BadgeVariant } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { DataTable, type DataTableColumn } from '@/components/ui/DataTable'
import {
  LEILOES,
  POSTO_LOGADO_ID,
  modalidadeBadge,
  type Leilao,
  type LeilaoStatus,
  melhorLance,
} from '@/lib/mock-data'
import { formatLitros, formatPrecoLitro, formatCountdown, formatData } from '@/lib/format'

type Tab = 'todos' | LeilaoStatus

const TAB_LABELS: Record<Tab, string> = {
  todos: 'Todos',
  aberto: 'Abertos',
  aguardando_pagamento: 'Aguardando',
  em_entrega: 'Em entrega',
  concluido: 'Concluídos',
  cancelado: 'Cancelados',
}

const STATUS_VARIANT: Record<LeilaoStatus, BadgeVariant> = {
  aberto: 'aberto',
  aguardando_pagamento: 'pendente',
  em_entrega: 'destaque',
  concluido: 'concluido',
  cancelado: 'cancelado',
}

const STATUS_LABEL: Record<LeilaoStatus, string> = {
  aberto: 'Aberto',
  aguardando_pagamento: 'Aguardando pgto',
  em_entrega: 'Em entrega',
  concluido: 'Concluído',
  cancelado: 'Cancelado',
}

export default function LeiloesPostoPage() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('todos')
  const meus = useMemo(() => LEILOES.filter((l) => l.postoId === POSTO_LOGADO_ID), [])
  const counts = useMemo(() => {
    const c: Record<Tab, number> = { todos: meus.length, aberto: 0, aguardando_pagamento: 0, em_entrega: 0, concluido: 0, cancelado: 0 }
    for (const l of meus) c[l.status] += 1
    return c
  }, [meus])
  const filtered = useMemo(() => (tab === 'todos' ? meus : meus.filter((l) => l.status === tab)), [meus, tab])

  const cols: DataTableColumn<Leilao>[] = [
    { key: 'codigo', label: 'Código', render: (l) => <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--tanqe-gray)' }}>{l.codigo}</span> },
    { key: 'combustivel', label: 'Combustível', render: (l) => <span style={{ fontWeight: 500 }}>{l.combustivel}</span> },
    { key: 'volume', label: 'Volume', align: 'right', render: (l) => formatLitros(l.volume) },
    { key: 'modalidade', label: 'Modalidade', render: (l) => <Badge variant="neutro">{modalidadeBadge(l.modalidade)}</Badge> },
    { key: 'precoTeto', label: 'Teto', align: 'right', render: (l) => <span style={{ fontFamily: 'var(--font-mono)' }}>{formatPrecoLitro(l.precoTeto)}</span> },
    {
      key: 'melhor',
      label: 'Melhor lance',
      align: 'right',
      render: (l) => {
        const ml = melhorLance(l)
        if (!ml) return <span style={{ color: 'var(--tanqe-gray)' }}>—</span>
        return <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--tanqe-orange)', fontWeight: 600 }}>{formatPrecoLitro(ml.precoLitro)}</span>
      },
    },
    { key: 'status', label: 'Status', render: (l) => <Badge variant={STATUS_VARIANT[l.status]}>{STATUS_LABEL[l.status]}</Badge> },
    {
      key: 'tempo',
      label: 'Tempo',
      render: (l) => {
        if (l.status === 'aberto') return <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>encerra em {formatCountdown(l.endsAt)}</span>
        return <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--tanqe-gray)' }}>{formatData(l.createdAt)}</span>
      },
    },
  ]

  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <SectionHeader
        eyebrow={`${meus.length} leilões publicados`}
        title="Meus leilões"
        subtitle="Gerencie suas demandas de combustível e acompanhe lances em tempo real."
        action={<Button href="/posto/novo-leilao" icon={Plus}>Novo leilão</Button>}
      />

      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--tanqe-stone)', overflowX: 'auto' }}>
        {(['todos', 'aberto', 'aguardando_pagamento', 'em_entrega', 'concluido', 'cancelado'] as Tab[]).map((t) => {
          const active = t === tab
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
                whiteSpace: 'nowrap',
                transition: 'color var(--dur-fast) var(--ease-out)',
              }}
            >
              {TAB_LABELS[t]} <span style={{ opacity: 0.6 }}>({counts[t]})</span>
            </button>
          )
        })}
      </div>

      <Card padding={0}>
        <DataTable
          columns={cols}
          rows={filtered}
          rowKey={(l) => l.id}
          onRowClick={(l) => router.push(`/posto/leilao/${l.id}`)}
          emptyMessage="Nenhum leilão neste status."
        />
      </Card>
    </div>
  )
}
