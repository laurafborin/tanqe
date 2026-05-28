'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'
import { Logo } from '@/components/ui/Logo'
import { getRole } from '@/lib/auth'

export default function PostoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const role = getRole()
    if (role !== 'posto') {
      router.replace(role === 'distribuidora' ? '/distribuidora/dashboard' : '/login')
      return
    }
    setReady(true)
  }, [router])

  if (!ready) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'var(--tanqe-charcoal)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'pulse 1.6s ease-in-out infinite',
        }}
      >
        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }`}</style>
        <Logo variant="light-orange" size="md" />
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--tanqe-cream)' }}>
      <Sidebar tipo="posto" />
      <main
        style={{
          flex: 1,
          marginLeft: 240,
          padding: '32px 48px',
          background: 'var(--tanqe-cream)',
          minHeight: '100vh',
        }}
        className="tanqe-main"
      >
        {children}
      </main>
      <style>{`
        @media (max-width: 1023px) {
          .tanqe-main { margin-left: 0 !important; padding: 80px 24px 32px !important; }
        }
      `}</style>
    </div>
  )
}
