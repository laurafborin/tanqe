'use client'

export const dynamic = 'force-dynamic'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import {
  leiloesAbertos,
  getPosto,
  melhorLance,
  type Combustivel,
} from '@/lib/mock-data'
import { formatLitros, formatPrecoLitro, formatCountdown } from '@/lib/format'

const COMBUSTIVEIS: Combustivel[] = ['Gasolina Comum', 'Gasolina Aditivada', 'Etanol Hidratado', 'Diesel S-10', 'Diesel S-500']

export default function OportunidadesPage() {
  const router = useRouter()
  const [filter, setFilter] = useState<Combustivel | 'todos'>('todos')
  const all = useMemo(() => leiloesAbertos(), [])
  const filtered = useMemo(() => (filter === 'todos' ? all : all.filter((l) => l.combustivel === filter)), [all, filter])

  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <SectionHeader
        eyebrow={`${all.length} oportunidades abertas agora`}
        title="Oportunidades"
        subtitle="Demanda qualificada de postos esperando seu lance. Quem oferece o melhor preço vence."
      />

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button onClick={() => setFilter('todos')} style={chipStyle(filter === 'todos')}>Todos ({all.length})</button>
        {COMBUSTIVEIS.map((c) => {
          const count = all.filter((l) => l.combustivel === c).length
          if (count === 0) return null
          return <button key={c} onClick={() => setFilter(c)} style={chipStyle(filter === c)}>{c} ({count})</button>
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
        {filtered.map((l) => {
          const ml = melhorLance(l)
          const posto = getPosto(l.postoId)
          return (
            <Card key={l.id} padding={20} hoverable>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <Badge variant="aberto">{l.combustivel}</Badge>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--tanqe-gray)' }}>{l.codigo}</span>
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--tanqe-black)', margin: 0 }}>{formatLitros(l.volume)}</h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--tanqe-gray)', margin: '4px 0 16px' }}>{posto?.nome} · {posto?.cidade}/{posto?.uf}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '12px 0', borderTop: '1px solid var(--tanqe-stone)', borderBottom: '1px solid var(--tanqe-stone)' }}>
                <div>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--tanqe-gray)', margin: 0 }}>Preço atual</p>
                  <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: 'var(--tanqe-orange)', margin: 0, letterSpacing: '-0.01em' }}>
                    {formatPrecoLitro(ml?.precoLitro ?? l.precoAtual)}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--tanqe-gray)', margin: 0 }}>Encerra em</p>
                  <p style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 14, color: 'var(--tanqe-black)', margin: 0 }}>{formatCountdown(l.endsAt)}</p>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--tanqe-gray)', margin: 0 }}>{l.lances.length} {l.lances.length === 1 ? 'lance' : 'lances'} · {l.formaPagamento}</p>
                <Button size="sm" onClick={() => router.push(`/distribuidora/leilao/${l.id}`)}>Dar lance →</Button>
              </div>
            </Card>
          )
        })}
        {filtered.length === 0 && (
          <Card>
            <p style={{ textAlign: 'center', color: 'var(--tanqe-gray)', padding: 32 }}>Nenhuma oportunidade neste filtro.</p>
          </Card>
        )}
      </div>
    </div>
  )
}

function chipStyle(active: boolean): React.CSSProperties {
  return {
    background: active ? 'var(--tanqe-orange)' : 'var(--tanqe-white)',
    color: active ? 'var(--tanqe-white)' : 'var(--tanqe-gray)',
    border: active ? '1px solid var(--tanqe-orange)' : '1px solid var(--tanqe-stone)',
    padding: '8px 14px',
    borderRadius: 100,
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    cursor: 'pointer',
    transition: 'all var(--dur-fast) var(--ease-out)',
  }
}
