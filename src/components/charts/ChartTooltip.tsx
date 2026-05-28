'use client'

type Numerish = string | number

interface TooltipEntry {
  name?: string | number
  value?: Numerish
  color?: string
  dataKey?: string | number
}

interface ChartTooltipProps {
  active?: boolean
  payload?: TooltipEntry[]
  label?: string | number
  valueFormatter?: (v: Numerish) => string
}

export function ChartTooltip({
  active,
  payload,
  label,
  valueFormatter,
}: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null

  return (
    <div
      style={{
        background: 'var(--tanqe-charcoal)',
        border: '1px solid rgba(232, 88, 26, 0.3)',
        borderRadius: 3,
        padding: '10px 14px',
        boxShadow: 'var(--shadow-lg)',
        minWidth: 120,
      }}
    >
      {label !== undefined && label !== '' && (
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: 'var(--tanqe-gray-light)',
            margin: 0,
            marginBottom: 8,
          }}
        >
          {label}
        </p>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {payload.map((p: TooltipEntry, i: number) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 12,
              fontFamily: 'var(--font-body)',
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                background: p.color || 'var(--tanqe-orange)',
                borderRadius: 1,
                flexShrink: 0,
              }}
            />
            <span style={{ color: 'var(--tanqe-gray-light)' }}>
              {String(p.name ?? '')}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                color: 'var(--tanqe-orange)',
                marginLeft: 'auto',
                fontWeight: 500,
              }}
            >
              {valueFormatter && p.value !== undefined
                ? valueFormatter(p.value)
                : String(p.value ?? '')}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
