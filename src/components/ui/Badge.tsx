import type { ReactNode } from 'react'

export type BadgeVariant =
  | 'ativo'
  | 'aberto'
  | 'concluido'
  | 'pago'
  | 'pendente'
  | 'cancelado'
  | 'atrasado'
  | 'neutro'
  | 'destaque'

const STYLES: Record<BadgeVariant, { bg: string; color: string }> = {
  ativo: { bg: 'var(--status-success-bg)', color: 'var(--status-success-fg)' },
  aberto: { bg: 'var(--tanqe-orange-pale)', color: 'var(--tanqe-orange-deep)' },
  concluido: { bg: 'var(--status-success-bg)', color: 'var(--status-success-fg)' },
  pago: { bg: 'var(--status-success-bg)', color: 'var(--status-success-fg)' },
  pendente: { bg: 'var(--status-warning-bg)', color: 'var(--status-warning-fg)' },
  cancelado: { bg: 'var(--status-danger-bg)', color: 'var(--status-danger-fg)' },
  atrasado: { bg: 'var(--status-danger-bg)', color: 'var(--status-danger-fg)' },
  neutro: { bg: 'var(--tanqe-stone)', color: 'var(--tanqe-gray)' },
  destaque: { bg: 'var(--tanqe-orange-pale)', color: 'var(--tanqe-orange-deep)' },
}

export function Badge({
  variant = 'neutro',
  children,
}: {
  variant?: BadgeVariant
  children: ReactNode
}) {
  const s = STYLES[variant]
  return (
    <span
      style={{
        display: 'inline-block',
        background: s.bg,
        color: s.color,
        padding: '4px 10px',
        borderRadius: 2,
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        fontWeight: 500,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  )
}
