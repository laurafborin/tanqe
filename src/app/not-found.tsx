import Link from 'next/link'
import { Logo } from '@/components/ui/Logo'

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'var(--tanqe-black)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        textAlign: 'center',
      }}
    >
      <div style={{ marginBottom: 48 }}>
        <Logo variant="light" size="md" />
      </div>

      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          color: 'var(--tanqe-orange)',
          margin: 0,
          marginBottom: 16,
        }}
      >
        Página não encontrada
      </p>

      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(120px, 20vw, 220px)',
          fontWeight: 800,
          color: 'var(--tanqe-white)',
          letterSpacing: '-0.04em',
          lineHeight: 1,
          margin: 0,
          marginBottom: 24,
        }}
      >
        404
      </h1>

      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontWeight: 300,
          fontSize: 15,
          color: 'var(--tanqe-gray)',
          maxWidth: 420,
          margin: '0 auto 40px',
          lineHeight: 1.6,
        }}
      >
        A página que você procura não existe ou foi movida.
      </p>

      <Link
        href="/"
        style={{
          display: 'inline-block',
          background: 'var(--tanqe-orange)',
          color: 'var(--tanqe-white)',
          padding: '14px 28px',
          borderRadius: 2,
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 13,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          textDecoration: 'none',
        }}
      >
        Voltar ao início
      </Link>
    </main>
  )
}
