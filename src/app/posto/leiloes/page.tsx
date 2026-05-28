'use client'


export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Leilao } from '@/lib/types'
import { Plus } from 'lucide-react'

const eyebrow = {
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.15em',
  color: 'var(--tanqe-orange)',
  margin: 0,
}

const title = {
  fontFamily: 'var(--font-display)',
  fontWeight: 800,
  fontSize: 'clamp(28px, 3.5vw, 40px)',
  color: 'var(--tanqe-black)',
  letterSpacing: '-0.02em',
  lineHeight: 1.1,
  margin: '12px 0 8px',
}

const subtitle = {
  fontFamily: 'var(--font-body)',
  fontWeight: 300,
  fontSize: 15,
  color: 'var(--tanqe-gray)',
  margin: 0,
}

const statusStyle: Record<string, { bg: string; color: string; label: string }> = {
  aberto: { bg: 'var(--tanqe-orange-pale)', color: 'var(--tanqe-orange-deep)', label: 'ABERTO' },
  contratado: { bg: '#E8F5E9', color: 'var(--tanqe-success)', label: 'CONTRATADO' },
  encerrado: { bg: 'var(--tanqe-stone)', color: 'var(--tanqe-gray)', label: 'ENCERRADO' },
  cancelado: { bg: '#FFE5E5', color: 'var(--tanqe-danger)', label: 'CANCELADO' },
}

export default function LeiloesPostoPage() {
  const [leiloes, setLeiloes] = useState<Leilao[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }
      const { data } = await supabase
        .from('leiloes')
        .select('*')
        .eq('posto_id', user.id)
        .order('created_at', { ascending: false })
      setLeiloes(data || [])
      setLoading(false)
    }
    load()
  }, [])

  const ativos = leiloes.filter(l => l.status === 'aberto').length
  const contratados = leiloes.filter(l => l.status === 'contratado').length

  return (
    <div style={{ display: 'grid', gap: 24 }}>
      {/* HEADER */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          paddingBottom: 24,
          borderBottom: '1px solid var(--tanqe-stone)',
        }}
      >
        <div>
          <p style={eyebrow}>{leiloes.length} LEILÃ•ES Â· {ativos} ATIVOS Â· {contratados} CONTRATADOS</p>
          <h1 style={title}>Meus leilÃµes</h1>
          <p style={subtitle}>Gerencie suas demandas de combustÃ­vel e acompanhe lances em tempo real.</p>
        </div>
        <Link
          href="/posto/novo-leilao"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'var(--tanqe-orange)',
            color: 'var(--tanqe-white)',
            padding: '12px 20px',
            borderRadius: 2,
            fontFamily: 'var(--font-display)',
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            textDecoration: 'none',
          }}
        >
          <Plus size={16} strokeWidth={2.5} />
          Novo leilÃ£o
        </Link>
      </div>

      {/* LIST */}
      {loading ? (
        <div
          style={{
            padding: 80,
            background: 'var(--tanqe-white)',
            border: '1px solid var(--tanqe-stone)',
            borderRadius: 4,
            textAlign: 'center',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: 'var(--tanqe-gray)',
          }}
        >
          Carregandoâ€¦
        </div>
      ) : leiloes.length === 0 ? (
        <div
          style={{
            padding: '80px 32px',
            background: 'var(--tanqe-white)',
            border: '1px solid var(--tanqe-stone)',
            borderRadius: 4,
            textAlign: 'center',
          }}
        >
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 18,
              color: 'var(--tanqe-black)',
              margin: 0,
              marginBottom: 12,
            }}
          >
            Nada por aqui ainda
          </h3>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 300,
              fontSize: 14,
              color: 'var(--tanqe-gray)',
              maxWidth: 400,
              margin: '0 auto 24px',
              lineHeight: 1.6,
            }}
          >
            Publique seu primeiro leilÃ£o e receba lances competitivos de distribuidoras em tempo real.
          </p>
          <Link
            href="/posto/novo-leilao"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'var(--tanqe-orange)',
              color: 'var(--tanqe-white)',
              padding: '12px 24px',
              borderRadius: 2,
              fontFamily: 'var(--font-display)',
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              textDecoration: 'none',
            }}
          >
            <Plus size={16} strokeWidth={2.5} />
            Publicar primeiro leilÃ£o
          </Link>
        </div>
      ) : (
        <div
          style={{
            background: 'var(--tanqe-white)',
            border: '1px solid var(--tanqe-stone)',
            borderRadius: 4,
            overflow: 'hidden',
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontFamily: 'var(--font-body)',
                fontSize: 14,
              }}
            >
              <thead>
                <tr
                  style={{
                    background: 'var(--tanqe-cream)',
                    borderBottom: '1px solid var(--tanqe-stone)',
                  }}
                >
                  {['CombustÃ­vel', 'Volume', 'PreÃ§o teto', 'Status', 'Criado em', ''].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: 'left',
                        padding: '12px 16px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: 11,
                        textTransform: 'uppercase',
                        letterSpacing: '0.12em',
                        color: 'var(--tanqe-gray)',
                        fontWeight: 500,
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leiloes.map((l) => {
                  const s = statusStyle[l.status] || statusStyle.encerrado
                  return (
                    <tr
                      key={l.id}
                      style={{ borderBottom: '1px solid var(--tanqe-stone)' }}
                    >
                      <td style={{ padding: '14px 16px', fontWeight: 500, color: 'var(--tanqe-black)' }}>
                        {l.combustivel}
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--tanqe-gray)' }}>
                        {l.volume?.toLocaleString('pt-BR')} L
                      </td>
                      <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', color: 'var(--tanqe-black)' }}>
                        R$ {l.preco_teto?.toFixed(2)}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span
                          style={{
                            background: s.bg,
                            color: s.color,
                            padding: '4px 10px',
                            borderRadius: 2,
                            fontFamily: 'var(--font-mono)',
                            fontSize: 11,
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                          }}
                        >
                          {s.label}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--tanqe-gray)', fontSize: 13 }}>
                        {l.created_at ? new Date(l.created_at).toLocaleDateString('pt-BR') : 'â€”'}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <Link
                          href={`/posto/leilao/${l.id}`}
                          style={{
                            color: 'var(--tanqe-orange)',
                            fontFamily: 'var(--font-mono)',
                            fontSize: 11,
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            textDecoration: 'none',
                          }}
                        >
                          Ver â†’
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
