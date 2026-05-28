'use client'

import { Area, AreaChart, ResponsiveContainer } from 'recharts'

interface StatCardProps {
  label: string
  value: string | number
  delta?: string
  deltaPositive?: boolean
  sublabel?: string
  sparklineData?: number[]
  star?: boolean
}

export function StatCard({
  label,
  value,
  delta,
  deltaPositive = true,
  sublabel,
  sparklineData,
  star = false,
}: StatCardProps) {
  const sparkId = `spark-${label.replace(/[^a-zA-Z0-9]/g, '_')}`
  return (
    <div
      style={{
        background: 'var(--tanqe-white)',
        border: '1px solid var(--tanqe-stone)',
        borderRadius: 4,
        padding: 24,
        transition:
          'transform var(--dur) var(--ease-out), box-shadow var(--dur) var(--ease-out), border-color var(--dur) var(--ease-out)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-1px)'
        e.currentTarget.style.boxShadow = 'var(--shadow-md)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          color: 'var(--tanqe-gray)',
          margin: 0,
          marginBottom: 12,
        }}
      >
        {label}
      </p>
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 32,
          color: 'var(--tanqe-black)',
          letterSpacing: '-0.02em',
          lineHeight: 1,
        }}
      >
        {value}
        {star && <span style={{ color: 'var(--tanqe-orange)', marginLeft: 6 }}>★</span>}
      </div>
      {(delta || sublabel) && (
        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {delta && (
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                padding: '2px 8px',
                borderRadius: 2,
                background: deltaPositive ? 'var(--tanqe-orange-pale)' : 'var(--status-danger-bg)',
                color: deltaPositive ? 'var(--tanqe-orange-deep)' : 'var(--status-danger-fg)',
              }}
            >
              {delta}
            </span>
          )}
          {sublabel && (
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 300,
                fontSize: 12,
                color: 'var(--tanqe-gray)',
              }}
            >
              {sublabel}
            </span>
          )}
        </div>
      )}
      {sparklineData && sparklineData.length > 1 && (
        <div style={{ height: 40, marginTop: 16, marginLeft: -8, marginRight: -8 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={sparklineData.map((v, i) => ({ i, v }))}
              margin={{ top: 4, right: 0, bottom: 0, left: 0 }}
            >
              <defs>
                <linearGradient id={sparkId} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#E8581A" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#E8581A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke="#E8581A"
                strokeWidth={1.5}
                fill={`url(#${sparkId})`}
                dot={false}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
