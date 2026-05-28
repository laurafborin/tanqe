'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useMemo, useState } from 'react'
import { MapPin, Phone, Mail, Building2, Calendar, User2, Award, Trophy, Sparkles, Crown } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { Badge, type BadgeVariant } from '@/components/ui/Badge'
import {
  POSTO_LOGADO_ID,
  CERTIFICACOES_POSTO,
  CONQUISTAS_POSTO,
  AVALIACOES_DESTAQUE_POSTO,
  contratosByPosto,
  avaliacoesRecebidasPorPosto,
  getPosto,
  getDist,
  completudeCadastro,
} from '@/lib/mock-data'
import { formatBRL, formatLitros, formatData, timeAgo } from '@/lib/format'
import { getNome } from '@/lib/auth'

const CERT_VARIANT: Record<string, BadgeVariant> = {
  ativa: 'concluido',
  pendente: 'pendente',
  vencida: 'cancelado',
}

export default function PerfilPostoPage() {
  const posto = getPosto(POSTO_LOGADO_ID)!
  const completude = completudeCadastro(posto)
  const contratos = useMemo(() => contratosByPosto(POSTO_LOGADO_ID), [])
  const avaliacoes = useMemo(
    () => [...AVALIACOES_DESTAQUE_POSTO, ...avaliacoesRecebidasPorPosto(POSTO_LOGADO_ID)],
    [],
  )
  const valorTotalNegociado = contratos.reduce((s, c) => s + c.valor, 0)
  const volumeTotalNegociado = contratos.reduce((s, c) => s + c.volume, 0)
  const distribuidorasParceiras = new Set(contratos.map((c) => c.distId)).size
  const [displayName, setDisplayName] = useState(posto.nome)
  const [responsavel, setResponsavel] = useState(posto.responsavel)
  useEffect(() => {
    const stored = getNome()
    if (stored && stored.includes('·')) {
      const [resp, nome] = stored.split('·').map((s) => s.trim())
      setResponsavel(resp || posto.responsavel)
      setDisplayName(nome || posto.nome)
    } else if (stored) {
      setResponsavel(stored)
    }
  }, [posto.nome, posto.responsavel])

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
          <Avatar name={displayName} size={72} square />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: 'var(--gradient-orange)',
                  color: 'var(--tanqe-white)',
                  padding: '5px 12px',
                  borderRadius: 2,
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  textTransform: 'uppercase',
                  letterSpacing: '0.18em',
                  fontWeight: 600,
                }}
              >
                <Crown size={11} strokeWidth={2.4} /> TANQE Premium
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--tanqe-orange)' }}>
                {posto.bandeira} · CNPJ {posto.cnpj}
              </span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 32, letterSpacing: '-0.02em', margin: 0 }}>{displayName}</h2>
            <p style={{ fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: 14, color: 'var(--tanqe-gray-light)', margin: '6px 0 0' }}>
              {posto.razaoSocial}
            </p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--tanqe-gray)', margin: '10px 0 0' }}>
              Gestão · {responsavel}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 56, color: 'var(--tanqe-orange)', lineHeight: 1, letterSpacing: '-0.04em' }}>
              {posto.score.toFixed(1)}<span style={{ fontSize: 28 }}>★</span>
            </div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--tanqe-gray)', margin: 0, marginTop: 4 }}>
              {avaliacoes.length} avaliações · {posto.totalOperacoes} operações
            </p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--tanqe-orange)', margin: '8px 0 0' }}>
              Top 3% Grande SP
            </p>
          </div>
        </div>
      </div>

      {/* Conquistas e reconhecimentos */}
      <Card title="Conquistas e reconhecimentos" eyebrow="Selo de excelência operacional" action={<Trophy size={18} color="var(--tanqe-orange)" />}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
          {CONQUISTAS_POSTO.map((c) => (
            <div
              key={c.id}
              style={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr',
                gap: 14,
                padding: 16,
                borderRadius: 4,
                border: c.destaque ? '1px solid var(--tanqe-orange)' : '1px solid var(--tanqe-stone)',
                background: c.destaque ? 'var(--tanqe-orange-pale)' : 'var(--tanqe-white)',
              }}
            >
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: c.destaque ? 'var(--tanqe-orange)' : 'var(--tanqe-stone)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {c.destaque ? <Sparkles size={16} color="#FFFFFF" /> : <Award size={16} color="var(--tanqe-gray)" />}
              </div>
              <div>
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: 'var(--tanqe-black)', margin: 0 }}>{c.titulo}</p>
                <p style={{ fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: 12, color: 'var(--tanqe-gray)', margin: '4px 0 0', lineHeight: 1.5 }}>{c.detalhe}</p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: c.destaque ? 'var(--tanqe-orange-deep)' : 'var(--tanqe-gray-light)', margin: '8px 0 0' }}>
                  {c.emissor} · {formatData(c.data)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

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
      <Card title="Avaliações recebidas das distribuidoras" eyebrow={`${avaliacoes.length} avaliações verificadas`}>
        {avaliacoes.length === 0 ? (
          <p style={{ color: 'var(--tanqe-gray)', textAlign: 'center', padding: 24 }}>Nenhuma avaliação recebida ainda.</p>
        ) : (
          <div style={{ display: 'grid', gap: 12 }}>
            {avaliacoes.slice(0, 8).map((a) => {
              const dist = getDist(a.avaliadorId)
              const nome = dist?.nome || 'Distribuidora parceira'
              return (
                <div key={a.id} style={{ display: 'flex', gap: 12, padding: 16, border: '1px solid var(--tanqe-stone)', borderRadius: 4 }}>
                  <Avatar name={nome} size={40} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14 }}>{nome}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--tanqe-orange)', fontSize: 13 }}>{'★'.repeat(a.nota)}{'☆'.repeat(5 - a.nota)}</span>
                      {dist?.cidade && (
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--tanqe-gray)' }}>
                          {dist.cidade}/{dist.uf}
                        </span>
                      )}
                    </div>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--tanqe-black)', margin: 0, lineHeight: 1.6 }}>&ldquo;{a.comentario}&rdquo;</p>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--tanqe-gray-light)', margin: 0, marginTop: 8 }}>
                      {timeAgo(a.criadoEm)}
                    </p>
                  </div>
                </div>
              )
            })}
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
