'use client'

import Link from 'next/link'
import type { ReactNode, MouseEvent, CSSProperties } from 'react'
import type { LucideIcon } from 'lucide-react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'dark' | 'on-orange'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
  onClick?: (e: MouseEvent<HTMLElement>) => void
  href?: string
  icon?: LucideIcon
  iconRight?: LucideIcon
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  fullWidth?: boolean
  style?: CSSProperties
}

const SIZE_MAP: Record<ButtonSize, { padding: string; fontSize: number; iconSize: number }> = {
  sm: { padding: '8px 14px', fontSize: 11, iconSize: 14 },
  md: { padding: '12px 20px', fontSize: 13, iconSize: 15 },
  lg: { padding: '16px 28px', fontSize: 14, iconSize: 16 },
}

function variantStyle(variant: ButtonVariant): CSSProperties {
  switch (variant) {
    case 'primary':
      return { background: 'var(--tanqe-orange)', color: 'var(--tanqe-white)', border: '1px solid var(--tanqe-orange)' }
    case 'secondary':
      return { background: 'transparent', color: 'var(--tanqe-orange)', border: '1px solid var(--tanqe-orange)' }
    case 'ghost':
      return { background: 'transparent', color: 'var(--tanqe-orange)', border: '1px solid transparent' }
    case 'dark':
      return { background: 'var(--tanqe-charcoal)', color: 'var(--tanqe-white)', border: '1px solid var(--tanqe-charcoal)' }
    case 'on-orange':
      return { background: 'var(--tanqe-white)', color: 'var(--tanqe-orange-deep)', border: '1px solid var(--tanqe-white)' }
  }
}

function hoverStyle(variant: ButtonVariant): CSSProperties {
  switch (variant) {
    case 'primary':
      return { background: 'var(--tanqe-orange-deep)', borderColor: 'var(--tanqe-orange-deep)' }
    case 'secondary':
      return { background: 'var(--tanqe-orange)', color: 'var(--tanqe-white)' }
    case 'ghost':
      return { background: 'var(--tanqe-orange-pale)' }
    case 'dark':
      return { background: 'var(--tanqe-slate)' }
    case 'on-orange':
      return { background: 'var(--tanqe-orange-pale)' }
  }
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  href,
  icon: Icon,
  iconRight: IconRight,
  type = 'button',
  disabled = false,
  fullWidth = false,
  style: customStyle,
}: ButtonProps) {
  const s = SIZE_MAP[size]
  const v = variantStyle(variant)
  const baseStyle: CSSProperties = {
    display: fullWidth ? 'flex' : 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: s.padding,
    borderRadius: 2,
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: s.fontSize,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    textDecoration: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition:
      'background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out)',
    width: fullWidth ? '100%' : undefined,
    whiteSpace: 'nowrap',
    ...v,
    ...customStyle,
  }
  const h = hoverStyle(variant)

  const onEnter = (e: MouseEvent<HTMLElement>) => {
    if (disabled) return
    Object.entries(h).forEach(([k, val]) => {
      ;(e.currentTarget.style as unknown as Record<string, string>)[k] = String(val)
    })
  }
  const onLeave = (e: MouseEvent<HTMLElement>) => {
    if (disabled) return
    Object.entries(v).forEach(([k, val]) => {
      ;(e.currentTarget.style as unknown as Record<string, string>)[k] = String(val)
    })
  }

  const content = (
    <>
      {Icon && <Icon size={s.iconSize} strokeWidth={2} />}
      {children}
      {IconRight && <IconRight size={s.iconSize} strokeWidth={2} />}
    </>
  )

  if (href && !disabled) {
    return (
      <Link href={href} style={baseStyle} onMouseEnter={onEnter} onMouseLeave={onLeave}>
        {content}
      </Link>
    )
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={baseStyle}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {content}
    </button>
  )
}
