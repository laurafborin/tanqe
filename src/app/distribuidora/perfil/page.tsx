'use client'

export const dynamic = 'force-dynamic'

import { useMemo } from 'react'
import { MapPin, Phone, Mail, Building2, Calendar, Award, Trophy, Sparkles, Crown, Truck } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { Badge, type BadgeVariant } from '@/components/ui/Badge'
import {
  DIST_LOGADA_ID,
  CERTIFICACOES_DIST,
  CONQUISTAS_DIST,
  AVALIACOES_DESTAQUE_DIST,
  contratosByDist,
  avaliacoesRecebidasPorDist,
  getDist,
  getPosto,
  completudeCadastro,
} from '@/lib/mock-data'
import { formatBRL, formatLitros, formatData, timeAgo } from '@/lib/format'

const CERT_VARIANT: Record<string, BadgeVariant> = {
  ativa: 'concluido',
  pendente: 'pendente',
  vencida: 'cancelado',
}

export default function PerfilDistPage() {
  const dist = getDist(DIST_LOGADA_ID)!
  const completude = completudeCadastro(dist)
  const contratos = useMemo(() => contratosByDist(DIST_LOGADA_ID), [])
  const avaliacoes = useMemo(
    () => [...AVALIACOES_DESTAQUE_DIST, ...avaliacoesRecebidasPorDist(DIST_LOGADA_ID)],
    [],
  )
  const receitaTotal = contratos.reduce((s, c) => s + c.valor, 0)
  const volumeTotal = contratos.reduce((s, c) => s + c.volume, 0)
  const postosClientes = new Set(contratos.map((c) => c.postoId)).size

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
        eyebrow="Cadastro · Reputação · Cobertura"
        title="Perfil da distribuidora"
        subtitle="Tudo que os postos enxergam antes de aceitar seus lances. Mantenha em dia pra fechar mais negócios."
      />

      {/* Header */}
      <div style={{ background: 'var(--tanqe-charcoal)', borderRadius: 4, padding: 32, color: 'var(--tanqe-white)', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden style={{ position: 'absolute', right: -100, top: -100, width: 360, height: 360, background: 'radial-gradient(circle, rgba(232,88,26,0.18) 0%, transparent 70%)' }} />
        <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'auto minmax(0, 1fr) auto', gap: 24, alignItems: 'center' }} className="perfil-header">
          <Avatar name={dist.nome} size={72} square />
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--gradient-orange)', color: 'var(--tanqe-white)', padding: '5px 12px', borderRadius: 2, fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.18em', fontWeight: 600 }}>
                <Crown size={11} strokeWidth={2.4} /> TANQE Premium
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--tanqe-orange)', wordBreak: 'break-word' }}>
                Distribuidora · CNPJ {dist.cnpj}
              </span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(22px, 3vw, 32px)', letterSpacing: '-0.02em', margin: 0, wordBreak: 'break-word', lineHeight: 1.1 }}>{dist.nome}</h2>
            <p style={{ fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: 14, color: 'var(--tanqe-gray-light)', margin: '6px 0 0', wordBreak: 'break-word', lineHeight: 1.5 }}>
              {dist.razaoSocial}
            </p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--tanqe-gray)', margin: '10px 0 0' }}>
              Atuação · {dist.basesAtendidas.join(' · ')}
            </p>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 56, color: 'var(--tanqe-orange)', lineHeight: 1, letterSpacing: '-0.04em' }}>
              {dist.score.toFixed(1)}<span style={{ fontSize: 28 }}>★</span>
            </div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--tanqe-gray)', margin: 0, marginTop: 4 }}>
              {avaliacoes.length} avaliações · {dist.totalOperacoes} operações
            </p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--tanqe-orange)', margin: '8px 0 0' }}>
              Top 5 Grande SP
            </p>
          </div>
        </div>
      </div>

      {/* Conquistas */}
      <Card title="Conquistas e reconhecimentos" eyebrow="Selo operacional" action={<Trophy size={18} color="var(--tanqe-orange)" />}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
          {CONQUISTAS_DIST.map((c) => (
            <div
              key={c.id}
              style={{
                display: 'grid',
                gridTemplateColumns: 'auto minmax(0, 1fr)',
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
              <div style={{ minWidth: 0 }}>
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: 'var(--tanqe-black)', margin: 0, wordBreak: 'break-word', lineHeight: 1.3 }}>{c.titulo}</p>
                <p style={{ fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: 12, color: 'var(--tanqe-gray)', margin: '4px 0 0', lineHeight: 1.5, wordBreak: 'break-word' }}>{c.detalhe}</p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: c.destaque ? 'var(--tanqe-orange-deep)' : 'var(--tanqe-gray-light)', margin: '8px 0 0' }}>
                  {c.emissor} · {formatData(c.data)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Completude */}
      <Card title="Completude do cadastro" eyebrow="Postos confiam mais em quem está 100%">
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }} className="completude-wrap">
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 56, color: 'var(--tanqe-orange)', lineHeight: 1, letterSpacing: '-0.04em', flexShrink: 0 }}>
            {completude}<span style={{ fontSize: 28 }}>%</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ height: 8, background: 'var(--tanqe-stone)', borderRadius: 4, overflow: 'hidden', marginBottom: 12 }}>
              <div style={{ width: `${completude}%`, height: '100%', background: 'var(--gradient-orange)' }} />
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--tanqe-gray)', margin: 0, lineHeight: 1.6 }}>
              Postos confiam mais em distribuidoras com cadastro completo e certificações ativas.
            </p>
          </div>
        </div>
      </Card>

      {/* Cards cadastrais */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
        <Card title="Razão social e documentos" eyebrow="Dados jurídicos">
          <div style={{ display: 'grid', gridTemplateColumns: 'auto minmax(0, 1fr)', rowGap: 12, columnGap: 16, fontFamily: 'var(--font-body)', fontSize: 14, alignItems: 'baseline' }}>
            <KV label="Razão social" value={dist.razaoSocial} />
            <KV label="Nome fantasia" value={dist.nome} />
            <KV label="CNPJ" value={dist.cnpj} mono />
            <KV label="Inscrição estadual" value={dist.inscricaoEstadual} mono />
          </div>
        </Card>

        <Card title="Endereço e contato" eyebrow="Sede comercial">
          <div style={{ display: 'grid', gridTemplateColumns: 'auto minmax(0, 1fr)', rowGap: 12, columnGap: 16, fontFamily: 'var(--font-body)', fontSize: 14, alignItems: 'baseline' }}>
            <KV icon={<MapPin size={14} color="var(--tanqe-gray)" />} label="Endereço" value={dist.endereco} />
            <KV icon={<Building2 size={14} color="var(--tanqe-gray)" />} label="Cidade/UF" value={`${dist.cidade}/${dist.uf}`} />
            <KV icon={<Phone size={14} color="var(--tanqe-gray)" />} label="Telefone" value={dist.telefone} mono />
            <KV icon={<Mail size={14} color="var(--tanqe-gray)" />} label="E-mail" value={dist.email} />
          </div>
        </Card>

        <Card title="Logística e operação" eyebrow="Capacidade">
          <div style={{ display: 'grid', gridTemplateColumns: 'auto minmax(0, 1fr)', rowGap: 12, columnGap: 16, fontFamily: 'var(--font-body)', fontSize: 14, alignItems: 'baseline' }}>
            <KV icon={<Truck size={14} color="var(--tanqe-gray)" />} label="Bases atendidas" value={dist.basesAtendidas.join(', ')} />
            <KV label="Capacidade diária" value={formatLitros(dist.capacidadeLogistica) + '/dia'} />
            <KV label="Volume mensal" value={formatLitros(dist.volumeMensal)} />
            <KV label="Tempo médio entrega" value={`${dist.tempoMedioEntrega}h`} />
            <KV label="Combustíveis" value={dist.combustiveis.join(', ')} />
            <KV label="Postos atendidos" value={`${postosClientes}`} />
            <KV label="Receita total" value={formatBRL(receitaTotal)} />
            <KV label="Volume entregue" value={formatLitros(volumeTotal)} />
          </div>
        </Card>
      </div>

      {/* Score breakdown */}
      <Card title="Score por critério" eyebrow="Como os postos te avaliam">
        <div style={{ display: 'grid', gap: 18 }}>
          {[
            { nome: 'Pontualidade', valor: breakdown.pontualidade },
            { nome: 'Qualidade do produto', valor: breakdown.qualidade },
            { nome: 'Comunicação comercial', valor: breakdown.comunicacao },
          ].map((b) => {
            const pct = (b.valor / 5) * 100
            return (
              <div key={b.nome} style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, 1fr) minmax(120px, 2fr) auto', gap: 16, alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500 }}>{b.nome}</span>
                <div style={{ height: 8, background: 'var(--tanqe-stone)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: 'var(--gradient-orange)' }} />
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--tanqe-orange)', textAlign: 'right', whiteSpace: 'nowrap' }}>
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
          {CERTIFICACOES_DIST.map((c) => (
            <div key={c.id} style={{ padding: 16, border: '1px solid var(--tanqe-stone)', borderRadius: 4, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, gap: 10 }}>
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: 'var(--tanqe-black)', margin: 0, wordBreak: 'break-word', lineHeight: 1.3, minWidth: 0 }}>{c.nome}</p>
                <Badge variant={CERT_VARIANT[c.status]}>{c.status === 'ativa' ? 'Ativa' : c.status === 'pendente' ? 'Renovar' : 'Vencida'}</Badge>
              </div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--tanqe-gray)', margin: 0, wordBreak: 'break-word' }}>{c.emissor}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--tanqe-gray)', flexWrap: 'wrap', gap: 6 }}>
                <span style={{ wordBreak: 'break-all' }}>nº {c.numero}</span>
                <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center', whiteSpace: 'nowrap' }}>
                  <Calendar size={11} /> vence {formatData(c.vencimentoIso)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Avaliações */}
      <Card title="Avaliações recebidas dos postos" eyebrow={`${avaliacoes.length} avaliações verificadas`}>
        {avaliacoes.length === 0 ? (
          <p style={{ color: 'var(--tanqe-gray)', textAlign: 'center', padding: 24 }}>Nenhuma avaliação ainda.</p>
        ) : (
          <div style={{ display: 'grid', gap: 12 }}>
            {avaliacoes.slice(0, 8).map((a) => {
              const posto = getPosto(a.avaliadorId)
              const nome = posto?.nome || 'Posto parceiro'
              return (
                <div key={a.id} style={{ display: 'flex', gap: 12, padding: 16, border: '1px solid var(--tanqe-stone)', borderRadius: 4, minWidth: 0 }}>
                  <Avatar name={nome} size={40} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, wordBreak: 'break-word' }}>{nome}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--tanqe-orange)', fontSize: 13 }}>{'★'.repeat(a.nota)}{'☆'.repeat(5 - a.nota)}</span>
                      {posto?.cidade && (
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--tanqe-gray)' }}>
                          {posto.cidade}/{posto.uf}
                        </span>
                      )}
                    </div>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--tanqe-black)', margin: 0, lineHeight: 1.6, wordBreak: 'break-word' }}>&ldquo;{a.comentario}&rdquo;</p>
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
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--tanqe-gray)', fontSize: 13, fontFamily: 'var(--font-body)', whiteSpace: 'nowrap', alignSelf: 'start', paddingTop: 1 }}>
        {icon}
        {label}
      </span>
      <span style={{ fontFamily: mono ? 'var(--font-mono)' : 'var(--font-body)', fontWeight: 500, color: 'var(--tanqe-black)', minWidth: 0, wordBreak: 'break-word', overflowWrap: 'anywhere', lineHeight: 1.5 }}>{value}</span>
    </>
  )
}
