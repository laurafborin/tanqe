'use client'

export const dynamic = 'force-dynamic'

import { useMemo } from 'react'
import { ShieldCheck, FileText, CircleCheck } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card } from '@/components/ui/Card'
import { StatCard } from '@/components/ui/StatCard'
import { DataTable, type DataTableColumn } from '@/components/ui/DataTable'
import { Avatar } from '@/components/ui/Avatar'
import {
  contratosByPosto,
  EVENTOS_AUDITORIA_POSTO,
  POSTO_LOGADO_ID,
  ANP_30D,
  type Contrato,
} from '@/lib/mock-data'
import { formatBRL, formatLitros, formatPrecoLitro, formatPctRaw, formatDataHora } from '@/lib/format'

const ANP_MAP: Record<string, number> = {
  'Gasolina Comum': 5.78,
  'Gasolina Aditivada': 5.98,
  'Etanol Hidratado': 3.91,
  'Diesel S-10': 5.91,
  'Diesel S-500': 5.74,
}

interface AuditoriaRow extends Contrato {
  refAnp: number
  economiaPorLitro: number
  economiaTotal: number
  desconto: number
}

export default function AuditoriaPage() {
  const contratos = useMemo(
    () => contratosByPosto(POSTO_LOGADO_ID).filter((c) => c.status === 'assinado'),
    [],
  )

  const linhas: AuditoriaRow[] = contratos.map((c) => {
    const refAnp = ANP_MAP[c.combustivel] ?? c.precoLitro
    const economiaPorLitro = refAnp - c.precoLitro
    const economiaTotal = economiaPorLitro * c.volume
    const desconto = (economiaPorLitro / refAnp) * 100
    return { ...c, refAnp, economiaPorLitro, economiaTotal, desconto }
  })

  const totalEconomia = linhas.reduce((s, r) => s + r.economiaTotal, 0)
  const totalVolume = linhas.reduce((s, r) => s + r.volume, 0)
  const descontoMedio = linhas.length > 0 ? linhas.reduce((s, r) => s + r.desconto * r.volume, 0) / totalVolume : 0
  const totalContratos = linhas.length

  const eventos = EVENTOS_AUDITORIA_POSTO.slice(0, 12)

  const cols: DataTableColumn<AuditoriaRow>[] = [
    { key: 'numero', label: 'Contrato', render: (r) => <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>{r.numero}</span> },
    { key: 'combustivel', label: 'Combustível' },
    { key: 'volume', label: 'Volume', align: 'right', render: (r) => formatLitros(r.volume) },
    { key: 'preco', label: 'Pago/L', align: 'right', render: (r) => <span style={{ fontFamily: 'var(--font-mono)' }}>{formatPrecoLitro(r.precoLitro)}</span> },
    { key: 'refAnp', label: 'Ref. ANP', align: 'right', render: (r) => <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--tanqe-gray)' }}>{formatPrecoLitro(r.refAnp)}</span> },
    {
      key: 'desconto',
      label: 'Desconto',
      align: 'right',
      render: (r) => (
        <span style={{ fontFamily: 'var(--font-mono)', color: r.desconto >= 0 ? 'var(--tanqe-success)' : 'var(--tanqe-danger)', fontWeight: 600 }}>
          {formatPctRaw(r.desconto, 1, true)}
        </span>
      ),
    },
    {
      key: 'economia',
      label: 'Economia (R$)',
      align: 'right',
      render: (r) => (
        <span style={{ fontFamily: 'var(--font-mono)', color: r.economiaTotal >= 0 ? 'var(--tanqe-success)' : 'var(--tanqe-danger)', fontWeight: 600 }}>
          {formatBRL(r.economiaTotal)}
        </span>
      ),
    },
  ]

  return (
    <div style={{ display: 'grid', gap: 32 }}>
      <SectionHeader
        eyebrow="Compliance + Transparência"
        title="Auditoria de operações"
        subtitle="Cada contrato comparado ao preço médio ANP do combustível. Eventos imutáveis com hash criptográfico — pronto pra fiscal, contábil ou banca."
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
        <StatCard label="Economia total vs ANP" value={formatBRL(totalEconomia)} delta={formatPctRaw(descontoMedio, 1, true)} sublabel="ponderado por volume" />
        <StatCard label="Volume auditado" value={formatLitros(totalVolume)} sublabel={`em ${totalContratos} contratos`} />
        <StatCard label="Desconto médio" value={formatPctRaw(descontoMedio, 1, true)} sublabel="vs. preço médio ANP" />
        <StatCard label="Eventos rastreados" value={EVENTOS_AUDITORIA_POSTO.length} sublabel="imutáveis com hash" />
      </div>

      <Card title="Detalhamento por contrato" eyebrow="Cada linha é uma operação fechada" padding={0}>
        <DataTable
          columns={cols}
          rows={linhas}
          rowKey={(r) => r.id}
          emptyMessage="Nenhum contrato auditável ainda."
        />
      </Card>

      {/* Timeline de eventos */}
      <Card title="Trilha de eventos imutável" eyebrow="Auditoria fiscal e jurídica" action={<span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--tanqe-gray)' }}>SHA-256</span>}>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: 18, top: 6, bottom: 6, width: 1, background: 'var(--tanqe-stone)' }} />
          {eventos.map((e) => (
            <div key={e.id} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 14, alignItems: 'flex-start', padding: '12px 0', position: 'relative' }}>
              <div style={{ width: 36, display: 'flex', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--tanqe-orange-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {e.acao.includes('Contrato gerado') ? <FileText size={14} color="var(--tanqe-orange-deep)" /> : e.acao.includes('assinado pelo posto') ? <Avatar name="P" size={20} /> : <CircleCheck size={14} color="var(--tanqe-success)" />}
                </div>
              </div>
              <div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500, color: 'var(--tanqe-black)', margin: 0 }}>{e.acao}</p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--tanqe-gray)', margin: 0, marginTop: 2 }}>{e.ator} · {e.referencia}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--tanqe-gray)', margin: 0 }}>{formatDataHora(e.quandoIso)}</p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--tanqe-gray-light)', margin: 0, marginTop: 2 }}>hash: {e.hash}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Como calculamos a economia" eyebrow="Metodologia">
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <ShieldCheck size={20} color="var(--tanqe-orange)" />
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--tanqe-gray)', lineHeight: 1.7, margin: 0 }}>
            Para cada contrato fechado, comparamos o preço pago por litro à referência ANP de distribuição do combustível.
            A economia é a diferença multiplicada pelo volume. O desconto médio é ponderado pelo volume de cada operação.
            Última atualização da referência ANP: <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--tanqe-black)' }}>{ANP_30D[ANP_30D.length - 1].dia}</span>.
          </p>
        </div>
      </Card>
    </div>
  )
}
