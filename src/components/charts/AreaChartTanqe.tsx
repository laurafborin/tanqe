'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { ChartTooltip } from './ChartTooltip'

export interface AreaConfig {
  dataKey: string
  color: string
  name?: string
}

interface Props {
  data: Array<Record<string, unknown>>
  xKey: string
  areas: AreaConfig[]
  height?: number
  yFormatter?: (v: number) => string
}

export function AreaChartTanqe({
  data,
  xKey,
  areas,
  height = 240,
  yFormatter,
}: Props) {
  if (!data || data.length === 0) {
    return (
      <div
        style={{
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--tanqe-gray)',
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
        }}
      >
        Sem dados
      </div>
    )
  }
  return (
    <div style={{ height, width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
          <defs>
            {areas.map((a) => (
              <linearGradient key={a.dataKey} id={`tanqe-area-${a.dataKey}`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={a.color} stopOpacity={0.3} />
                <stop offset="100%" stopColor={a.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--tanqe-stone)" />
          <XAxis
            dataKey={xKey}
            tick={{ fontFamily: 'var(--font-mono)', fontSize: 10, fill: 'var(--tanqe-gray)' }}
            axisLine={{ stroke: 'var(--tanqe-stone)' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontFamily: 'var(--font-mono)', fontSize: 10, fill: 'var(--tanqe-gray)' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={yFormatter}
            width={64}
          />
          <Tooltip
            content={
              <ChartTooltip
                valueFormatter={yFormatter ? (v) => yFormatter(Number(v)) : undefined}
              />
            }
          />
          {areas.map((a) => (
            <Area
              key={a.dataKey}
              type="monotone"
              dataKey={a.dataKey}
              name={a.name || a.dataKey}
              stroke={a.color}
              strokeWidth={2}
              fill={`url(#tanqe-area-${a.dataKey})`}
              dot={false}
              animationDuration={600}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
