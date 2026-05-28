'use client'


export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Logo } from '@/components/ui/Logo'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha })
    if (error) {
      setErro(error.message)
      setLoading(false)
      return
    }
    const { data: profile } = await supabase
      .from('profiles')
      .select('tipo')
      .eq('id', data.user.id)
      .single()
    router.push(
      profile?.tipo === 'distribuidora' ? '/distribuidora/dashboard' : '/posto/dashboard',
    )
  }

  function fillDemo(role: 'posto' | 'distribuidora') {
    setEmail(role === 'posto' ? 'posto@tanqe.com.br' : 'distribuidora@tanqe.com.br')
    setSenha('123456')
  }

  const labelStyle = {
    display: 'block',
    fontFamily: 'var(--font-mono)',
    fontSize: 10,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.15em',
    color: 'var(--tanqe-gray-light)',
    marginBottom: 8,
  }

  const inputStyle = {
    width: '100%',
    background: 'var(--tanqe-slate)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 3,
    padding: '14px 16px',
    color: 'var(--tanqe-white)',
    fontFamily: 'var(--font-body)',
    fontSize: 14,
    outline: 'none',
    transition: 'border-color 0.15s',
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'var(--tanqe-black)',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        position: 'relative',
      }}
      className="login-grid"
    >
      {/* LEFT â€” visual */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '64px',
          position: 'relative',
          overflow: 'hidden',
        }}
        className="login-left"
      >
        <div
          aria-hidden
          style={{
            position: 'absolute',
            left: '-10%',
            top: '40%',
            width: 500,
            height: 500,
            background: 'radial-gradient(circle, rgba(232, 88, 26, 0.10) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div style={{ position: 'relative', maxWidth: 420 }}>
          <Logo variant="light-orange" size="lg" />
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 28,
              fontWeight: 700,
              color: 'var(--tanqe-white)',
              lineHeight: 1.2,
              letterSpacing: '-0.01em',
              margin: '40px 0 16px',
            }}
          >
            A plataforma do posto independente.
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 300,
              fontSize: 14,
              color: 'var(--tanqe-gray)',
              maxWidth: 360,
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            Negocie combustÃ­vel com inteligÃªncia. Em tempo real. Com dados.
          </p>
        </div>
        <Link
          href="/"
          style={{
            position: 'absolute',
            bottom: 32,
            left: 64,
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            color: 'var(--tanqe-gray)',
            textDecoration: 'none',
          }}
        >
          â† Voltar
        </Link>
      </div>

      {/* RIGHT â€” form */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '64px',
        }}
        className="login-right"
      >
        <div
          style={{
            background: 'var(--tanqe-charcoal)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 4,
            padding: 48,
            width: '100%',
            maxWidth: 440,
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--tanqe-orange)',
              margin: 0,
              marginBottom: 12,
            }}
          >
            Acesso Ã  plataforma
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 24,
              fontWeight: 700,
              color: 'var(--tanqe-white)',
              letterSpacing: '-0.01em',
              margin: 0,
              marginBottom: 32,
            }}
          >
            Entrar
          </h1>

          {erro && (
            <div
              style={{
                padding: 12,
                background: 'rgba(194, 63, 6, 0.15)',
                border: '1px solid rgba(194, 63, 6, 0.4)',
                color: 'var(--tanqe-orange-light)',
                fontSize: 13,
                fontFamily: 'var(--font-body)',
                borderRadius: 2,
                marginBottom: 20,
              }}
            >
              {erro}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="seu@email.com"
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--tanqe-orange)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
              />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>Senha</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                placeholder="â€¢â€¢â€¢â€¢â€¢â€¢"
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--tanqe-orange)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: 'var(--tanqe-orange)',
                color: 'var(--tanqe-white)',
                border: 'none',
                padding: '14px 24px',
                borderRadius: 2,
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                cursor: loading ? 'wait' : 'pointer',
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? 'Entrando...' : 'Entrar â†’'}
            </button>
          </form>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              margin: '32px 0',
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              color: 'var(--tanqe-gray)',
            }}
          >
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
            <span>ou use as contas demo</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button
              type="button"
              onClick={() => fillDemo('posto')}
              style={{
                background: 'transparent',
                border: '1px solid rgba(232, 88, 26, 0.3)',
                borderRadius: 2,
                padding: '10px 14px',
                color: 'var(--tanqe-orange)',
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span>Entrar como Posto</span>
              <span style={{ color: 'var(--tanqe-gray)', fontSize: 10 }}>posto@tanqe.com.br</span>
            </button>
            <button
              type="button"
              onClick={() => fillDemo('distribuidora')}
              style={{
                background: 'transparent',
                border: '1px solid rgba(232, 88, 26, 0.3)',
                borderRadius: 2,
                padding: '10px 14px',
                color: 'var(--tanqe-orange)',
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span>Entrar como Distribuidora</span>
              <span style={{ color: 'var(--tanqe-gray)', fontSize: 10 }}>distribuidora@tanqe.com.br</span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 880px) {
          .login-grid { grid-template-columns: 1fr !important; }
          .login-left { padding: 48px 32px 32px !important; }
          .login-right { padding: 32px !important; }
        }
      `}</style>
    </main>
  )
}
