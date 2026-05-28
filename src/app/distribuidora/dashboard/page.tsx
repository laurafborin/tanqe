'use client'


export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import dynamicImport from 'next/dynamic'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const MapView = dynamicImport(() => import('@/components/map/MapView'), {
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
      Carregando mapaâ€¦
    </div>
  ),
})

// MOCK DATA
const MOCK_USER = {
  distLabel: 'DISTRIBUIDORA Â· BASE GUARULHOS/SP',
  greeting: 'Bom dia, BR Petro SP.',
  subtitle: 'VocÃª tem 14 oportunidades abertas e 6 entregas pra hoje.',
}

const MOCK_METRICS = [
  { label: 'RECEITA ESTE MÃŠS', value: 'R$ 2.847.000', trend: { sign: 'pos' as const, text: '+9,2%' }, subtitle: 'vs. mÃªs anterior' },
  { label: 'VOLUME ENTREGUE', value: '487.000 L', trend: { sign: 'pos' as const, text: '+14,5%' }, subtitle: 'vs. mÃªs anterior' },
  { label: 'OPORTUNIDADES ATIVAS', value: '14', trend: null, subtitle: 'Em 6 estados' },
  { label: 'TAXA DE CONVERSÃƒO', value: '64%', trend: null, subtitle: 'Lances vencidos / lances dados' },
]

const MOCK_OPORTUNIDADES = [
  { id: 'lei_001', combustivel: 'GASOLINA C', volume: 30000, cidade: 'SÃ£o Paulo, SP', precoAtual: 5.61, encerraEmHoras: 14, encerraEmMin: 32, lancesCount: 3 },
  { id: 'lei_002', combustivel: 'DIESEL S10', volume: 25000, cidade: 'SÃ£o Paulo, SP', precoAtual: 5.78, encerraEmHoras: 6, encerraEmMin: 18, lancesCount: 5 },
  { id: 'lei_003', combustivel: 'ETANOL', volume: 12000, cidade: 'Campinas, SP', precoAtual: 3.62, encerraEmHoras: 22, encerraEmMin: 11, lancesCount: 2 },
]

const MOCK_ANP_DATA = Array.from({ length: 10 }, (_, i) => ({
  dia: `D-${9 - i}`,
  gasolina: 5.78 + Math.sin(i) * 0.08,
  etanol: 3.92 + Math.cos(i) * 0.06,
  diesel: 5.91 + Math.sin(i * 0.7) * 0.07,
}))

const MOCK_POSTOS = [
  { id: 'pst_1', label: 'Posto Sol Nascente SP', lat: -23.55, lng: -46.63, score: 4.7, subtitle: 'SÃ£o Paulo - capital' },
  { id: 'pst_2', label: 'Posto Auto Norte SP', lat: -23.42, lng: -46.69, score: 4.5, subtitle: 'Zona Norte SP' },
  { id: 'pst_3', label: 'Posto Via Dutra RJ', lat: -22.91, lng: -43.30, score: 4.4, subtitle: 'Rio de Janeiro' },
  { id: 'pst_4', label: 'Posto Central Campinas', lat: -22.91, lng: -47.06, score: 4.8, subtitle: 'Campinas' },
  { id: 'pst_5', label: 'Posto BR Sorocaba', lat: -23.51, lng: -47.46, score: 4.6, subtitle: 'Sorocaba' },
  { id: 'pst_6', label: 'Posto Galo ABC', lat: -23.67, lng: -46.50, score: 4.3, subtitle: 'Santo AndrÃ©' },
  { id: 'pst_7', label: 'Posto Estrada Guarulhos', lat: -23.46, lng: -46.55, score: 4.5, subtitle: 'Guarulhos' },
  { id: 'pst_8', label: 'Posto Diadema Sul', lat: -23.69, lng: -46.62, score: 4.4, subtitle: 'Diadema' },
]

const MOCK_ENTREGAS_HOJE = [
  { id: 'ent_a', status: 'em_transito' as const, item: 'Diesel S10 Â· 25.000 L', destino: 'Posto Sol Nascente SP', eta: 'ETA 13:30' },
  { id: 'ent_b', status: 'aguardando' as const, item: 'Gasolina C Â· 18.000 L', destino: 'Posto Auto Norte SP', eta: 'SaÃ­da 14:00' },
  { id: 'ent_c', status: 'em_transito' as const, item: 'Etanol Â· 12.000 L', destino: 'Posto Central Campinas', eta: 'ETA 15:45' },
  { id: 'ent_d', status: 'aguardando' as const, item: 'Diesel S500 Â· 30.000 L', destino: 'Posto BR Sorocaba', eta: 'SaÃ­da 16:30' },
]

const STATUS_COLOR: Record<string, string> = {
  em_transito: 'var(--tanqe-orange)',
  entregue: 'var(--tanqe-success)',
  atrasado: 'var(--tanqe-danger)',
  aguardando: 'var(--tanqe-gray)',
}

const card = { background: 'var(--tanqe-white)', border: '1px solid var(--tanqe-stone)', borderRadius: 4, padding: 24 }
const cardTitle = { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--tanqe-black)', margin: 0, letterSpacing: '-0.01em' } as const
const eyebrow = { fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase' as const, letterSpacing: '0.15em', color: 'var(--tanqe-gray)', margin: 0 }
const sectionLink = { fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: 'var(--tanqe-orange)', textDecoration: 'none' }

export default function DistDashboard() {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 250); return () => clearTimeout(t) }, [])

  return (
    <div style={{ display: 'grid', gap: 24 }}>
      {/* HEADER */}
      <div style={{ paddingBottom: 24, borderBottom: '1px solid var(--tanqe-stone)' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--tanqe-orange)', margin: 0, marginBottom: 12 }}>
          {MOCK_USER.distLabel}
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(32px, 4vw, 44px)', color: 'var(--tanqe-black)', letterSpacing: '-0.02em', lineHeight: 1.1, margin: 0 }}>
          {MOCK_USER.greeting}
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: 16, color: 'var(--tanqe-gray)', marginTop: 8, marginBottom: 0 }}>
          {MOCK_USER.subtitle}
        </p>
      </div>

      {/* METRICS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
        {MOCK_METRICS.map((m) => (
          <div key={m.label} style={card}>
            <p style={{ ...eyebrow, marginBottom: 12 }}>{m.label}</p>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 32, color: 'var(--tanqe-black)', letterSpacing: '-0.02em', lineHeight: 1 }}>
              {m.value}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
              {m.trend && (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, padding: '2px 8px', borderRadius: 2, background: 'var(--tanqe-orange-pale)', color: 'var(--tanqe-orange-deep)' }}>
                  {m.trend.text}
                </span>
              )}
              <span style={{ fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: 12, color: 'var(--tanqe-gray)' }}>{m.subtitle}</span>
            </div>
          </div>
        ))}
      </div>

      {/* LINHA 3: OPORTUNIDADES + ANP */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: 24 }} className="dash-row-3">
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={cardTitle}>Oportunidades em destaque</h3>
            <Link href="/distribuidora/leiloes" style={sectionLink}>Ver todas â†’</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {MOCK_OPORTUNIDADES.map((l) => (
              <div key={l.id} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 24, alignItems: 'center', padding: 20, border: '1px solid var(--tanqe-stone)', borderRadius: 4 }}>
                <span style={{ background: 'var(--tanqe-orange-pale)', color: 'var(--tanqe-orange-deep)', padding: '6px 10px', borderRadius: 2, fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  {l.combustivel}
                </span>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--tanqe-black)' }}>
                    {l.volume.toLocaleString('pt-BR')} L Â· {l.cidade}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6, fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: 12, color: 'var(--tanqe-gray)' }}>
                    <span>Atual</span>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--tanqe-orange)' }}>R$ {l.precoAtual.toFixed(2)}/L</span>
                    <span>Â· {l.lancesCount} {l.lancesCount === 1 ? 'lance' : 'lances'}</span>
                  </div>
                  <div style={{ marginTop: 8, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--tanqe-gray)' }}>
                    Encerra em {l.encerraEmHoras}h {l.encerraEmMin}m
                  </div>
                </div>
                <Link
                  href={`/distribuidora/leilao/${l.id}`}
                  style={{
                    background: 'var(--tanqe-orange)',
                    color: 'var(--tanqe-white)',
                    padding: '10px 18px',
                    borderRadius: 2,
                    fontFamily: 'var(--font-display)',
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                  }}
                >
                  Dar lance
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={cardTitle}>PreÃ§o mÃ©dio ANP</h3>
            <span style={eyebrow}>ÃšLTIMOS 10 DIAS</span>
          </div>
          <div style={{ height: 240, opacity: loaded ? 1 : 0, transition: 'opacity 0.3s' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MOCK_ANP_DATA} margin={{ top: 4, right: 0, left: -8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--tanqe-stone)" />
                <XAxis dataKey="dia" tick={{ fontFamily: 'var(--font-mono)', fontSize: 10, fill: 'var(--tanqe-gray)' }} axisLine={{ stroke: 'var(--tanqe-stone)' }} tickLine={false} />
                <YAxis domain={['dataMin - 0.1', 'dataMax + 0.1']} tick={{ fontFamily: 'var(--font-mono)', fontSize: 10, fill: 'var(--tanqe-gray)' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `R$ ${v.toFixed(2)}`} width={56} />
                <Tooltip contentStyle={{ background: 'var(--tanqe-charcoal)', border: 'none', borderRadius: 3, color: '#FFFFFF', fontFamily: 'var(--font-mono)', fontSize: 11 }} labelStyle={{ color: '#FFFFFF' }} formatter={(v) => `R$ ${Number(v).toFixed(2)}/L`} />
                <Line type="monotone" dataKey="gasolina" stroke="#E8581A" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="etanol" stroke="#F9C9AE" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="diesel" stroke="#0F0F0E" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 12, fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--tanqe-gray)' }}>
            {[{ color: '#E8581A', label: 'GASOLINA' }, { color: '#F9C9AE', label: 'ETANOL' }, { color: '#0F0F0E', label: 'DIESEL' }].map((it) => (
              <div key={it.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 10, height: 10, background: it.color, display: 'inline-block' }} />
                {it.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* LINHA 4: MAPA POSTOS + ENTREGAS HOJE */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 7fr) minmax(0, 5fr)', gap: 24 }} className="dash-row-4">
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={cardTitle}>Postos cadastrados</h3>
            <span style={eyebrow}>8 POSTOS</span>
          </div>
          <MapView center={[-23.55, -46.63]} zoom={9} markers={MOCK_POSTOS} />
        </div>

        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <h3 style={cardTitle}>Entregas de hoje</h3>
            <Link href="/distribuidora/contratos" style={sectionLink}>Ver todas â†’</Link>
          </div>
          <div>
            {MOCK_ENTREGAS_HOJE.map((e, idx) => (
              <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 0', borderBottom: idx === MOCK_ENTREGAS_HOJE.length - 1 ? 'none' : '1px solid var(--tanqe-stone)' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: STATUS_COLOR[e.status], flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: 'var(--tanqe-black)' }}>{e.item}</div>
                  <div style={{ fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: 12, color: 'var(--tanqe-gray)', marginTop: 2 }}>{e.destino} Â· {e.eta}</div>
                </div>
                <button
                  style={{
                    background: 'transparent',
                    color: 'var(--tanqe-orange)',
                    border: '1px solid var(--tanqe-orange)',
                    padding: '6px 12px',
                    borderRadius: 2,
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    cursor: 'pointer',
                  }}
                >
                  Atualizar
                </button>
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
