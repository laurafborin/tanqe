'use client'

export const dynamic = 'force-dynamic'

import { useMemo } from 'react'
import { MapPin, Phone, Mail, Building2, Calendar, User2, Award, CircleCheck, AlertTriangle } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { Badge, type BadgeVariant } from '@/components/ui/Badge'
import {
  POSTO_LOGADO_ID,
  CERTIFICACOES_POSTO,
  contratosByPosto,
  avaliacoesRecebidasPorPosto,
  getPosto,
  completudeCadastro,
} from '@/lib/mock-data'
import { formatBRL, formatLitros, formatData, timeAgo } from '@/lib/format'

const CERT_VARIANT: Record<string, BadgeVariant> = {
  ativa: 'concluido',
  pendente: 'pendente',
  vencida: 'cancelado',
}

export default function PerfilPostoPage() {
  const posto = getPosto(POSTO_LOGADO_ID)!
  const completude = completudeCadastro(posto)
  const contratos = useMemo(() => contratosByPosto(POSTO_LOGADO_ID), [])
  const avaliacoes = useMemo(() => avaliacoesRecebidasPorPosto(POSTO_LOGADO_ID), [])
  const valorTotalNegociado = contratos.reduce((s, c) => s + c.valor, 0)
  const volumeTotalNegociado = contratos.reduce((s, c) => s + c.volume, 0)
  const distribuidorasParceiras = new Set(contratos.map((c) => c.distId)).size

  // score breakdown
  const breakdown = useMemo(() => {
    if (avaliacoes.length === 0) return { pontualidade: 0, qualidade: 0, comunicacao: 0 }
    const sum = avaliacoes.reduce(
      (acc, a) => ({
        pontualidade: acc.pontualidade + a.criterios.pontualidade,
        qualidade: acc.qualidade + a.criterios.qualidade,
        comunicacao: acc.comunicacao + a.criterios.comunicacao,
      }),
      { pontualidade: 0, qualidade: 0, comunicacao: 0 },
    )
    return {
      pontualidade: sum.pontualidade / avaliacoes.length,
      qualidade: sum.qualidade / avaliacoes.length,
      comunicacao: sum.comunicacao / avaliacoes.length,
    }
  }, [avaliacoes])

  return (
    <div style={{ display: 'grid', gap: 32 }}>
      <SectionHeader
        eyebrow="Cadastro · Reputação · Certificações"
        title="Perfil do posto"
        subtitle="Tudo que distribuidoras enxergam sobre você antes de dar um lance. Mantenha em dia pra atrair os melhores preços."
      />

      {/* Header card */}
      <div style={{ background: 'var(--tanqe-charcoal)', borderRadius: 4, padding: 32, color: 'var(--tanqe-white)', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden style={{ position: 'absolute', right: -100, top: -100, width: 360, height: 360, background: 'radial-gradient(circle, rgba(232,88,26,0.18) 0%, transparent 70%)' }} />
        <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 24, alignItems: 'center' }} className="perfil-header">
          <Avatar name={posto.nome} size={72} square />
          <div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--tanqe-orange)', margin: 0, marginBottom: 8 }}>
              {posto.bandeira} · CNPJ {posto.cnpj}
            </p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 32, letterSpacing: '-0.02em', margin: 0 }}>{posto.nome}</h2>
            <p style={{ fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: 14, color: 'var(--tanqe-gray-light)', margin: 0, marginTop: 6 }}>
              {posto.razaoSocial}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 56, color: 'var(--tanqe-orange)', lineHeight: 1, letterSpacing: '-0.04em' }}>
              {posto.score.toFixed(1)}<span style={{ fontSize: 28 }}>★</span>
            </div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--tanqe-gray)', margin: 0, marginTop: 4 }}>
              {avaliacoes.length} avaliações · {posto.totalOperacoes} operações
            </p>
          </div>
        </div>
      </div>

      {/* Completude de cadastro */}
      <Card title="Completude do cadastro" eyebrow="Mantenha 100% para receber lances ótimos">
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }} className="completude-wrap">
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 56, color: 'var(--tanqe-orange)', lineHeight: 1, letterSpacing: '-0.04em' }}>
            {completude}<span style={{ fontSize: 28 }}>%</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ height: 8, background: 'var(--tanqe-stone)', borderRadius: 4, overflow: 'hidden', marginBottom: 12 }}>
              <div style={{ width: `${completude}%`, height: '100%', background: 'var(--gradient-orange)', transition: 'width var(--dur-slow) var(--ease-out)' }} />
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--tanqe-gray)', margin: 0, lineHeight: 1.6 }}>
              {completude >= 100
                ? 'Seu cadastro está completo. Distribuidoras enxergam todas as informações para lances precificados.'
                : 'Complete os campos faltantes para melhorar o ranking dos seus leilões e atrair lances mais competitivos.'}
            </p>
          </div>
        </div>
      </Card>

      {/* Dados cadastrais */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
        <Card title="Razão social e documentos" eyebrow="Dados jurídicos">
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', rowGap: 12, columnGap: 16, fontFamily: 'var(--font-body)', fontSize: 14 }}>
            <KV label="Razão social" value={posto.razaoSocial} />
            <KV label="Nome fantasia" value={posto.nome} />
            <KV label="CNPJ" value={posto.cnpj} mono />
            <KV label="Inscrição estadual" value={posto.inscricaoEstadual} mono />
            <KV label="Bandeira" value={posto.bandeira} />
            <KV label="Cadastrado em" value={formatData(posto.criadoEm)} />
          </div>
        </Card>

        <Card title="Endereço e contato" eyebrow="Onde a gente te encontra">
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', rowGap: 12, columnGap: 16, fontFamily: 'var(--font-body)', fontSize: 14 }}>
            <KV icon={<MapPin size={14} color="var(--tanqe-gray)" />} label="Endereço" value={posto.endereco} />
            <KV icon={<Building2 size={14} color="var(--tanqe-gray)" />} label="Cidade/UF" value={`${posto.cidade}/${posto.uf}`} />
            <KV label="CEP" value={posto.cep} mono />
            <KV icon={<Phone size={14} color="var(--tanqe-gray)" />} label="Telefone" value={posto.telefone} mono />
            <KV icon={<Mail size={14} color="var(--tanqe-gray)" />} label="E-mail" value={posto.email} />
            <KV icon={<User2 size={14} color="var(--tanqe-gray)" />} label="Responsável" value={posto.responsavel} />
          </div>
        </Card>

        <Card title="Operação" eyebrow="Capacidade e atuação">
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', rowGap: 12, columnGap: 16, fontFamily: 'var(--font-body)', fontSize: 14 }}>
            <KV label="Volume mensal" value={formatLitros(posto.volumeMensal)} />
            <KV label="Capacidade tanque" value={formatLitros(posto.capacidadeTanque)} />
            <KV label="Combustíveis" value={posto.combustiveis.join(', ')} />
            <KV label="Distribuidoras parceiras" value={`${distribuidorasParceiras}`} />
            <KV label="Volume total negociado" value={formatLitros(volumeTotalNegociado)} />
            <KV label="Valor total negociado" value={formatBRL(valorTotalNegociado)} />
          </div>
        </Card>
      </div>

      {/* Score breakdown */}
      <Card title="Score por critério" eyebrow="Como as distribuidoras te avaliam">
        <div style={{ display: 'grid', gap: 18 }}>
          {[
            { nome: 'Pontualidade', valor: breakdown.pontualidade },
            { nome: 'Qualidade da operação', valor: breakdown.qualidade },
            { nome: 'Comunicação', valor: breakdown.comunicacao },
          ].map((b) => {
            const pct = (b.valor / 5) * 100
            return (
              <div key={b.nome} style={{ display: 'grid', gridTemplateColumns: '160px 1fr 64px', gap: 16, alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500 }}>{b.nome}</span>
                <div style={{ height: 8, background: 'var(--tanqe-stone)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: 'var(--gradient-orange)' }} />
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--tanqe-orange)', textAlign: 'right' }}>
                  {b.valor.toFixed(1)} / 5
                </span>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Certificações */}
      <Card title="Certificações e licenças" eyebrow="Compliance regulatório" action={<Award size={18} color="var(--tanqe-orange)" />}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {CERTIFICACOES_POSTO.map((c) => (
            <div key={c.id} style={{ padding: 16, border: '1px solid var(--tanqe-stone)', borderRadius: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: 'var(--tanqe-black)', margin: 0 }}>{c.nome}</p>
                <Badge variant={CERT_VARIANT[c.status]}>{c.status === 'ativa' ? 'Ativa' : c.status === 'pendente' ? 'Renovar' : 'Vencida'}</Badge>
              </div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--tanqe-gray)', margin: 0 }}>{c.emissor}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--tanqe-gray)' }}>
                <span>nº {c.numero}</span>
                <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                  <Calendar size={11} /> vence {formatData(c.vencimentoIso)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Histórico avaliações */}
      <Card title="Avaliações recebidas" eyebrow={`${avaliacoes.length} avaliações totais`}>
        {avaliacoes.length === 0 ? (
          <p style={{ color: 'var(--tanqe-gray)', textAlign: 'center', padding: 24 }}>Nenhuma avaliação recebida ainda.</p>
        ) : (
          <div style={{ display: 'grid', gap: 12 }}>
            {avaliacoes.slice(0, 6).map((a) => (
              <div key={a.id} style={{ display: 'flex', gap: 12, padding: 14, border: '1px solid var(--tanqe-stone)', borderRadius: 4 }}>
                <Avatar name={`D ${a.avaliadorId}`} size={36} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14 }}>Distribuidora #{a.avaliadorId.slice(-3)}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--tanqe-orange)', fontSize: 12 }}>{'★'.repeat(a.nota)}{'☆'.repeat(5 - a.nota)}</span>
                  </div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--tanqe-gray)', margin: 0, lineHeight: 1.5 }}>{a.comentario}</p>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--tanqe-gray-light)', margin: 0, marginTop: 6 }}>
                    {timeAgo(a.criadoEm)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <style>{`@media (max-width: 700px) { .perfil-header { grid-template-columns: 1fr !important; text-align: center; } .completude-wrap { flex-direction: column; align-items: stretch; gap: 12px; } }`}</style>
    </div>
  )
}

function KV({ icon, label, value, mono }: { icon?: React.ReactNode; label: string; value: string; mono?: boolean }) {
  return (
    <>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--tanqe-gray)', fontSize: 13, fontFamily: 'var(--font-body)' }}>
        {icon}
        {label}
      </span>
      <span style={{ fontFamily: mono ? 'var(--font-mono)' : 'var(--font-body)', fontWeight: 500, color: 'var(--tanqe-black)' }}>{value}</span>
    </>
  )
}
