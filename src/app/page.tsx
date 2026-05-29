import Link from 'next/link'
import { Logo } from '@/components/ui/Logo'

const navLink = {
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.1em',
  color: 'var(--tanqe-gray-light)',
  textDecoration: 'none',
}

const eyebrow = {
  display: 'inline-block',
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.2em',
  color: 'var(--tanqe-orange)',
  border: '1px solid rgba(232, 88, 26, 0.3)',
  padding: '6px 16px',
  borderRadius: 2,
}

const ctaPrimary = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  background: 'var(--tanqe-orange)',
  color: 'var(--tanqe-white)',
  padding: '15px 26px',
  borderRadius: 2,
  fontFamily: 'var(--font-display)',
  fontSize: 13,
  fontWeight: 700,
  letterSpacing: '0.04em',
  textDecoration: 'none',
  textTransform: 'uppercase' as const,
}

const ctaSecondary = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  background: 'transparent',
  color: 'var(--tanqe-orange)',
  padding: '14px 26px',
  borderRadius: 2,
  fontFamily: 'var(--font-display)',
  fontSize: 13,
  fontWeight: 700,
  letterSpacing: '0.04em',
  textDecoration: 'none',
  textTransform: 'uppercase' as const,
  border: '1px solid var(--tanqe-orange)',
}

const PARCEIROS = [
  'BR PETRO',
  'RAÍZEN',
  'IPIRANGA',
  'SHELL',
  'VIBRA',
  'PETROBRAS DISTRIBUIDORA',
  'ATEM',
]

export default function LandingPage() {
  return (
    <div style={{ background: 'var(--tanqe-cream)', overflow: 'hidden' }}>
      {/* NAV */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 60,
          padding: '0 32px',
          background: 'rgba(15, 15, 14, 0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 50,
          borderBottom: '1px solid rgba(255,255,255,0.04)',
        }}
      >
        <Link href="/" aria-label="TANQE" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <Logo variant="dark" size="sm" />
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <a href="#problema" style={navLink} className="nav-anchor">Problema</a>
          <a href="#funciona" style={navLink} className="nav-anchor">Como funciona</a>
          <a href="#economia" style={navLink} className="nav-anchor">Economia</a>
          <Link
            href="/login"
            style={{
              background: 'var(--tanqe-orange)',
              color: 'var(--tanqe-white)',
              padding: '9px 20px',
              borderRadius: 2,
              fontFamily: 'var(--font-display)',
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.06em',
              textDecoration: 'none',
              textTransform: 'uppercase',
            }}
          >
            Entrar
          </Link>
        </div>
        <style>{`
          .nav-anchor:hover { color: var(--tanqe-white) !important; }
          @media (max-width: 720px) { .nav-anchor { display: none; } }
        `}</style>
      </nav>

      {/* HERO */}
      <section
        style={{
          minHeight: '94vh',
          background: 'var(--tanqe-black)',
          position: 'relative',
          overflow: 'hidden',
          paddingTop: 60,
        }}
      >
        {/* mesh gradient */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            background: 'var(--gradient-mesh)',
          }}
        />
        {/* grid sutil */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(232, 88, 26, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(232, 88, 26, 0.05) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div
          style={{
            position: 'relative',
            maxWidth: 1160,
            margin: '0 auto',
            padding: '90px 32px 60px',
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr)',
            gap: 60,
          }}
        >
          <div style={{ maxWidth: 720 }}>
            <div style={{ ...eyebrow, marginBottom: 28 }}>
              Marketplace B2B · Leilão reverso de combustíveis
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-sora), Sora, sans-serif',
                fontSize: 'clamp(48px, 7vw, 92px)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: 0.98,
                margin: 0,
                color: 'var(--tanqe-cream)',
              }}
            >
              O posto independente
              <br />
              agora <span style={{ color: 'var(--tanqe-orange)' }}>dita o preço.</span>
            </h1>

            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 300,
                fontSize: 18,
                color: 'var(--tanqe-gray-light)',
                maxWidth: 600,
                lineHeight: 1.55,
                marginTop: 28,
              }}
            >
              Em vez de cotar com três distribuidoras por telefone, o gestor publica a demanda no TANQE e recebe lances competitivos em tempo real. Anônimos, cronometrados, comparáveis. O melhor preço vence.
            </p>

            <div
              style={{
                display: 'flex',
                gap: 12,
                marginTop: 36,
                flexWrap: 'wrap',
              }}
            >
              <Link href="/login" style={ctaPrimary}>
                Sou posto →
              </Link>
              <Link href="/login" style={ctaSecondary}>
                Sou distribuidora →
              </Link>
            </div>

            <div
              style={{
                marginTop: 40,
                display: 'flex',
                gap: 32,
                flexWrap: 'wrap',
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
              }}
            >
              <Metric value="−11,8%" label="custo médio do litro" />
              <Metric value="8 min" label="até o primeiro lance" />
              <Metric value="142" label="postos ativos hoje" />
            </div>
          </div>

          {/* Preview de produto (mockup do dashboard) */}
          <div
            style={{
              position: 'relative',
              transform: 'perspective(1200px) rotateX(2deg)',
              transformOrigin: 'center top',
            }}
            className="hero-preview"
          >
            <div
              aria-hidden
              style={{
                position: 'absolute',
                inset: -20,
                background: 'radial-gradient(ellipse at center, rgba(232,88,26,0.25) 0%, transparent 70%)',
                filter: 'blur(40px)',
                zIndex: 0,
              }}
            />
            <div
              style={{
                position: 'relative',
                background: 'var(--tanqe-charcoal)',
                border: '1px solid rgba(232, 88, 26, 0.18)',
                borderRadius: 6,
                padding: 18,
                boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
                zIndex: 1,
              }}
            >
              <DashMockup />
            </div>
          </div>
        </div>
      </section>

      {/* CONFIANÇA — distribuidoras conectadas */}
      <section
        style={{
          background: 'var(--tanqe-black)',
          padding: '40px 32px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: '0.25em',
              color: 'var(--tanqe-gray)',
              marginBottom: 18,
              textAlign: 'center',
            }}
          >
            Distribuidoras conectadas
          </p>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 24,
              flexWrap: 'wrap',
            }}
          >
            {PARCEIROS.map((p) => (
              <span
                key={p}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: 16,
                  letterSpacing: '0.04em',
                  color: 'rgba(196, 194, 187, 0.55)',
                }}
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* PROBLEMA */}
      <section id="problema" style={{ background: 'var(--tanqe-cream)', padding: '110px 32px' }}>
        <div
          style={{
            maxWidth: 1160,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1fr)',
            gap: 80,
            alignItems: 'start',
          }}
          className="grid-2"
        >
          <div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                textTransform: 'uppercase',
                letterSpacing: '0.22em',
                color: 'var(--tanqe-orange)',
                marginBottom: 18,
              }}
            >
              01 — O que ninguém ataca
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-sora), Sora, sans-serif',
                fontSize: 'clamp(30px, 4.5vw, 48px)',
                fontWeight: 800,
                letterSpacing: '-0.025em',
                lineHeight: 1.05,
                color: 'var(--tanqe-black)',
                margin: 0,
                marginBottom: 22,
              }}
            >
              40% dos postos do Brasil compram combustível no escuro.
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 300,
                fontSize: 17,
                color: 'var(--tanqe-slate)',
                lineHeight: 1.65,
                margin: 0,
                marginBottom: 24,
                maxWidth: 520,
              }}
            >
              São 17 mil postos bandeira branca cotando pelo WhatsApp com duas, três distribuidoras conhecidas. Sem histórico, sem benchmark, sem barganha. Aceitam o menos ruim e tocam o dia.
            </p>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 300,
                fontSize: 17,
                color: 'var(--tanqe-slate)',
                lineHeight: 1.65,
                margin: 0,
                maxWidth: 520,
              }}
            >
              Enquanto isso, redes grandes negociam contratos plurianuais com inteligência de mercado, escala e poder de barganha. O independente fica com a margem espremida — e a culpa do gestor por &ldquo;não fechar mais barato&rdquo;.
            </p>
          </div>

          <div
            style={{
              background: 'var(--tanqe-charcoal)',
              padding: 36,
              borderRadius: 4,
              color: 'var(--tanqe-white)',
              position: 'relative',
            }}
          >
            <div
              aria-hidden
              style={{
                position: 'absolute',
                top: 18,
                left: 28,
                fontFamily: 'var(--font-display)',
                fontSize: 80,
                fontWeight: 800,
                color: 'var(--tanqe-orange)',
                opacity: 0.18,
                lineHeight: 1,
              }}
            >
              &ldquo;
            </div>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 300,
                fontSize: 18,
                lineHeight: 1.6,
                color: 'var(--tanqe-cream)',
                margin: '24px 0 0',
                position: 'relative',
              }}
            >
              Eu ligava pra três distribuidoras de manhã. A primeira mandava o preço, eu repassava pras outras duas e elas davam um pouquinho a menos. Sempre acabava aceitando a do contato pessoal. Nunca soube se tinha alguém na região cobrando 10 centavos mais barato.
            </p>
            <div
              style={{
                marginTop: 28,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'var(--tanqe-orange)',
                  color: 'var(--tanqe-white)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: 14,
                  flexShrink: 0,
                }}
              >
                JM
              </div>
              <div>
                <p
                  style={{
                    margin: 0,
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: 14,
                    color: 'var(--tanqe-white)',
                  }}
                >
                  João Mendes
                </p>
                <p
                  style={{
                    margin: 0,
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    color: 'var(--tanqe-gray-light)',
                  }}
                >
                  Posto Sol Nascente · São Paulo
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="funciona" style={{ background: 'var(--tanqe-black)', padding: '110px 32px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              textTransform: 'uppercase',
              letterSpacing: '0.22em',
              color: 'var(--tanqe-orange)',
              marginBottom: 18,
            }}
          >
            02 — Como uma negociação acontece
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-sora), Sora, sans-serif',
              fontSize: 'clamp(30px, 4.5vw, 48px)',
              fontWeight: 800,
              letterSpacing: '-0.025em',
              lineHeight: 1.05,
              color: 'var(--tanqe-cream)',
              margin: 0,
              marginBottom: 56,
              maxWidth: 760,
            }}
          >
            Quatro passos. Sem telefone, sem planilha, sem &ldquo;avisa que eu cubro&rdquo;.
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 20,
            }}
          >
            <Step
              n="01"
              t="Publique a demanda"
              b="Combustível, volume, modalidade (entrega ou retirada), pagamento. 30 segundos."
            />
            <Step
              n="02"
              t="Receba lances anônimos"
              b="BR Petro respondeu em 4 min. Raízen, em 7. Ipiranga, em 11. Você só vê os preços — identidade só ao final."
            />
            <Step
              n="03"
              t="Aceite o melhor"
              b="Clica e fecha. Contrato gerado, NF-e emitida, pagamento agendado. Sem ligação confirmando."
            />
            <Step
              n="04"
              t="Rastreie até o tanque"
              b="Placa, motorista, ETA, mapa ao vivo. Cubagem confirmada. Comprovante no histórico."
            />
          </div>
        </div>
      </section>

      {/* ECONOMIA */}
      <section id="economia" style={{ background: 'var(--tanqe-cream)', padding: '110px 32px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.2fr)',
              gap: 64,
              alignItems: 'center',
            }}
            className="grid-2"
          >
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  textTransform: 'uppercase',
                  letterSpacing: '0.22em',
                  color: 'var(--tanqe-orange)',
                  marginBottom: 18,
                }}
              >
                03 — Economia no caixa, não na apresentação
              </div>
              <h2
                style={{
                  fontFamily: 'var(--font-sora), Sora, sans-serif',
                  fontSize: 'clamp(30px, 4.5vw, 48px)',
                  fontWeight: 800,
                  letterSpacing: '-0.025em',
                  lineHeight: 1.05,
                  color: 'var(--tanqe-black)',
                  margin: 0,
                  marginBottom: 22,
                }}
              >
                R$ 12.847 a menos no mês.
                <br />
                R$ 154 mil ao ano.
              </h2>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontWeight: 300,
                  fontSize: 17,
                  color: 'var(--tanqe-slate)',
                  lineHeight: 1.65,
                  margin: 0,
                  maxWidth: 480,
                }}
              >
                O Posto Sol Nascente, em São Paulo, fechou maio negociando 84.500 litros via TANQE. O preço médio ficou 18,3% abaixo da referência ANP de distribuição.
                <br />
                <br />
                Não é projeção. É a margem que ficou no caixa em vez de virar lucro de outra empresa.
              </p>
            </div>

            <div
              style={{
                background: 'var(--tanqe-white)',
                border: '1px solid var(--tanqe-stone)',
                borderRadius: 4,
                padding: 32,
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  textTransform: 'uppercase',
                  letterSpacing: '0.22em',
                  color: 'var(--tanqe-gray)',
                  margin: 0,
                  marginBottom: 24,
                }}
              >
                Economia mensal acumulada (R$ mil)
              </p>
              <EconomiaChart />
              <div
                style={{
                  marginTop: 20,
                  paddingTop: 20,
                  borderTop: '1px solid var(--tanqe-stone)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 16,
                  flexWrap: 'wrap',
                }}
              >
                <Stat label="Volume / mês" value="84.500 L" />
                <Stat label="Desconto vs ANP" value="−18,3%" />
                <Stat label="No caixa / ano" value="R$ 154,2k" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section
        style={{
          background: 'var(--gradient-orange)',
          padding: '90px 32px',
          textAlign: 'center',
          color: 'var(--tanqe-white)',
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-sora), Sora, sans-serif',
            fontSize: 'clamp(32px, 5vw, 56px)',
            fontWeight: 800,
            letterSpacing: '-0.025em',
            lineHeight: 1.05,
            margin: 0,
            marginBottom: 16,
            maxWidth: 760,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          Pronto para inverter o jogo?
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 300,
            fontSize: 16,
            margin: 0,
            marginBottom: 36,
            opacity: 0.9,
          }}
        >
          Cadastro em 5 minutos. Primeiro leilão hoje mesmo.
        </p>
        <Link
          href="/login"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'var(--tanqe-white)',
            color: 'var(--tanqe-orange-deep)',
            padding: '16px 30px',
            borderRadius: 2,
            fontFamily: 'var(--font-display)',
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: '0.04em',
            textDecoration: 'none',
            textTransform: 'uppercase',
          }}
        >
          Acessar plataforma →
        </Link>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          background: 'var(--tanqe-black)',
          padding: '40px 32px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div
          style={{
            maxWidth: 1160,
            margin: '0 auto',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 18,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Logo variant="dark" size="md" />
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
              color: 'var(--tanqe-gray)',
              margin: 0,
            }}
          >
            © 2026 TANQE · Marketplace B2B de combustíveis
          </p>
        </div>
      </footer>

      <style>{`
        @media (max-width: 900px) {
          .grid-2 { grid-template-columns: 1fr !important; gap: 40px !important; }
          .hero-preview { transform: none !important; }
        }
      `}</style>
    </div>
  )
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div
        style={{
          fontFamily: 'var(--font-sora), Sora, sans-serif',
          fontSize: 22,
          fontWeight: 700,
          color: 'var(--tanqe-orange)',
          letterSpacing: '-0.02em',
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          color: 'var(--tanqe-gray)',
          marginTop: 4,
        }}
      >
        {label}
      </div>
    </div>
  )
}

function Step({ n, t, b }: { n: string; t: string; b: string }) {
  return (
    <div
      style={{
        background: 'var(--tanqe-charcoal)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 4,
        padding: '28px 22px',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-sora), Sora, sans-serif',
          fontSize: 44,
          fontWeight: 800,
          color: 'var(--tanqe-orange-mid)',
          lineHeight: 1,
          letterSpacing: '-0.02em',
          marginBottom: 18,
        }}
      >
        {n}
      </div>
      <h3
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 16,
          color: 'var(--tanqe-cream)',
          margin: 0,
          marginBottom: 10,
          letterSpacing: '-0.01em',
        }}
      >
        {t}
      </h3>
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontWeight: 300,
          fontSize: 13,
          color: 'var(--tanqe-gray-light)',
          lineHeight: 1.6,
          margin: 0,
        }}
      >
        {b}
      </p>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          textTransform: 'uppercase',
          letterSpacing: '0.18em',
          color: 'var(--tanqe-gray)',
          margin: 0,
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontFamily: 'var(--font-sora), Sora, sans-serif',
          fontSize: 18,
          fontWeight: 700,
          color: 'var(--tanqe-orange)',
          margin: '4px 0 0',
          letterSpacing: '-0.02em',
        }}
      >
        {value}
      </p>
    </div>
  )
}

function EconomiaChart() {
  const data = [4.2, 5.8, 7.1, 6.4, 8.9, 9.5, 8.2, 10.4, 11.1, 9.7, 12.0, 12.8]
  const meses = ['Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai']
  const max = Math.max(...data)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 140 }}>
      {data.map((v, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <div
            style={{
              width: '100%',
              height: `${(v / max) * 110}px`,
              background: i === data.length - 1 ? 'var(--tanqe-orange)' : 'rgba(232, 88, 26, 0.32)',
              borderRadius: '2px 2px 0 0',
              transition: 'background var(--dur) var(--ease-out)',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--tanqe-gray)',
            }}
          >
            {meses[i]}
          </span>
        </div>
      ))}
    </div>
  )
}

function DashMockup() {
  return (
    <div style={{ display: 'grid', gap: 14 }}>
      {/* topbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
            <span key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
          ))}
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--tanqe-gray)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          posto sol nascente · dashboard
        </span>
      </div>

      {/* kpis */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {[
          { l: 'Economia', v: 'R$ 12.847', d: '+18,3%' },
          { l: 'Volume', v: '84.5k L', d: '+12%' },
          { l: 'Score', v: '4.8★', d: '+0,2' },
        ].map((k) => (
          <div key={k.l} style={{ background: 'var(--surface-2)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 3, padding: 12 }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 8, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--tanqe-gray)', margin: 0, marginBottom: 6 }}>{k.l}</p>
            <p style={{ fontFamily: 'var(--font-sora), Sora, sans-serif', fontWeight: 700, fontSize: 16, color: 'var(--tanqe-cream)', margin: 0, letterSpacing: '-0.02em' }}>{k.v}</p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--tanqe-orange)', margin: '4px 0 0' }}>{k.d}</p>
          </div>
        ))}
      </div>

      {/* leilao live */}
      <div style={{ background: 'var(--surface-2)', border: '1px solid rgba(232,88,26,0.18)', borderRadius: 3, padding: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ background: 'rgba(232,88,26,0.18)', color: 'var(--tanqe-orange)', padding: '3px 8px', borderRadius: 2, fontFamily: 'var(--font-mono)', fontSize: 8, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            Diesel S-10 · 25.000L
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--tanqe-orange)' }}>14h 32m</span>
        </div>
        <div style={{ display: 'grid', gap: 6 }}>
          {[
            { c: 'C', p: 'R$ 5,78/L' },
            { c: 'B', p: 'R$ 5,69/L' },
            { c: 'A', p: 'R$ 5,61/L', best: true },
          ].map((lance) => (
            <div
              key={lance.c}
              style={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr auto',
                gap: 8,
                alignItems: 'center',
                background: lance.best ? 'rgba(232,88,26,0.10)' : 'transparent',
                border: lance.best ? '1px solid rgba(232,88,26,0.3)' : '1px solid rgba(255,255,255,0.04)',
                borderRadius: 2,
                padding: '6px 10px',
              }}
            >
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--tanqe-gray)' }}>Concorrente {lance.c}</span>
              <div style={{ height: 1, background: 'rgba(255,255,255,0.05)' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, color: lance.best ? 'var(--tanqe-orange)' : 'var(--tanqe-cream)' }}>{lance.p}</span>
            </div>
          ))}
        </div>
      </div>

      {/* sparkline */}
      <div style={{ background: 'var(--surface-2)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 3, padding: 12 }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 8, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--tanqe-gray)', margin: 0, marginBottom: 8 }}>
          Preço médio ANP · 10 dias
        </p>
        <svg width="100%" height="40" viewBox="0 0 220 40" preserveAspectRatio="none">
          <path
            d="M 0 28 L 22 22 L 44 26 L 66 20 L 88 23 L 110 18 L 132 16 L 154 21 L 176 14 L 198 11 L 220 12"
            fill="none"
            stroke="#E8581A"
            strokeWidth="1.5"
          />
        </svg>
      </div>
    </div>
  )
}
