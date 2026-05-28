'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { ChevronRight } from 'lucide-react'

const MapView = dynamic(() => import('@/components/map/MapView'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: 320,
        background: 'var(--tanqe-stone)',
        borderRadius: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: 'var(--tanqe-gray)',
      }}
    >
      Carregando mapa…
    </div>
  ),
})

// ============================================
// MOCK DATA
// ============================================

const MOCK_USER = {
  postoLabel: 'POSTO BR-001 · SÃO PAULO/SP',
  greeting: 'Bom dia, Posto Sol Nascente.',
  subtitle: 'Você tem 2 leilões abertos e 3 entregas em andamento.',
}

const MOCK_METRICS = [
  { label: 'ECONOMIA ESTE MÊS', value: 'R$ 12.847', trend: { sign: 'pos' as const, text: '+18,3%' }, subtitle: 'vs. preço médio ANP' },
  { label: 'VOLUME NEGOCIADO', value: '84.500 L', trend: { sign: 'pos' as const, text: '+12,0%' }, subtitle: 'vs. mês anterior' },
  { label: 'LEILÕES ATIVOS', value: '2', trend: null, subtitle: 'Encerram em até 24h' },
  { label: 'SCORE DO POSTO', value: '4.8', star: true, trend: null, subtitle: '12 avaliações' },
]

const MOCK_LEILOES_ATIVOS = [
  { id: 'lei_001', combustivel: 'GASOLINA C', volume: 30000, cidade: 'São Paulo, SP', precoRef: 5.82, precoAtual: 5.61, encerraEmHoras: 14, encerraEmMin: 32, progress: 70, lances: 3 },
  { id: 'lei_002', combustivel: 'DIESEL S10', volume: 25000, cidade: 'São Paulo, SP', precoRef: 5.94, precoAtual: 5.78, encerraEmHoras: 6, encerraEmMin: 18, progress: 85, lances: 5 },
]

const MOCK_ANP_DATA = Array.from({ length: 10 }, (_, i) => ({
  dia: `D-${9 - i}`,
  gasolina: 5.78 + Math.sin(i) * 0.08,
  etanol: 3.92 + Math.cos(i) * 0.06,
  diesel: 5.91 + Math.sin(i * 0.7) * 0.07,
}))

const MOCK_DISTRIBUIDORAS = [
  { id: 'dst_1', label: 'BR Petro SP', lat: -23.55, lng: -46.63, score: 4.8, subtitle: 'Grande SP' },
  { id: 'dst_2', label: 'Ipiranga RJ', lat: -22.91, lng: -43.21, score: 4.6, subtitle: 'Rio de Janeiro' },
  { id: 'dst_3', label: 'Raízen Campinas', lat: -22.91, lng: -47.06, score: 4.9, subtitle: 'Interior SP' },
  { id: 'dst_4', label: 'Shell Sorocaba', lat: -23.50, lng: -47.46, score: 4.4, subtitle: 'Sorocaba e região' },
  { id: 'dst_5', label: 'Petrobras Distr. SP', lat: -23.42, lng: -46.74, score: 4.7, subtitle: 'Capital' },
  { id: 'dst_6', label: 'Vibra ABC', lat: -23.66, lng: -46.53, score: 4.5, subtitle: 'ABC Paulista' },
  { id: 'dst_7', label: 'Atem Guarulhos', lat: -23.46, lng: -46.53, score: 4.3, subtitle: 'Guarulhos' },
  { id: 'dst_8', label: 'CIA Brasileira Diadema', lat: -23.69, lng: -46.62, score: 4.6, subtitle: 'Diadema' },
]

const MOCK_ENTREGAS = [
  { id: 'ent_1', status: 'em_transito' as const, item: 'Diesel S10 · 25.000 L', dist: 'BR Petro SP', when: 'há 2h' },
  { id: 'ent_2', status: 'entregue' as const, item: 'Gasolina C · 18.000 L', dist: 'Raízen Campinas', when: 'há 6h' },
  { id: 'ent_3', status: 'em_transito' as const, item: 'Etanol · 12.000 L', dist: 'Ipiranga RJ', when: 'há 8h' },
  { id: 'ent_4', status: 'entregue' as const, item: 'Diesel S500 · 30.000 L', dist: 'Vibra ABC', when: 'ontem' },
]

const STATUS_COLOR: Record<string, string> = {
  em_transito: 'var(--tanqe-orange)',
  entregue: 'var(--tanqe-success)',
  atrasado: 'var(--tanqe-danger)',
  aguardando: 'var(--tanqe-gray)',
}

// ============================================
// STYLES
// ============================================

const card = {
  background: 'var(--tanqe-white)',
  border: '1px solid var(--tanqe-stone)',
  borderRadius: 4,
  padding: 24,
}

const cardTitle = {
  fontFamily: 'var(--font-display)',
  fontWeight: 700,
  fontSize: 16,
  color: 'var(--tanqe-black)',
  margin: 0,
  letterSpacing: '-0.01em',
}

const eyebrow = {
  fontFamily: 'var(--font-mono)',
  fontSize: 10,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.15em',
  color: 'var(--tanqe-gray)',
  margin: 0,
}

const sectionLink = {
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.12em',
  color: 'var(--tanqe-orange)',
  textDecoration: 'none',
}

// ============================================
// COMPONENT
// ============================================

export default function PostoDashboard() {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 250)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{ display: 'grid', gap: 24 }}>
      {/* HEADER */}
      <div style={{ paddingBottom: 24, borderBottom: '1px solid var(--tanqe-stone)' }}>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            color: 'var(--tanqe-orange)',
            margin: 0,
            marginBottom: 12,
          }}
        >
          {MOCK_USER.postoLabel}
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 'clamp(32px, 4vw, 44px)',
            color: 'var(--tanqe-black)',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            margin: 0,
          }}
        >
          {MOCK_USER.greeting}
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 300,
            fontSize: 16,
            color: 'var(--tanqe-gray)',
            marginTop: 8,
            marginBottom: 0,
          }}
        >
          {MOCK_USER.subtitle}
        </p>
      </div>

      {/* METRICS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 24,
        }}
      >
        {MOCK_METRICS.map((m) => (
          <div key={m.label} style={card}>
            <p style={{ ...eyebrow, marginBottom: 12 }}>{m.label}</p>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 32,
                color: 'var(--tanqe-black)',
                letterSpacing: '-0.02em',
                lineHeight: 1,
              }}
            >
              {m.value}
              {m.star && <span style={{ color: 'var(--tanqe-orange)', marginLeft: 6 }}>★</span>}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
              {m.trend && (
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    padding: '2px 8px',
                    borderRadius: 2,
                    background: m.trend.sign === 'pos' ? 'var(--tanqe-orange-pale)' : '#FFE5E5',
                    color: m.trend.sign === 'pos' ? 'var(--tanqe-orange-deep)' : '#C23F06',
                  }}
                >
                  {m.trend.text}
                </span>
              )}
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontWeight: 300,
                  fontSize: 12,
                  color: 'var(--tanqe-gray)',
                }}
              >
                {m.subtitle}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* LINHA 3: LEILÕES + ANP */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)',
          gap: 24,
        }}
        className="dash-row-3"
      >
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={cardTitle}>Leilões em andamento</h3>
            <Link href="/posto/leiloes" style={sectionLink}>Ver todos →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {MOCK_LEILOES_ATIVOS.map((l) => (
              <Link
                key={l.id}
                href={`/posto/leilao/${l.id}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr auto',
                  gap: 24,
                  alignItems: 'center',
                  padding: 20,
                  border: '1px solid var(--tanqe-stone)',
                  borderRadius: 4,
                  textDecoration: 'none',
                  transition: 'border-color 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--tanqe-orange)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--tanqe-stone)')}
              >
                <span
                  style={{
                    background: 'var(--tanqe-orange-pale)',
                    color: 'var(--tanqe-orange-deep)',
                    padding: '6px 10px',
                    borderRadius: 2,
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  }}
                >
                  {l.combustivel}
                </span>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--tanqe-black)' }}>
                    {l.volume.toLocaleString('pt-BR')} L · {l.cidade}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      marginTop: 6,
                      fontFamily: 'var(--font-body)',
                      fontWeight: 300,
                      fontSize: 12,
                      color: 'var(--tanqe-gray)',
                    }}
                  >
                    <span style={{ textDecoration: 'line-through' }}>R$ {l.precoRef.toFixed(2)}/L</span>
                    <span>→</span>
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 700,
                        fontSize: 18,
                        color: 'var(--tanqe-orange)',
                      }}
                    >
                      R$ {l.precoAtual.toFixed(2)}/L
                    </span>
                  </div>
                  <div
                    style={{
                      marginTop: 10,
                      height: 3,
                      background: 'var(--tanqe-stone)',
                      borderRadius: 2,
                      overflow: 'hidden',
                    }}
                  >
                    <div style={{ width: `${l.progress}%`, height: '100%', background: 'var(--tanqe-orange)' }} />
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--tanqe-black)' }}>
                    {l.encerraEmHoras}h {l.encerraEmMin}m
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      textTransform: 'uppercase',
                      letterSpacing: '0.12em',
                      color: 'var(--tanqe-gray)',
                      marginTop: 4,
                    }}
                  >
                    {l.lances} LANCES
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={cardTitle}>Preço médio ANP</h3>
            <span style={eyebrow}>ÚLTIMOS 10 DIAS</span>
          </div>
          <div style={{ height: 240, opacity: loaded ? 1 : 0, transition: 'opacity 0.3s' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MOCK_ANP_DATA} margin={{ top: 4, right: 0, left: -8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--tanqe-stone)" />
                <XAxis
                  dataKey="dia"
                  tick={{ fontFamily: 'var(--font-mono)', fontSize: 10, fill: 'var(--tanqe-gray)' }}
                  axisLine={{ stroke: 'var(--tanqe-stone)' }}
                  tickLine={false}
                />
                <YAxis
                  domain={['dataMin - 0.1', 'dataMax + 0.1']}
                  tick={{ fontFamily: 'var(--font-mono)', fontSize: 10, fill: 'var(--tanqe-gray)' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) => `R$ ${v.toFixed(2)}`}
                  width={56}
                />
                <Tooltip
                  contentStyle={{
                    background: 'var(--tanqe-charcoal)',
                    border: 'none',
                    borderRadius: 3,
                    color: '#FFFFFF',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                  }}
                  labelStyle={{ color: '#FFFFFF' }}
                  formatter={(v) => `R$ ${Number(v).toFixed(2)}/L`}
                />
                <Line type="monotone" dataKey="gasolina" stroke="#E8581A" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="etanol" stroke="#F9C9AE" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="diesel" stroke="#0F0F0E" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div
            style={{
              display: 'flex',
              gap: 16,
              marginTop: 12,
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--tanqe-gray)',
            }}
          >
            {[
              { color: '#E8581A', label: 'GASOLINA' },
              { color: '#F9C9AE', label: 'ETANOL' },
              { color: '#0F0F0E', label: 'DIESEL' },
            ].map((it) => (
              <div key={it.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 10, height: 10, background: it.color, display: 'inline-block' }} />
                {it.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* LINHA 4: MAPA + ENTREGAS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 7fr) minmax(0, 5fr)',
          gap: 24,
        }}
        className="dash-row-4"
      >
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={cardTitle}>Distribuidoras próximas</h3>
            <span style={eyebrow}>8 PARCEIRAS</span>
          </div>
          <MapView center={[-23.55, -46.63]} zoom={9} markers={MOCK_DISTRIBUIDORAS} />
        </div>

        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <h3 style={cardTitle}>Últimas entregas</h3>
            <Link href="/posto/contratos" style={sectionLink}>Ver todas →</Link>
          </div>
          <div>
            {MOCK_ENTREGAS.map((e, idx) => (
              <div
                key={e.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: '14px 0',
                  borderBottom: idx === MOCK_ENTREGAS.length - 1 ? 'none' : '1px solid var(--tanqe-stone)',
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: STATUS_COLOR[e.status],
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: 'var(--tanqe-black)' }}>
                    {e.item}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontWeight: 300,
                      fontSize: 12,
                      color: 'var(--tanqe-gray)',
                      marginTop: 2,
                    }}
                  >
                    {e.dist} · {e.when}
                  </div>
                </div>
                <ChevronRight size={14} color="var(--tanqe-gray)" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1023px) {
          .dash-row-3, .dash-row-4 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
