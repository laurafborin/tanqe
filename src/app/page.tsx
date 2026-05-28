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

const ctaButton = {
  background: 'var(--tanqe-orange)',
  color: 'var(--tanqe-white)',
  padding: '10px 24px',
  borderRadius: 2,
  fontFamily: 'var(--font-display)',
  fontSize: 13,
  fontWeight: 700,
  letterSpacing: '0.02em',
  textDecoration: 'none',
  textTransform: 'uppercase' as const,
}

const eyebrowOrange = {
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

export default function LandingPage() {
  return (
    <div style={{ background: 'var(--tanqe-cream)' }}>
      {/* NAV */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 60,
          padding: '0 48px',
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
        <Link href="/" aria-label="TANQE" style={{ display: 'flex', alignItems: 'center' }}>
          <Logo variant="light-orange" size="sm" />
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <a href="#postos" style={navLink} className="nav-anchor">
            Para postos
          </a>
          <a href="#distribuidoras" style={navLink} className="nav-anchor">
            Para distribuidoras
          </a>
          <Link href="/login" style={ctaButton}>
            Entrar
          </Link>
        </div>
        <style>{`
          .nav-anchor:hover { color: var(--tanqe-white) !important; }
          @media (max-width: 720px) {
            .nav-anchor { display: none; }
          }
        `}</style>
      </nav>

      {/* HERO */}
      <section
        style={{
          minHeight: '100vh',
          background: 'var(--tanqe-black)',
          position: 'relative',
          overflow: 'hidden',
          paddingTop: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(232, 88, 26, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(232, 88, 26, 0.06) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div
          aria-hidden
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            height: 600,
            background: 'radial-gradient(circle, rgba(232, 88, 26, 0.18) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', textAlign: 'center', padding: '0 24px', maxWidth: 720 }}>
          <div style={{ ...eyebrowOrange, marginBottom: 32 }}>
            Marketplace B2B · Leilão reverso
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(72px, 12vw, 140px)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              lineHeight: 0.95,
              margin: 0,
              marginBottom: 24,
            }}
          >
            <span style={{ color: 'var(--tanqe-white)' }}>TAN</span>
            <br />
            <span style={{ color: 'var(--tanqe-orange)' }}>QE</span>
          </h1>

          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 300,
              fontSize: 16,
              color: 'var(--tanqe-gray)',
              maxWidth: 480,
              margin: '0 auto 24px',
              lineHeight: 1.6,
            }}
          >
            A plataforma que digitaliza a negociação de combustíveis e empodera o posto bandeira branca.
          </p>

          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              color: 'var(--tanqe-gray-light)',
              maxWidth: 540,
              margin: '0 auto 40px',
            }}
          >
            12% economia média · 30s pra publicar · 0 telefonema
          </p>

          <Link
            href="/login"
            style={{
              display: 'inline-block',
              background: 'var(--tanqe-orange)',
              color: 'var(--tanqe-white)',
              padding: '16px 32px',
              borderRadius: 2,
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 14,
              letterSpacing: '0.04em',
              textDecoration: 'none',
              textTransform: 'uppercase',
            }}
          >
            Acessar plataforma →
          </Link>
        </div>
      </section>

      {/* PROBLEMA */}
      <section id="postos" style={{ background: 'var(--tanqe-cream)', padding: '120px 48px' }}>
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 64,
            alignItems: 'start',
          }}
        >
          <div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                color: 'var(--tanqe-orange)',
                marginBottom: 16,
              }}
            >
              01 — O problema
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(32px, 5vw, 52px)',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                lineHeight: 1.05,
                color: 'var(--tanqe-black)',
                margin: 0,
                marginBottom: 24,
              }}
            >
              O posto bandeira branca<br />negocia no escuro.
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 300,
                fontSize: 16,
                color: 'var(--tanqe-gray)',
                lineHeight: 1.7,
                margin: 0,
                maxWidth: 500,
              }}
            >
              Cada cotação é uma ligação. Cada preço é um achismo. Cada decisão depende de quem você conhece. Enquanto isso, as redes grandes negociam com dados, escala e poder de barganha que o posto independente nunca teve. Até agora.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { n: '#1', title: 'Assimetria de informação', body: 'Você não sabe se o preço que recebe é justo. A distribuidora sabe.' },
              { n: '#2', title: 'Negociação fragmentada', body: 'Telefone, WhatsApp, planilha. Três distribuidoras, três processos diferentes, zero histórico.' },
              { n: '#3', title: 'Poder de barganha zero', body: 'Sozinho, você não tem volume. As redes grandes têm. O jogo já começa perdido.' },
            ].map((c) => (
              <div
                key={c.n}
                style={{
                  background: 'var(--tanqe-white)',
                  border: '1px solid var(--tanqe-stone)',
                  borderRadius: 4,
                  padding: 24,
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    color: 'var(--tanqe-orange-deep)',
                    marginBottom: 10,
                  }}
                >
                  Problema {c.n}
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: 16,
                    color: 'var(--tanqe-black)',
                    margin: 0,
                    marginBottom: 8,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {c.title}
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontWeight: 300,
                    fontSize: 13,
                    color: 'var(--tanqe-gray)',
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  {c.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PILARES */}
      <section style={{ background: 'var(--tanqe-cream)', padding: '0 48px 120px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: 'var(--tanqe-orange)',
              marginBottom: 16,
            }}
          >
            O que TANQE entrega
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(32px, 5vw, 52px)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              lineHeight: 1.05,
              color: 'var(--tanqe-black)',
              margin: 0,
              marginBottom: 32,
            }}
          >
            Três pilares.<br />Uma plataforma.
          </h2>
          <div style={{ width: 48, height: 3, background: 'var(--tanqe-orange)', marginBottom: 64 }} />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {[
              { num: '01', title: 'Leilão reverso digital.', body: 'Postos publicam a demanda. Distribuidoras competem em tempo real. O melhor preço vence — sem telefonema, sem planilha, sem fricção.' },
              { num: '02', title: 'Inteligência de preço.', body: 'Dados ANP integrados. Histórico de mercado. Sugestão de teto de preço calibrada por região e combustível.' },
              { num: '03', title: 'Rastreamento ponta a ponta.', body: 'Do lance aceito ao caminhão chegando no tanque. Status em tempo real, prazo cumprido com evidência.' },
            ].map((p) => (
              <div
                key={p.num}
                style={{
                  background: 'var(--tanqe-white)',
                  border: '1px solid var(--tanqe-stone)',
                  borderTop: '3px solid var(--tanqe-orange)',
                  borderRadius: 4,
                  padding: '40px 32px',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 48,
                    fontWeight: 800,
                    color: 'var(--tanqe-orange-mid)',
                    lineHeight: 1,
                    marginBottom: 24,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {p.num}
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--tanqe-black)', marginBottom: 16, letterSpacing: '-0.01em' }}>
                  {p.title}
                </h3>
                <p style={{ fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: 13, color: 'var(--tanqe-gray)', lineHeight: 1.7, margin: 0 }}>
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="distribuidoras" style={{ background: 'var(--tanqe-black)', padding: '120px 48px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: 'var(--tanqe-orange)',
              marginBottom: 16,
            }}
          >
            02 — Como funciona
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(32px, 5vw, 52px)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              lineHeight: 1.05,
              color: 'var(--tanqe-white)',
              margin: 0,
              marginBottom: 64,
            }}
          >
            Quatro passos.<br />Sem fricção.
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
            {[
              { n: '01', t: 'Publique a demanda', b: 'Combustível, volume, prazo. 30 segundos.' },
              { n: '02', t: 'Receba lances', b: 'Distribuidoras competem em tempo real. Melhor preço vence.' },
              { n: '03', t: 'Aceite e formalize', b: 'Contrato gerado, NF-e emitida, pagamento agendado.' },
              { n: '04', t: 'Rastreie até o tanque', b: 'Status do caminhão, ETA, comprovante de entrega.' },
            ].map((s) => (
              <div
                key={s.n}
                style={{
                  background: 'var(--tanqe-charcoal)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 4,
                  padding: '32px 24px',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 56,
                    fontWeight: 800,
                    color: 'var(--tanqe-orange-mid)',
                    lineHeight: 1,
                    marginBottom: 24,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {s.n}
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--tanqe-white)', margin: 0, marginBottom: 8, letterSpacing: '-0.01em' }}>
                  {s.t}
                </h3>
                <p style={{ fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: 13, color: 'var(--tanqe-gray-light)', lineHeight: 1.6, margin: 0 }}>
                  {s.b}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: 'var(--tanqe-black)', padding: '48px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 24,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Logo variant="light-orange" size="md" />
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: 'var(--tanqe-gray)',
              lineHeight: 2,
              textAlign: 'right',
            }}
          >
            © 2026 TANQE · Todos os direitos reservados
          </div>
        </div>
      </footer>
    </div>
  )
}
