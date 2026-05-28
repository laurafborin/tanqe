'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { ChartTooltip } from './ChartTooltip'

export interface LineConfig {
  dataKey: string
  color: string
  name?: string
}

interface Props {
  data: Array<Record<string, unknown>>
  xKey: string
  lines: LineConfig[]
  height?: number
  yFormatter?: (v: number) => string
  domain?: [string | number, string | number]
}

export function LineChartTanqe({
  data,
  xKey,
  lines,
  height = 240,
  yFormatter,
  domain,
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
        <LineChart data={data} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--tanqe-stone)" />
          <XAxis
            dataKey={xKey}
            tick={{ fontFamily: 'var(--font-mono)', fontSize: 10, fill: 'var(--tanqe-gray)' }}
            axisLine={{ stroke: 'var(--tanqe-stone)' }}
            tickLine={false}
          />
          <YAxis
            domain={domain ?? ['dataMin - 0.05', 'dataMax + 0.05']}
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
          {lines.map((l) => (
            <Line
              key={l.dataKey}
              type="monotone"
              dataKey={l.dataKey}
              name={l.name || l.dataKey}
              stroke={l.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0, fill: l.color }}
              animationDuration={600}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
