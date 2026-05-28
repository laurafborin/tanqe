'use client'

export const dynamic = 'force-dynamic'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card } from '@/components/ui/Card'
import { Badge, type BadgeVariant } from '@/components/ui/Badge'
import { DataTable, type DataTableColumn } from '@/components/ui/DataTable'
import { Avatar } from '@/components/ui/Avatar'
import {
  contratosByPosto,
  getDist,
  POSTO_LOGADO_ID,
  type Contrato,
} from '@/lib/mock-data'
import { formatBRL, formatLitros, formatData } from '@/lib/format'

const STATUS_VARIANT: Record<string, BadgeVariant> = {
  assinado: 'concluido',
  pendente: 'pendente',
  cancelado: 'cancelado',
}

export default function ContratosPostoPage() {
  const router = useRouter()
  const contratos = useMemo(() => contratosByPosto(POSTO_LOGADO_ID), [])
  const total = contratos.reduce((s, c) => s + c.valor, 0)
  const assinados = contratos.filter((c) => c.status === 'assinado').length

  const cols: DataTableColumn<Contrato>[] = [
    { key: 'numero', label: 'Nº contrato', render: (c) => <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>{c.numero}</span> },
    {
      key: 'distribuidora',
      label: 'Distribuidora',
      render: (c) => {
        const d = getDist(c.distId)
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Avatar name={d?.nome || '?'} size={28} />
            <span style={{ fontWeight: 500 }}>{d?.nome || '—'}</span>
          </div>
        )
      },
    },
    { key: 'combustivel', label: 'Combustível' },
    { key: 'volume', label: 'Volume', align: 'right', render: (c) => formatLitros(c.volume) },
    { key: 'valor', label: 'Valor', align: 'right', render: (c) => <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{formatBRL(c.valor)}</span> },
    { key: 'status', label: 'Status', render: (c) => <Badge variant={STATUS_VARIANT[c.status]}>{c.status === 'assinado' ? 'Assinado' : c.status === 'pendente' ? 'Pendente' : 'Cancelado'}</Badge> },
    { key: 'criadoEm', label: 'Criado', render: (c) => <span style={{ fontSize: 13, color: 'var(--tanqe-gray)' }}>{formatData(c.criadoEm)}</span> },
  ]

  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <SectionHeader
        eyebrow={`${contratos.length} contratos · ${assinados} assinados`}
        title="Meus contratos"
        subtitle="Histórico fiscal e jurídico de todas as suas negociações fechadas."
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
        <Card>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--tanqe-gray)', margin: 0, marginBottom: 8 }}>Valor total contratado</p>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 28, color: 'var(--tanqe-black)', letterSpacing: '-0.02em', lineHeight: 1 }}>{formatBRL(total)}</div>
        </Card>
        <Card>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--tanqe-gray)', margin: 0, marginBottom: 8 }}>Contratos assinados</p>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 28, color: 'var(--tanqe-black)', letterSpacing: '-0.02em', lineHeight: 1 }}>{assinados} <span style={{ fontSize: 14, color: 'var(--tanqe-gray)', fontWeight: 400 }}>de {contratos.length}</span></div>
        </Card>
        <Card>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--tanqe-gray)', margin: 0, marginBottom: 8 }}>Ticket médio</p>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 28, color: 'var(--tanqe-black)', letterSpacing: '-0.02em', lineHeight: 1 }}>{contratos.length > 0 ? formatBRL(total / contratos.length) : '—'}</div>
        </Card>
      </div>

      <Card padding={0}>
        <DataTable
          columns={cols}
          rows={contratos}
          rowKey={(c) => c.id}
          onRowClick={(c) => router.push(`/posto/contrato/${c.id}`)}
          emptyMessage="Nenhum contrato fechado ainda."
        />
      </Card>
    </div>
  )
}
