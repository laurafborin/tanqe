'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { ChartTooltip } from './ChartTooltip'

export interface BarConfig {
  dataKey: string
  color: string
  name?: string
}

interface Props {
  data: Array<Record<string, unknown>>
  xKey: string
  bars: BarConfig[]
  height?: number
  yFormatter?: (v: number) => string
  layout?: 'horizontal' | 'vertical'
  yAxisWidth?: number
}

export function BarChartTanqe({
  data,
  xKey,
  bars,
  height = 240,
  yFormatter,
  layout = 'horizontal',
  yAxisWidth = 80,
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
        <BarChart
          data={data}
          layout={layout}
          margin={{ top: 4, right: 8, left: -8, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--tanqe-stone)" />
          {layout === 'horizontal' ? (
            <>
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
            </>
          ) : (
            <>
              <XAxis
                type="number"
                tick={{ fontFamily: 'var(--font-mono)', fontSize: 10, fill: 'var(--tanqe-gray)' }}
                axisLine={{ stroke: 'var(--tanqe-stone)' }}
                tickLine={false}
                tickFormatter={yFormatter}
              />
              <YAxis
                type="category"
                dataKey={xKey}
                tick={{ fontFamily: 'var(--font-mono)', fontSize: 10, fill: 'var(--tanqe-gray)' }}
                axisLine={false}
                tickLine={false}
                width={yAxisWidth}
              />
            </>
          )}
          <Tooltip
            cursor={{ fill: 'rgba(232, 88, 26, 0.05)' }}
            content={
              <ChartTooltip
                valueFormatter={yFormatter ? (v) => yFormatter(Number(v)) : undefined}
              />
            }
          />
          {bars.map((b) => (
            <Bar
              key={b.dataKey}
              dataKey={b.dataKey}
              name={b.name || b.dataKey}
              fill={b.color}
              radius={layout === 'horizontal' ? [3, 3, 0, 0] : [0, 3, 3, 0]}
              animationDuration={600}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
