'use client'

export const dynamic = 'force-dynamic'

import { use, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { TrendingDown } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card } from '@/components/ui/Card'
import { Badge, type BadgeVariant } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import {
  getLeilao,
  getPosto,
  distLabelInLeilao,
  modalidadeBadge,
  DIST_LOGADA_ID,
  type Lance,
  type LeilaoStatus,
} from '@/lib/mock-data'
import { formatBRL, formatLitros, formatPrecoLitro, formatCountdown, timeAgo } from '@/lib/format'

const STATUS_VARIANT: Record<LeilaoStatus, BadgeVariant> = {
  aberto: 'aberto',
  aguardando_pagamento: 'pendente',
  em_entrega: 'destaque',
  concluido: 'concluido',
  cancelado: 'cancelado',
}

export default function DistLeilaoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const leilao = getLeilao(id)
  const [lances, setLances] = useState<Lance[]>(leilao?.lances ?? [])
  const [meuPreco, setMeuPreco] = useState<number>(() => {
    if (!leilao || leilao.lances.length === 0) return leilao?.precoTeto ?? 0
    return Number((Math.min(...leilao.lances.map((l) => l.precoLitro)) * 0.99).toFixed(3))
  })
  const [submitted, setSubmitted] = useState(false)
  const [countdown, setCountdown] = useState('')

  useEffect(() => {
    if (!leilao || leilao.status !== 'aberto') return
    const tick = () => setCountdown(formatCountdown(leilao.endsAt))
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [leilao])

  const sorted = useMemo(() => [...lances].sort((a, b) => a.precoLitro - b.precoLitro), [lances])
  const melhor = sorted[0]
  const meuMelhor = useMemo(() => sorted.find((l) => l.distId === DIST_LOGADA_ID), [sorted])
  const estouGanhando = meuMelhor && melhor && meuMelhor.id === melhor.id

  if (!leilao) {
    return <div style={{ padding: 32 }}><Card><p style={{ fontFamily: 'var(--font-body)', color: 'var(--tanqe-gray)' }}>Leilão não encontrado.</p></Card></div>
  }
  const posto = getPosto(leilao.postoId)

  function darLance() {
    const novo: Lance = {
      id: `${id}_eu_${Date.now()}`,
      leilaoId: id,
      distId: DIST_LOGADA_ID,
      precoLitro: meuPreco,
      prazoEntrega: 3,
      timestamp: new Date().toISOString(),
      observacoes: 'Lance enviado pela plataforma',
    }
    setLances((prev) => [...prev, novo])
    setSubmitted(true)
    setMeuPreco((p) => Number((p * 0.995).toFixed(3)))
    setTimeout(() => setSubmitted(false), 2500)
  }

  function cobrirLance() {
    if (!melhor) return
    setMeuPreco(Number((melhor.precoLitro * 0.995).toFixed(3)))
  }

  const valorEstimado = meuPreco * leilao.volume

  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <Link href="/distribuidora/leiloes" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--tanqe-gray)', textDecoration: 'none' }}>← Voltar pra oportunidades</Link>

      <SectionHeader
        eyebrow={`${leilao.codigo} · ${posto?.nome ?? '—'} · ${posto?.cidade}/${posto?.uf}`}
        title={`${leilao.combustivel} · ${formatLitros(leilao.volume)}`}
        subtitle="Dê seu lance. Quem oferecer o melhor preço vence."
        action={<Badge variant={STATUS_VARIANT[leilao.status]}>{leilao.status === 'aberto' ? 'Aberto' : leilao.status}</Badge>}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,2fr) minmax(0,1fr)', gap: 24 }} className="lei-row">
        <div style={{ display: 'grid', gap: 24 }}>
          <Card>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--tanqe-gray)', margin: 0, marginBottom: 12 }}>
              Encerra em
            </p>
            <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 56, color: 'var(--tanqe-orange)', letterSpacing: '-0.02em', lineHeight: 1 }}>
              {countdown || formatCountdown(leilao.endsAt)}
            </div>
          </Card>

          <Card title="Lances recebidos" eyebrow={`${lances.length} ofertas`}>
            {leilao.status === 'aberto' && (
              <div style={{ marginBottom: 12, padding: 10, background: 'var(--tanqe-cream)', borderRadius: 3, fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--tanqe-gray)', lineHeight: 1.5 }}>
                🔒 Os concorrentes ficam anônimos enquanto o leilão estiver aberto. Você só vê os preços deles.
              </div>
            )}
            {sorted.map((l) => {
              const dummyLeilao = { ...leilao, lances }
              const { label, revelado } = distLabelInLeilao(dummyLeilao, l.distId, DIST_LOGADA_ID)
              const isMine = l.distId === DIST_LOGADA_ID
              const isBest = melhor && l.id === melhor.id
              return (
                <div
                  key={l.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr auto',
                    gap: 14,
                    padding: '12px 14px',
                    border: isBest ? '1px solid var(--tanqe-orange)' : isMine ? '1px solid var(--tanqe-orange-mid)' : '1px solid var(--tanqe-stone)',
                    background: isMine ? 'var(--tanqe-orange-pale)' : 'transparent',
                    borderRadius: 4,
                    marginBottom: 8,
                    alignItems: 'center',
                  }}
                >
                  <Avatar name={label} size={32} />
                  <div>
                    <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                      {label}
                      {!revelado && !isMine && (
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--tanqe-gray)', background: 'var(--tanqe-stone)', padding: '2px 6px', borderRadius: 2 }}>
                          anônimo
                        </span>
                      )}
                    </p>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--tanqe-gray)', margin: 0, marginTop: 2 }}>{timeAgo(l.timestamp)}</p>
                  </div>
                  <p style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 15, color: isBest ? 'var(--tanqe-orange-deep)' : 'var(--tanqe-black)', margin: 0 }}>{formatPrecoLitro(l.precoLitro)}</p>
                </div>
              )
            })}
          </Card>
        </div>

        <div style={{ display: 'grid', gap: 16, alignContent: 'flex-start' }}>
          <Card eyebrow={estouGanhando ? 'Você está ganhando' : meuMelhor ? 'Você está perdendo' : 'Seu lance'} title={meuMelhor ? formatPrecoLitro(meuMelhor.precoLitro) : '—'} action={estouGanhando ? <Badge variant="ativo">GANHANDO</Badge> : meuMelhor ? <Badge variant="atrasado">PERDENDO</Badge> : null}>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', rowGap: 8, columnGap: 12, fontFamily: 'var(--font-body)', fontSize: 13, marginTop: 8 }}>
              <span style={{ color: 'var(--tanqe-gray)' }}>Teto do posto</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>{formatPrecoLitro(leilao.precoTeto)}</span>
              <span style={{ color: 'var(--tanqe-gray)' }}>Melhor atual</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--tanqe-orange)' }}>{melhor ? formatPrecoLitro(melhor.precoLitro) : '—'}</span>
              <span style={{ color: 'var(--tanqe-gray)' }}>Modalidade</span>
              <span><Badge variant="destaque">{modalidadeBadge(leilao.modalidade)}</Badge></span>
            </div>
          </Card>

          {leilao.status === 'aberto' && (
            <Card title="Enviar lance" eyebrow="Quanto você cobra por litro?">
              <div style={{ marginBottom: 16 }}>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontFamily: 'var(--font-mono)', color: 'var(--tanqe-gray)' }}>R$</span>
                  <input
                    type="number"
                    step="0.001"
                    value={meuPreco}
                    onChange={(e) => setMeuPreco(Number(e.target.value))}
                    style={{ width: '100%', padding: '14px 16px 14px 40px', border: '1px solid var(--tanqe-stone)', borderRadius: 3, fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 600 }}
                  />
                </div>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--tanqe-gray)', margin: '8px 0 0', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Valor estimado: <span style={{ color: 'var(--tanqe-orange)', fontWeight: 600 }}>{formatBRL(valorEstimado)}</span>
                </p>
              </div>
              <div style={{ display: 'grid', gap: 8 }}>
                <Button onClick={darLance} fullWidth disabled={submitted}>{submitted ? 'Lance enviado ✓' : 'Enviar lance'}</Button>
                {melhor && !estouGanhando && (
                  <Button variant="secondary" onClick={cobrirLance} fullWidth icon={TrendingDown}>
                    Cobrir melhor lance
                  </Button>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
      <style>{`@media (max-width: 1023px) { .lei-row { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  )
}
