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
  contratosByDist,
  getPosto,
  DIST_LOGADA_ID,
  type Contrato,
} from '@/lib/mock-data'
import { formatBRL, formatLitros, formatData } from '@/lib/format'

const STATUS_VARIANT: Record<string, BadgeVariant> = {
  assinado: 'concluido',
  pendente: 'pendente',
  cancelado: 'cancelado',
}

export default function ContratosDistPage() {
  const router = useRouter()
  const contratos = useMemo(() => contratosByDist(DIST_LOGADA_ID), [])
  const totalReceita = contratos.reduce((s, c) => s + c.valor, 0)
  const assinados = contratos.filter((c) => c.status === 'assinado').length

  const cols: DataTableColumn<Contrato>[] = [
    { key: 'numero', label: 'Nº contrato', render: (c) => <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>{c.numero}</span> },
    {
      key: 'posto',
      label: 'Posto comprador',
      render: (c) => {
        const p = getPosto(c.postoId)
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Avatar name={p?.nome || '?'} size={28} />
            <span style={{ fontWeight: 500 }}>{p?.nome || '—'}</span>
          </div>
        )
      },
    },
    { key: 'combustivel', label: 'Combustível' },
    { key: 'volume', label: 'Volume', align: 'right', render: (c) => formatLitros(c.volume) },
    { key: 'valor', label: 'Receita', align: 'right', render: (c) => <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{formatBRL(c.valor)}</span> },
    { key: 'status', label: 'Status', render: (c) => <Badge variant={STATUS_VARIANT[c.status]}>{c.status === 'assinado' ? 'Assinado' : c.status === 'pendente' ? 'Pendente' : 'Cancelado'}</Badge> },
    { key: 'criadoEm', label: 'Criado', render: (c) => <span style={{ fontSize: 13, color: 'var(--tanqe-gray)' }}>{formatData(c.criadoEm)}</span> },
  ]

  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <SectionHeader
        eyebrow={`${contratos.length} contratos firmados · ${assinados} assinados`}
        title="Contratos firmados"
        subtitle="Receita contratada com cada posto comprador. Todo contrato gera NF-e e pedido rastreável."
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
        <Card>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--tanqe-gray)', margin: 0, marginBottom: 8 }}>Receita contratada</p>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 28, color: 'var(--tanqe-black)', letterSpacing: '-0.02em', lineHeight: 1 }}>{formatBRL(totalReceita)}</div>
        </Card>
        <Card>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--tanqe-gray)', margin: 0, marginBottom: 8 }}>Contratos assinados</p>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 28, color: 'var(--tanqe-black)', letterSpacing: '-0.02em', lineHeight: 1 }}>{assinados} <span style={{ fontSize: 14, color: 'var(--tanqe-gray)', fontWeight: 400 }}>de {contratos.length}</span></div>
        </Card>
        <Card>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--tanqe-gray)', margin: 0, marginBottom: 8 }}>Ticket médio</p>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 28, color: 'var(--tanqe-black)', letterSpacing: '-0.02em', lineHeight: 1 }}>{contratos.length > 0 ? formatBRL(totalReceita / contratos.length) : '—'}</div>
        </Card>
      </div>

      <Card padding={0}>
        <DataTable
          columns={cols}
          rows={contratos}
          rowKey={(c) => c.id}
          onRowClick={(c) => router.push(`/distribuidora/contrato/${c.id}`)}
          emptyMessage="Nenhum contrato firmado ainda."
        />
      </Card>
    </div>
  )
}
