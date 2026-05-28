'use client'

export const dynamic = 'force-dynamic'

import { useMemo } from 'react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import {
  nfesByDist,
  DIST_LOGADA_ID,
  getDist,
  getPosto,
  type NFE,
} from '@/lib/mock-data'
import { formatBRL, formatLitros, formatData, formatChaveAcesso, formatPrecoLitro } from '@/lib/format'

export default function NfesDistPage() {
  const nfes = useMemo(() => nfesByDist(DIST_LOGADA_ID), [])
  const totalValor = nfes.reduce((s, n) => s + n.valorTotal, 0)
  const totalImpostos = nfes.reduce((s, n) => s + n.icms + n.pis + n.cofins + n.cide, 0)
  const totalVolume = nfes.reduce((s, n) => s + n.volume, 0)

  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <SectionHeader
        eyebrow={`${nfes.length} notas emitidas pela sua distribuidora`}
        title="Notas fiscais eletrônicas"
        subtitle="Toda venda gera NF-e automática com ICMS, PIS, COFINS e CIDE calculados. Compliance fiscal garantido."
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
        <Card>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--tanqe-gray)', margin: 0, marginBottom: 8 }}>Receita bruta</p>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 28, color: 'var(--tanqe-black)', letterSpacing: '-0.02em', lineHeight: 1 }}>{formatBRL(totalValor)}</div>
        </Card>
        <Card>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--tanqe-gray)', margin: 0, marginBottom: 8 }}>Impostos a recolher</p>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 28, color: 'var(--tanqe-black)', letterSpacing: '-0.02em', lineHeight: 1 }}>{formatBRL(totalImpostos)}</div>
        </Card>
        <Card>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--tanqe-gray)', margin: 0, marginBottom: 8 }}>Volume faturado</p>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 28, color: 'var(--tanqe-black)', letterSpacing: '-0.02em', lineHeight: 1 }}>{formatLitros(totalVolume)}</div>
        </Card>
      </div>

      <div style={{ display: 'grid', gap: 16 }}>
        {nfes.map((nf) => (
          <NfeCard key={nf.id} nfe={nf} />
        ))}
        {nfes.length === 0 && (
          <Card>
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--tanqe-gray)', textAlign: 'center', padding: 32 }}>
              Nenhuma NF-e emitida ainda.
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}

function NfeCard({ nfe }: { nfe: NFE }) {
  const emit = getDist(nfe.emitenteId)
  const dest = getPosto(nfe.destinatarioId)
  const liquido = nfe.valorTotal - nfe.icms - nfe.pis - nfe.cofins - nfe.cide
  return (
    <div style={{ background: 'var(--tanqe-white)', border: '1px solid var(--tanqe-stone)', borderRadius: 4, overflow: 'hidden' }}>
      <div style={{ background: 'var(--tanqe-cream)', padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--tanqe-stone)' }}>
        <div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--tanqe-gray)', margin: 0 }}>
            NF-e nº {String(nfe.numero).padStart(6, '0')} · Série {nfe.serie}
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--tanqe-gray-light)', margin: 0, marginTop: 4, wordBreak: 'break-all' }}>
            Chave: {formatChaveAcesso(nfe.chave)}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Badge variant="concluido">Emitida</Badge>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--tanqe-gray)' }}>{formatData(nfe.dataEmissao)}</span>
        </div>
      </div>
      <div style={{ padding: '20px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, paddingBottom: 20, borderBottom: '1px solid var(--tanqe-stone)' }}>
          <div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--tanqe-gray)', margin: 0, marginBottom: 6 }}>Emitente (você)</p>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, margin: 0 }}>{emit?.nome || '—'}</p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--tanqe-gray)', margin: 0 }}>{emit?.cnpj || '—'}</p>
          </div>
          <div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--tanqe-gray)', margin: 0, marginBottom: 6 }}>Destinatário</p>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, margin: 0 }}>{dest?.nome || '—'}</p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--tanqe-gray)', margin: 0 }}>{dest?.cnpj || '—'}</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16, padding: '20px 0', borderBottom: '1px solid var(--tanqe-stone)' }}>
          <KV label="Produto" value={nfe.combustivel} />
          <KV label="Volume" value={formatLitros(nfe.volume)} />
          <KV label="Preço/L" value={formatPrecoLitro(nfe.precoLitro)} mono />
          <KV label="Valor total" value={formatBRL(nfe.valorTotal)} highlight />
        </div>

        <div style={{ background: 'var(--tanqe-cream)', borderRadius: 4, padding: 16, marginTop: 16 }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--tanqe-gray)', margin: 0, marginBottom: 12 }}>
            Tributos e encargos (a recolher)
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12 }}>
            <KV label="ICMS 18%" value={formatBRL(nfe.icms)} small />
            <KV label="PIS 1,65%" value={formatBRL(nfe.pis)} small />
            <KV label="COFINS 7,6%" value={formatBRL(nfe.cofins)} small />
            <KV label="CIDE 1%" value={formatBRL(nfe.cide)} small />
            <KV label="Receita líquida" value={formatBRL(liquido)} small highlight />
          </div>
        </div>
      </div>
    </div>
  )
}

function KV({ label, value, mono, highlight, small }: { label: string; value: string; mono?: boolean; highlight?: boolean; small?: boolean }) {
  return (
    <div>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: small ? 9 : 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--tanqe-gray)', margin: 0, marginBottom: 4 }}>{label}</p>
      <p style={{ fontFamily: mono ? 'var(--font-mono)' : 'var(--font-body)', fontSize: small ? 13 : 15, fontWeight: 600, margin: 0, color: highlight ? 'var(--tanqe-orange)' : 'var(--tanqe-black)' }}>{value}</p>
    </div>
  )
}
