'use client'

export const dynamic = 'force-dynamic'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Fuel, Calendar, DollarSign, Check, Sparkles } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ANP_30D, type Combustivel } from '@/lib/mock-data'
import { formatBRL, formatLitros, formatPrecoLitro } from '@/lib/format'

const COMBUSTIVEIS: Array<{ value: Combustivel; cor: string; ref: number }> = [
  { value: 'Gasolina Comum', cor: '#E8581A', ref: 5.78 },
  { value: 'Gasolina Aditivada', cor: '#F4874A', ref: 5.98 },
  { value: 'Etanol Hidratado', cor: '#F9C9AE', ref: 3.91 },
  { value: 'Diesel S-10', cor: '#0F0F0E', ref: 5.91 },
  { value: 'Diesel S-500', cor: '#7A7870', ref: 5.74 },
]

export default function NovoLeilaoPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [combustivel, setCombustivel] = useState<Combustivel>('Diesel S-10')
  const [volume, setVolume] = useState(25000)
  const [dataEntrega, setDataEntrega] = useState('')
  const [pagamento, setPagamento] = useState<'PIX' | '30 dias' | '45 dias'>('PIX')
  const [precoTeto, setPrecoTeto] = useState(5.92)

  const selectedCombustivel = useMemo(() => COMBUSTIVEIS.find((c) => c.value === combustivel)!, [combustivel])
  const sugestao = selectedCombustivel.ref

  function publicar() {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(
        'tanqe:novo-leilao-recente',
        JSON.stringify({ combustivel, volume, precoTeto, pagamento, criadoEm: new Date().toISOString() }),
      )
    }
    router.push('/posto/leiloes')
  }

  return (
    <div style={{ display: 'grid', gap: 32 }}>
      <SectionHeader eyebrow="Wizard · 3 passos" title="Novo leilão reverso" subtitle="Publique sua demanda. Em segundos, distribuidoras competem pelo seu volume." />

      {/* Stepper */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        {[1, 2, 3].map((s, i) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 16, flex: i === 2 ? 0 : 1 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                opacity: step >= s ? 1 : 0.4,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: step > s ? 'var(--tanqe-success)' : step === s ? 'var(--tanqe-orange)' : 'var(--tanqe-stone)',
                  color: step >= s ? 'var(--tanqe-white)' : 'var(--tanqe-gray)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: 14,
                }}
              >
                {step > s ? <Check size={16} strokeWidth={3} /> : s}
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: step >= s ? 'var(--tanqe-black)' : 'var(--tanqe-gray)' }}>
                {['O que', 'Quando', 'Preço'][s - 1]}
              </span>
            </div>
            {i < 2 && <div style={{ flex: 1, height: 2, background: step > s ? 'var(--tanqe-success)' : 'var(--tanqe-stone)' }} />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <Card title="O que você precisa?" eyebrow="Combustível e volume">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 32 }}>
            {COMBUSTIVEIS.map((c) => {
              const active = c.value === combustivel
              return (
                <button
                  key={c.value}
                  onClick={() => setCombustivel(c.value)}
                  style={{
                    background: 'var(--tanqe-white)',
                    border: active ? '2px solid var(--tanqe-orange)' : '1px solid var(--tanqe-stone)',
                    borderRadius: 4,
                    padding: 16,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'border-color var(--dur-fast) var(--ease-out)',
                  }}
                >
                  <Fuel size={20} color={c.cor} strokeWidth={1.75} />
                  <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--tanqe-black)', margin: '12px 0 4px' }}>{c.value}</p>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--tanqe-gray)', margin: 0 }}>Ref. ANP {formatPrecoLitro(c.ref)}</p>
                </button>
              )
            })}
          </div>

          <div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--tanqe-gray)', margin: 0, marginBottom: 12 }}>Volume desejado</p>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 56, color: 'var(--tanqe-orange)', letterSpacing: '-0.04em' }}>{formatLitros(volume)}</span>
            </div>
            <input
              type="range"
              min={5000}
              max={60000}
              step={1000}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--tanqe-orange)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--tanqe-gray)' }}>
              <span>5.000 L</span>
              <span>60.000 L</span>
            </div>
          </div>

          <div style={{ marginTop: 32, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={() => setStep(2)}>Próximo →</Button>
          </div>
        </Card>
      )}

      {step === 2 && (
        <Card title="Quando você precisa?" eyebrow="Entrega e pagamento">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24, marginBottom: 24 }}>
            <div>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--tanqe-gray)', display: 'block', marginBottom: 8 }}>
                Data de entrega
              </label>
              <input
                type="date"
                value={dataEntrega}
                onChange={(e) => setDataEntrega(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--tanqe-stone)', borderRadius: 3, fontFamily: 'var(--font-body)', fontSize: 14 }}
              />
            </div>
            <div>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--tanqe-gray)', display: 'block', marginBottom: 8 }}>
                Condição de pagamento
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                {(['PIX', '30 dias', '45 dias'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPagamento(p)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      border: pagamento === p ? '2px solid var(--tanqe-orange)' : '1px solid var(--tanqe-stone)',
                      borderRadius: 3,
                      background: 'var(--tanqe-white)',
                      fontFamily: 'var(--font-display)',
                      fontSize: 13,
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div style={{ background: 'var(--tanqe-cream)', padding: 16, borderRadius: 4, marginBottom: 24 }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--tanqe-gray)', margin: 0, lineHeight: 1.6 }}>
              Você está pedindo <strong style={{ color: 'var(--tanqe-black)' }}>{formatLitros(volume)} de {combustivel}</strong>
              {dataEntrega ? <> com entrega para <strong style={{ color: 'var(--tanqe-black)' }}>{new Date(dataEntrega).toLocaleDateString('pt-BR')}</strong></> : ''}
              , pagamento <strong style={{ color: 'var(--tanqe-black)' }}>{pagamento}</strong>.
            </p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="ghost" onClick={() => setStep(1)}>← Voltar</Button>
            <Button onClick={() => setStep(3)}>Próximo →</Button>
          </div>
        </Card>
      )}

      {step === 3 && (
        <Card title="Preço de partida (teto)" eyebrow="Valor máximo que você aceita pagar">
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 24, marginBottom: 24 }} className="prc-row">
            <div>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--tanqe-gray)', display: 'block', marginBottom: 8 }}>
                Preço-teto (R$/L)
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', fontFamily: 'var(--font-mono)', color: 'var(--tanqe-gray)' }}>R$</span>
                <input
                  type="number"
                  step="0.01"
                  value={precoTeto}
                  onChange={(e) => setPrecoTeto(Number(e.target.value))}
                  style={{ width: '100%', padding: '12px 16px 12px 40px', border: '1px solid var(--tanqe-stone)', borderRadius: 3, fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 600 }}
                />
              </div>
              <button
                onClick={() => setPrecoTeto(sugestao)}
                style={{
                  marginTop: 12,
                  background: 'var(--tanqe-orange-pale)',
                  border: 'none',
                  borderRadius: 3,
                  padding: '8px 12px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'var(--tanqe-orange-deep)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <Sparkles size={12} /> usar sugestão ANP {formatPrecoLitro(sugestao)}
              </button>
            </div>
            <div style={{ background: 'var(--tanqe-cream)', padding: 20, borderRadius: 4 }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--tanqe-gray)', margin: 0, marginBottom: 6 }}>Resumo</p>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, margin: 0 }}>
                {formatLitros(volume)} · {combustivel}
              </p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--tanqe-gray)', margin: '4px 0 12px' }}>Pagamento {pagamento}</p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--tanqe-gray)', margin: 0 }}>Valor máximo total</p>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, color: 'var(--tanqe-orange)', margin: 0, letterSpacing: '-0.02em' }}>
                {formatBRL(precoTeto * volume)}
              </p>
            </div>
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--tanqe-gray)', margin: '0 0 20px', lineHeight: 1.6 }}>
            Distribuidoras competem para baixar este valor. O melhor preço vence.
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="ghost" onClick={() => setStep(2)}>← Voltar</Button>
            <Button onClick={publicar}>Publicar leilão →</Button>
          </div>
        </Card>
      )}
      <style>{`@media (max-width: 700px) { .prc-row { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  )
}
