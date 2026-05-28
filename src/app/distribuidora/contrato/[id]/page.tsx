'use client'

export const dynamic = 'force-dynamic'

import { use } from 'react'
import Link from 'next/link'
import { Download, FileText, ShieldCheck } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card } from '@/components/ui/Card'
import { Badge, type BadgeVariant } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import {
  getContrato,
  getDist,
  getPosto,
  getNfeByContrato,
  getPagamentoByContrato,
  getPedidoByContrato,
} from '@/lib/mock-data'
import { formatBRL, formatLitros, formatPrecoLitro, formatData, formatDataHora } from '@/lib/format'

const STATUS_VARIANT: Record<string, BadgeVariant> = {
  assinado: 'concluido',
  pendente: 'pendente',
  cancelado: 'cancelado',
}

export default function DistContratoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const contrato = getContrato(id)
  if (!contrato) {
    return <div style={{ padding: 32 }}><Card><p style={{ fontFamily: 'var(--font-body)', color: 'var(--tanqe-gray)' }}>Contrato não encontrado.</p></Card></div>
  }
  const posto = getPosto(contrato.postoId)
  const dist = getDist(contrato.distId)
  const nfe = getNfeByContrato(contrato.id)
  const pagamento = getPagamentoByContrato(contrato.id)
  const pedido = getPedidoByContrato(contrato.id)

  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <Link href="/distribuidora/contratos" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--tanqe-gray)', textDecoration: 'none' }}>← Voltar pra contratos</Link>

      <SectionHeader
        eyebrow={`Contrato ${contrato.numero}`}
        title="Acordo de fornecimento"
        subtitle="Documento vinculante entre sua distribuidora e o posto comprador."
        action={
          <div style={{ display: 'flex', gap: 8 }}>
            <Badge variant={STATUS_VARIANT[contrato.status]}>{contrato.status === 'assinado' ? 'Assinado' : contrato.status === 'pendente' ? 'Pendente' : 'Cancelado'}</Badge>
            <Button variant="secondary" icon={Download} size="sm">Baixar PDF</Button>
          </div>
        }
      />

      <div style={{ background: 'var(--tanqe-white)', border: '1px solid var(--tanqe-stone)', borderRadius: 4, padding: '48px' }}>
        <div style={{ textAlign: 'center', borderBottom: '1px solid var(--tanqe-stone)', paddingBottom: 24, marginBottom: 32 }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--tanqe-gray)', margin: 0 }}>TANQE · Contrato de fornecimento</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, letterSpacing: '-0.02em', margin: '8px 0 4px' }}>{contrato.numero}</h2>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--tanqe-gray)', margin: 0 }}>Hash SHA-256: {contrato.hashContrato.slice(0, 32)}…</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 32, marginBottom: 32 }}>
          <PartieBlock title="Contratada (você)" entity={dist} role="Distribuidora" />
          <PartieBlock title="Contratante" entity={posto} role="Posto" />
        </div>

        <div style={{ marginBottom: 24 }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--tanqe-gray)', margin: 0, marginBottom: 16 }}>1. Objeto</p>
          <div style={{ background: 'var(--tanqe-cream)', padding: 20, borderRadius: 4, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16 }}>
            <KV label="Produto" value={contrato.combustivel} />
            <KV label="Volume" value={formatLitros(contrato.volume)} />
            <KV label="Preço por litro" value={formatPrecoLitro(contrato.precoLitro)} mono />
            <KV label="Receita total" value={formatBRL(contrato.valor)} highlight />
            <KV label="Pagamento" value={contrato.formaPagamento} />
            <KV label="Prazo entrega" value={`${contrato.prazoEntregaDias} dias`} />
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--tanqe-gray)', margin: 0, marginBottom: 16 }}>2. Cláusulas</p>
          <ol style={{ paddingLeft: 24, margin: 0 }}>
            {contrato.clausulas.map((c, i) => (
              <li key={i} style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--tanqe-black)', lineHeight: 1.7, marginBottom: 10 }}>{c}</li>
            ))}
          </ol>
        </div>

        <div style={{ paddingTop: 24, borderTop: '1px solid var(--tanqe-stone)' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--tanqe-gray)', margin: 0, marginBottom: 16 }}>3. Assinaturas digitais</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
            <SignatureBlock title="Distribuidora" entityName={dist?.nome || '—'} signedAt={contrato.assinadoDistEm} />
            <SignatureBlock title="Posto" entityName={posto?.nome || '—'} signedAt={contrato.assinadoPostoEm} />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        {nfe && (
          <Card>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--tanqe-gray)', margin: 0, marginBottom: 6 }}>NF-e emitida</p>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, margin: 0 }}>nº {String(nfe.numero).padStart(6, '0')}</p>
            <Link href="/distribuidora/nfes" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--tanqe-orange)', textDecoration: 'none', display: 'inline-block', marginTop: 8 }}>ver detalhes →</Link>
          </Card>
        )}
        {pagamento && (
          <Card>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--tanqe-gray)', margin: 0, marginBottom: 6 }}>Pagamento</p>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, margin: 0 }}>{pagamento.status === 'pago' ? 'Recebido' : 'A receber'}</p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--tanqe-gray)', margin: '4px 0 0' }}>
              {pagamento.pagoEm ? formatDataHora(pagamento.pagoEm) : `vence ${formatData(pagamento.vencimento)}`}
            </p>
          </Card>
        )}
        {pedido && (
          <Card>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--tanqe-gray)', margin: 0, marginBottom: 6 }}>Entrega</p>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, margin: 0 }}>{pedido.status === 'entregue' ? 'Entregue' : 'Em trânsito'}</p>
            <Link href="/distribuidora/pedidos" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--tanqe-orange)', textDecoration: 'none', display: 'inline-block', marginTop: 8 }}>rastrear →</Link>
          </Card>
        )}
      </div>
    </div>
  )
}

function PartieBlock({ title, entity, role }: { title: string; entity?: { nome: string; razaoSocial: string; cnpj: string; endereco: string; cidade: string; uf: string }; role: string }) {
  return (
    <div>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--tanqe-gray)', margin: 0, marginBottom: 8 }}>{title} · {role}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
        <Avatar name={entity?.nome || '?'} size={36} />
        <div>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, margin: 0 }}>{entity?.nome ?? '—'}</p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--tanqe-gray)', margin: 0 }}>{entity?.razaoSocial ?? '—'}</p>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', rowGap: 6, columnGap: 12, fontFamily: 'var(--font-body)', fontSize: 12 }}>
        <span style={{ color: 'var(--tanqe-gray)' }}>CNPJ</span><span style={{ fontFamily: 'var(--font-mono)' }}>{entity?.cnpj ?? '—'}</span>
        <span style={{ color: 'var(--tanqe-gray)' }}>Endereço</span><span>{entity ? `${entity.endereco} — ${entity.cidade}/${entity.uf}` : '—'}</span>
      </div>
    </div>
  )
}

function SignatureBlock({ title, entityName, signedAt }: { title: string; entityName: string; signedAt?: string }) {
  const isSigned = !!signedAt
  return (
    <div style={{ padding: 18, border: '1px solid var(--tanqe-stone)', borderRadius: 4 }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--tanqe-gray)', margin: 0, marginBottom: 8 }}>{title}</p>
      <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, margin: 0, marginBottom: 12 }}>{entityName}</p>
      {isSigned ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <ShieldCheck size={18} color="var(--tanqe-success)" />
          <div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--tanqe-success)', margin: 0, fontWeight: 600 }}>Assinado digitalmente</p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--tanqe-gray)', margin: 0 }}>{formatDataHora(signedAt!)}</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <FileText size={18} color="var(--tanqe-warning)" />
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--tanqe-warning)', margin: 0, fontWeight: 600 }}>Aguardando assinatura</p>
        </div>
      )}
    </div>
  )
}

function KV({ label, value, mono, highlight }: { label: string; value: string; mono?: boolean; highlight?: boolean }) {
  return (
    <div>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--tanqe-gray)', margin: 0, marginBottom: 4 }}>{label}</p>
      <p style={{ fontFamily: mono ? 'var(--font-mono)' : 'var(--font-body)', fontSize: 14, fontWeight: 600, color: highlight ? 'var(--tanqe-orange)' : 'var(--tanqe-black)', margin: 0 }}>{value}</p>
    </div>
  )
}
