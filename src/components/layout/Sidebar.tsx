'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  LayoutDashboard,
  Gavel,
  FileText,
  Receipt,
  ShieldCheck,
  User,
  Target,
  BarChart3,
  Truck,
  TrendingUp,
  LogOut,
  Menu,
  X,
  type LucideIcon,
} from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import { Avatar } from '@/components/ui/Avatar'
import { logout, getNome } from '@/lib/auth'

type Role = 'posto' | 'distribuidora'

interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

const postoItems: NavItem[] = [
  { label: 'Dashboard', href: '/posto/dashboard', icon: LayoutDashboard },
  { label: 'Leilões', href: '/posto/leiloes', icon: Gavel },
  { label: 'Pedidos', href: '/posto/pedidos', icon: Truck },
  { label: 'Contratos', href: '/posto/contratos', icon: FileText },
  { label: 'NF-es', href: '/posto/nfes', icon: Receipt },
  { label: 'Auditoria', href: '/posto/auditoria', icon: ShieldCheck },
  { label: 'Perfil', href: '/posto/perfil', icon: User },
]

const distItems: NavItem[] = [
  { label: 'Dashboard', href: '/distribuidora/dashboard', icon: LayoutDashboard },
  { label: 'Oportunidades', href: '/distribuidora/leiloes', icon: Target },
  { label: 'Meus lances', href: '/distribuidora/meus-lances', icon: TrendingUp },
  { label: 'Entregas', href: '/distribuidora/pedidos', icon: Truck },
  { label: 'Contratos', href: '/distribuidora/contratos', icon: FileText },
  { label: 'NF-es', href: '/distribuidora/nfes', icon: Receipt },
  { label: 'Analytics', href: '/distribuidora/analytics', icon: BarChart3 },
  { label: 'Perfil', href: '/distribuidora/perfil', icon: User },
]

export default function Sidebar({ tipo }: { tipo: Role }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [nome, setNome] = useState('')
  useEffect(() => {
    setNome(getNome() || (tipo === 'posto' ? 'Posto Sol Nascente' : 'BR Petro SP'))
  }, [tipo])
  const items = tipo === 'posto' ? postoItems : distItems
  const portalLabel = tipo === 'posto' ? 'Portal do Posto' : 'Portal da Distribuidora'

  function handleLogout() {
    logout()
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
      {/* TOPO — só wordmark TANQE (variant dark) + portal label. Zero ícones aqui. */}
      <div
        style={{
          padding: '24px 24px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <Link href="/" aria-label="TANQE" style={{ display: 'inline-block', textDecoration: 'none' }}>
          <Logo variant="dark" size="md" />
        </Link>
        <p
          style={{
            margin: '14px 0 0',
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
          padding: '12px',
        }}
      >
        {nome && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 10px',
              marginBottom: 8,
            }}
          >
            <Avatar name={nome} size={32} />
            <div style={{ minWidth: 0, flex: 1 }}>
              <p
                style={{
                  margin: 0,
                  fontFamily: 'var(--font-body)',
                  fontSize: 12,
                  fontWeight: 500,
                  color: 'var(--tanqe-white)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {nome}
              </p>
              <p
                style={{
                  margin: 0,
                  fontFamily: 'var(--font-mono)',
                  fontSize: 9,
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  color: 'var(--tanqe-gray)',
                }}
              >
                {tipo === 'posto' ? 'Posto' : 'Distribuidora'}
              </p>
            </div>
          </div>
        )}
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
      {/* Mobile hamburger — APENAS em < 1024px, FORA da sidebar (header flutuante).
          No desktop é display: none via media query. */}
      <button
        onClick={() => setMobileOpen(true)}
        aria-label="Abrir menu"
        className="tanqe-mobile-toggle"
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
          display: 'none',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 50,
        }}
      >
        <Menu size={18} />
      </button>

      {/* Sidebar desktop fixa */}
      <div className="tanqe-sidebar-desktop">{aside}</div>

      {/* Drawer mobile */}
      {mobileOpen && (
        <div
          className="tanqe-sidebar-drawer"
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
            aria-label="Fechar menu"
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
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* CSS responsivo independente do Tailwind */}
      <style>{`
        .tanqe-sidebar-desktop { display: block; }
        .tanqe-mobile-toggle { display: none !important; }
        @media (max-width: 1023px) {
          .tanqe-sidebar-desktop { display: none !important; }
          .tanqe-mobile-toggle { display: flex !important; }
        }
      `}</style>
    </>
  )
}
