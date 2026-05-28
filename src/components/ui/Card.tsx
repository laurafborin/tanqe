import type { ReactNode, CSSProperties } from 'react'

interface CardProps {
  title?: string
  eyebrow?: string
  action?: ReactNode
  children: ReactNode
  padding?: number | string
  style?: CSSProperties
  hoverable?: boolean
}

export function Card({
  title,
  eyebrow,
  action,
  children,
  padding = 24,
  style,
  hoverable = false,
}: CardProps) {
  return (
    <div
      style={{
        background: 'var(--tanqe-white)',
        border: '1px solid var(--tanqe-stone)',
        borderRadius: 4,
        padding,
        transition: hoverable
          ? 'transform var(--dur) var(--ease-out), box-shadow var(--dur) var(--ease-out), border-color var(--dur) var(--ease-out)'
          : undefined,
        ...style,
      }}
      onMouseEnter={
        hoverable
          ? (e) => {
              e.currentTarget.style.transform = 'translateY(-1px)'
              e.currentTarget.style.boxShadow = 'var(--shadow-md)'
              e.currentTarget.style.borderColor = 'var(--tanqe-orange)'
            }
          : undefined
      }
      onMouseLeave={
        hoverable
          ? (e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
              e.currentTarget.style.borderColor = 'var(--tanqe-stone)'
            }
          : undefined
      }
    >
      {(title || action || eyebrow) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            marginBottom: 16,
            gap: 12,
          }}
        >
          <div style={{ minWidth: 0 }}>
            {eyebrow && (
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  color: 'var(--tanqe-gray)',
                  margin: 0,
                  marginBottom: title ? 6 : 0,
                }}
              >
                {eyebrow}
              </p>
            )}
            {title && (
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: 16,
                  color: 'var(--tanqe-black)',
                  margin: 0,
                  letterSpacing: '-0.01em',
                }}
              >
                {title}
              </h3>
            )}
          </div>
          {action && <div style={{ flexShrink: 0 }}>{action}</div>}
        </div>
      )}
      {children}
    </div>
  )
}
