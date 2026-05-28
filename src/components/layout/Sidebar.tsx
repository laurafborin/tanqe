'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard,
  Gavel,
  FileText,
  Receipt,
  ShieldCheck,
  User,
  Target,
  BarChart3,
  LogOut,
  Menu,
  X,
  type LucideIcon,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Logo } from '@/components/ui/Logo'

type Role = 'posto' | 'distribuidora'

interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

const postoItems: NavItem[] = [
  { label: 'Dashboard', href: '/posto/dashboard', icon: LayoutDashboard },
  { label: 'Leilões', href: '/posto/leiloes', icon: Gavel },
  { label: 'Contratos', href: '/posto/contratos', icon: FileText },
  { label: 'NF-es', href: '/posto/nfes', icon: Receipt },
  { label: 'Auditoria', href: '/posto/auditoria', icon: ShieldCheck },
  { label: 'Perfil', href: '/posto/perfil', icon: User },
]

const distItems: NavItem[] = [
  { label: 'Dashboard', href: '/distribuidora/dashboard', icon: LayoutDashboard },
  { label: 'Oportunidades', href: '/distribuidora/leiloes', icon: Target },
  { label: 'Contratos', href: '/distribuidora/contratos', icon: FileText },
  { label: 'NF-es', href: '/distribuidora/nfes', icon: Receipt },
  { label: 'Analytics', href: '/distribuidora/analytics', icon: BarChart3 },
  { label: 'Perfil', href: '/distribuidora/perfil', icon: User },
]

export default function Sidebar({ tipo }: { tipo: Role }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const items = tipo === 'posto' ? postoItems : distItems
  const portalLabel = tipo === 'posto' ? 'Portal do Posto' : 'Portal da Distribuidora'

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const navItem = (item: NavItem) => {
    const active = pathname === item.href || pathname.startsWith(item.href + '/')
    const Icon = item.icon
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={() => setMobileOpen(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '10px 12px',
          borderRadius: 3,
          fontFamily: 'var(--font-body)',
          fontSize: 13,
          fontWeight: 500,
          letterSpacing: '0.02em',
          textDecoration: 'none',
          marginBottom: 2,
          transition: 'background 0.12s, color 0.12s',
          color: active ? 'var(--tanqe-white)' : 'var(--tanqe-gray-light)',
          background: active ? 'var(--tanqe-orange)' : 'transparent',
          borderLeft: active
            ? '2px solid var(--tanqe-orange-light)'
            : '2px solid transparent',
        }}
        onMouseEnter={(e) => {
          if (!active) {
            e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
            e.currentTarget.style.color = 'var(--tanqe-white)'
          }
        }}
        onMouseLeave={(e) => {
          if (!active) {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = 'var(--tanqe-gray-light)'
          }
        }}
      >
        <Icon size={16} strokeWidth={1.75} />
        {item.label}
      </Link>
    )
  }

  const aside = (
    <aside
      style={{
        width: 240,
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        background: 'var(--tanqe-charcoal)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 40,
      }}
    >
      {/* TOPO */}
      <div
        style={{
          padding: 24,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <Link href="/" aria-label="TANQE" style={{ display: 'block' }}>
          <Logo variant="light-orange" size="sm" />
        </Link>
        <p
          style={{
            margin: '12px 0 0',
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: 'var(--tanqe-gray)',
          }}
        >
          {portalLabel}
        </p>
      </div>

      {/* NAV */}
      <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
        {items.map(navItem)}
      </nav>

      {/* FOOTER */}
      <div
        style={{
          marginTop: 16,
          borderTop: '1px solid rgba(255,255,255,0.06)',
          padding: '16px 12px',
        }}
      >
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '10px 12px',
            borderRadius: 3,
            background: 'transparent',
            border: 'none',
            color: 'var(--tanqe-gray)',
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: '0.02em',
            cursor: 'pointer',
            transition: 'background 0.12s, color 0.12s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
            e.currentTarget.style.color = 'var(--tanqe-white)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = 'var(--tanqe-gray)'
          }}
        >
          <LogOut size={16} strokeWidth={1.75} />
          Sair
        </button>
      </div>
    </aside>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        aria-label="Abrir menu"
        style={{
          position: 'fixed',
          top: 16,
          left: 16,
          width: 40,
          height: 40,
          background: 'var(--tanqe-charcoal)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 3,
          color: 'var(--tanqe-white)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 50,
        }}
        className="lg:hidden"
      >
        <Menu size={18} />
      </button>

      <div className="hidden lg:block">{aside}</div>

      {mobileOpen && (
        <div
          className="lg:hidden"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 60,
            display: 'flex',
          }}
        >
          <div
            onClick={() => setMobileOpen(false)}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.6)',
            }}
          />
          <div style={{ position: 'relative' }}>{aside}</div>
          <button
            onClick={() => setMobileOpen(false)}
            style={{
              position: 'absolute',
              top: 16,
              left: 256,
              width: 40,
              height: 40,
              background: 'var(--tanqe-white)',
              border: 'none',
              borderRadius: 3,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Fechar menu"
          >
            <X size={18} />
          </button>
        </div>
      )}
    </>
  )
}

