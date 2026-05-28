'use client'

import Link from 'next/link'
import { Logo } from '@/components/ui/Logo'

export default function ErrorPage({ reset }: { reset: () => void }) {
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
        <Logo variant="dark" size="md" />
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
        Erro inesperado
      </p>

      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(48px, 8vw, 80px)',
          fontWeight: 800,
          color: 'var(--tanqe-white)',
          letterSpacing: '-0.02em',
          lineHeight: 1,
          margin: 0,
          marginBottom: 16,
        }}
      >
        Algo deu errado.
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
        Ocorreu um erro inesperado na plataforma. Tente novamente — se persistir,
        nos avise.
      </p>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={reset}
          style={{
            background: 'var(--tanqe-orange)',
            color: 'var(--tanqe-white)',
            border: 'none',
            padding: '14px 28px',
            borderRadius: 2,
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >
          Tentar novamente
        </button>
        <Link
          href="/"
          style={{
            background: 'transparent',
            color: 'var(--tanqe-gray-light)',
            border: '1px solid rgba(255,255,255,0.1)',
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
      </div>
    </main>
  )
}
