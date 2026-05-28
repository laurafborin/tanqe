'use client'

export const dynamic = 'force-dynamic'

import { use, useEffect, useMemo, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Zap } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card } from '@/components/ui/Card'
import { Badge, type BadgeVariant } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import {
  DISTRIBUIDORAS,
  getLeilao,
  getDist,
  getContratoByLeilao,
  type Lance,
  type LeilaoStatus,
} from '@/lib/mock-data'
import { formatBRL, formatLitros, formatPrecoLitro, formatCountdown, timeAgo, formatPctRaw } from '@/lib/format'

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

export default function LeilaoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const leilaoOriginal = getLeilao(id)
  const [lances, setLances] = useState<Lance[]>(leilaoOriginal?.lances ?? [])
  const [countdown, setCountdown] = useState('')
  const [status, setStatus] = useState<LeilaoStatus>(leilaoOriginal?.status ?? 'aberto')
  const [showToast, setShowToast] = useState<string | null>(null)
  const [newLanceId, setNewLanceId] = useState<string | null>(null)
  const [accepting, setAccepting] = useState(false)
  const toastTimer = useRef<NodeJS.Timeout | null>(null)

  // countdown
  useEffect(() => {
    if (!leilaoOriginal || status !== 'aberto') return
    const tick = () => setCountdown(formatCountdown(leilaoOriginal.endsAt))
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [leilaoOriginal, status])

  // live bid simulation
  useEffect(() => {
    if (!leilaoOriginal || status !== 'aberto') return
    let timer: NodeJS.Timeout
    const schedule = () => {
      const delay = (7 + Math.random() * 6) * 1000
      timer = setTimeout(() => {
        setLances((prev) => {
          if (prev.length === 0) return prev
          const sorted = [...prev].sort((a, b) => a.precoLitro - b.precoLitro)
          const melhor = sorted[0]
          const queda = 0.005 + Math.random() * 0.012
          const novoPreco = Number((melhor.precoLitro * (1 - queda)).toFixed(3))
          const distrIds = DISTRIBUIDORAS.map((d) => d.id).filter((dId) => dId !== melhor.distId)
          const distId = distrIds[Math.floor(Math.random() * distrIds.length)] ?? DISTRIBUIDORAS[0].id
          const dist = getDist(distId)
          const novoLance: Lance = {
            id: `${id}_live_${Date.now()}`,
            leilaoId: id,
            distId,
            precoLitro: novoPreco,
            prazoEntrega: melhor.prazoEntrega,
            timestamp: new Date().toISOString(),
            observacoes: 'Lance ao vivo',
          }
          setNewLanceId(novoLance.id)
          setShowToast(`Novo lance: ${dist?.nome ?? '—'} · ${formatPrecoLitro(novoPreco)}`)
          if (toastTimer.current) clearTimeout(toastTimer.current)
          toastTimer.current = setTimeout(() => setShowToast(null), 3000)
          return [...prev, novoLance]
        })
        schedule()
      }, delay)
    }
    schedule()
    return () => {
      if (timer) clearTimeout(timer)
      if (toastTimer.current) clearTimeout(toastTimer.current)
    }
  }, [id, leilaoOriginal, status])

  const lancesOrdenados = useMemo(() => [...lances].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()), [lances])
  const sortedByPrice = useMemo(() => [...lances].sort((a, b) => a.precoLitro - b.precoLitro), [lances])
  const melhor = sortedByPrice[0]
  const melhorDist = melhor ? getDist(melhor.distId) : undefined
  const economiaProjetada = leilaoOriginal && melhor ? (leilaoOriginal.precoTeto - melhor.precoLitro) * leilaoOriginal.volume : 0
  const economiaPct = leilaoOriginal && melhor ? ((leilaoOriginal.precoTeto - melhor.precoLitro) / leilaoOriginal.precoTeto) * 100 : 0

  if (!leilaoOriginal) {
    return (
      <div style={{ padding: 32 }}>
        <Card><p style={{ fontFamily: 'var(--font-body)', color: 'var(--tanqe-gray)' }}>Leilão não encontrado.</p></Card>
      </div>
    )
  }

  const handleAccept = () => {
    setAccepting(true)
    setTimeout(() => {
      setStatus('aguardando_pagamento')
      setAccepting(false)
      setShowToast(`Lance aceito! Contrato com ${melhorDist?.nome} em geração.`)
      if (toastTimer.current) clearTimeout(toastTimer.current)
      toastTimer.current = setTimeout(() => setShowToast(null), 4000)
    }, 600)
  }

  const contrato = getContratoByLeilao(id)

  return (
    <div style={{ display: 'grid', gap: 24, position: 'relative' }}>
      {showToast && (
        <div style={{
          position: 'fixed', top: 24, right: 24, zIndex: 100, padding: '14px 20px',
          background: 'var(--tanqe-charcoal)', color: 'var(--tanqe-white)', borderRadius: 4,
          border: '1px solid rgba(232,88,26,0.3)', fontFamily: 'var(--font-body)', fontSize: 13,
          boxShadow: 'var(--shadow-lg)', display: 'flex', alignItems: 'center', gap: 10, maxWidth: 380,
          animation: 'tanqe-slide 0.3s var(--ease-out)',
        }}>
          <Zap size={16} color="var(--tanqe-orange)" /> {showToast}
        </div>
      )}
      <style>{`@keyframes tanqe-slide { from { transform: translateY(-12px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }`}</style>
      <style>{`@keyframes tanqe-newrow { 0% { background: rgba(232,88,26,0.18); transform: translateY(-4px); opacity: 0 } 100% { background: transparent; transform: translateY(0); opacity: 1 } }`}</style>

      <Link href="/posto/leiloes" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--tanqe-gray)', textDecoration: 'none' }}>← Voltar pra leilões</Link>

      <SectionHeader
        eyebrow={`${leilaoOriginal.codigo} · ${leilaoOriginal.regiao}`}
        title={`${leilaoOriginal.combustivel} · ${formatLitros(leilaoOriginal.volume)}`}
        subtitle={status === 'aberto' ? 'Distribuidoras competindo em tempo real. O melhor preço vence.' : 'Detalhe do leilão e histórico de lances.'}
        action={<Badge variant={STATUS_VARIANT[status]}>{STATUS_LABEL[status]}</Badge>}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: 24 }} className="lei-row">
        <div style={{ display: 'grid', gap: 24 }}>
          {/* Countdown */}
          <Card>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--tanqe-gray)', margin: 0, marginBottom: 12 }}>
              {status === 'aberto' ? 'Encerra em' : 'Encerrado'}
            </p>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontWeight: 600,
              fontSize: 64,
              color: status === 'aberto' ? 'var(--tanqe-orange)' : 'var(--tanqe-gray)',
              letterSpacing: '-0.02em',
              lineHeight: 1,
            }}>
              {status === 'aberto' ? countdown || formatCountdown(leilaoOriginal.endsAt) : '—'}
            </div>
          </Card>

          {/* Lances */}
          <Card title="Lances recebidos" eyebrow={`${lances.length} ofertas · melhor: ${melhor ? formatPrecoLitro(melhor.precoLitro) : '—'}`}>
            <div style={{ display: 'grid', gap: 10 }}>
              {lancesOrdenados.map((l, i) => {
                const d = getDist(l.distId)
                const isBest = melhor && l.id === melhor.id
                const isNew = l.id === newLanceId
                const prevPrice = sortedByPrice.find((x) => x.id === l.id) ? sortedByPrice[Math.max(0, sortedByPrice.findIndex((x) => x.id === l.id) - 1)] : undefined
                const variacao = prevPrice && prevPrice.id !== l.id ? ((prevPrice.precoLitro - l.precoLitro) / prevPrice.precoLitro) * 100 : null
                return (
                  <div
                    key={l.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'auto 1fr auto auto',
                      gap: 14,
                      alignItems: 'center',
                      padding: 14,
                      border: isBest ? '1px solid var(--tanqe-orange)' : '1px solid var(--tanqe-stone)',
                      borderRadius: 4,
                      background: isBest ? 'var(--tanqe-orange-pale)' : 'var(--tanqe-white)',
                      animation: isNew ? 'tanqe-newrow 0.7s var(--ease-out)' : undefined,
                    }}
                  >
                    <Avatar name={d?.nome || '?'} size={36} />
                    <div>
                      <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, margin: 0 }}>{d?.nome}</p>
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--tanqe-gray)', margin: 0, marginTop: 2 }}>
                        {timeAgo(l.timestamp)} · prazo {l.prazoEntrega}d{l.observacoes ? ` · ${l.observacoes}` : ''}
                      </p>
                    </div>
                    {variacao !== null && variacao > 0 && (
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, padding: '2px 8px', borderRadius: 2, background: 'var(--status-success-bg)', color: 'var(--status-success-fg)' }}>
                        {formatPctRaw(variacao, 1)} ▼
                      </span>
                    )}
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 16, color: isBest ? 'var(--tanqe-orange-deep)' : 'var(--tanqe-black)', margin: 0 }}>{formatPrecoLitro(l.precoLitro)}</p>
                      {isBest && <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--tanqe-orange-deep)', margin: 0, marginTop: 2 }}>melhor lance</p>}
                    </div>
                  </div>
                )
              })}
              {lances.length === 0 && <p style={{ color: 'var(--tanqe-gray)', textAlign: 'center', padding: 24 }}>Nenhum lance ainda.</p>}
            </div>
          </Card>
        </div>

        <div style={{ display: 'grid', gap: 24, alignContent: 'flex-start' }}>
          <Card eyebrow="Resumo do leilão" title="Detalhes">
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', rowGap: 12, columnGap: 16, fontFamily: 'var(--font-body)', fontSize: 13 }}>
              <span style={{ color: 'var(--tanqe-gray)' }}>Preço-teto</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{formatPrecoLitro(leilaoOriginal.precoTeto)}</span>
              <span style={{ color: 'var(--tanqe-gray)' }}>Melhor lance</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--tanqe-orange)' }}>{melhor ? formatPrecoLitro(melhor.precoLitro) : '—'}</span>
              <span style={{ color: 'var(--tanqe-gray)' }}>Volume</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>{formatLitros(leilaoOriginal.volume)}</span>
              <span style={{ color: 'var(--tanqe-gray)' }}>Pagamento</span>
              <span>{leilaoOriginal.formaPagamento}</span>
              <span style={{ color: 'var(--tanqe-gray)' }}>Região</span>
              <span>{leilaoOriginal.regiao}</span>
            </div>
          </Card>
          <Card eyebrow="Economia projetada" title="Versus seu teto">
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 36, color: 'var(--tanqe-orange)', letterSpacing: '-0.02em', lineHeight: 1 }}>
              {formatBRL(economiaProjetada)}
            </div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--tanqe-gray)', marginTop: 8 }}>
              {formatPctRaw(economiaPct, 1, true)} abaixo do teto
            </p>
          </Card>
          {status === 'aberto' && melhor && (
            <Button onClick={handleAccept} size="lg" fullWidth disabled={accepting}>
              {accepting ? 'Processando…' : `Aceitar ${formatPrecoLitro(melhor.precoLitro)} →`}
            </Button>
          )}
          {(status === 'aguardando_pagamento' || status === 'em_entrega' || status === 'concluido') && contrato && (
            <Button href={`/posto/contrato/${contrato.id}`} size="lg" fullWidth variant="secondary" icon={CheckCircle}>
              Ver contrato gerado
            </Button>
          )}
        </div>
      </div>
      <style>{`@media (max-width: 1023px) { .lei-row { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  )
}
