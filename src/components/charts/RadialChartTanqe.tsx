'use client'

import {
  RadialBarChart,
  RadialBar,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { ChartTooltip } from './ChartTooltip'

const PALETTE = ['#E8581A', '#F4874A', '#F9C9AE', '#7A7870', '#C23F06']

interface RadialItem {
  name: string
  value: number
}

interface Props {
  data: RadialItem[]
  height?: number
  valueFormatter?: (v: number) => string
  showLegend?: boolean
}

export function RadialChartTanqe({
  data,
  height = 240,
  valueFormatter,
  showLegend = true,
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
  const colored = data.map((d, i) => ({ ...d, fill: PALETTE[i % PALETTE.length] }))
  return (
    <div style={{ height, width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          innerRadius={20}
          outerRadius={90}
          barSize={12}
          data={colored}
          startAngle={90}
          endAngle={-270}
        >
          <RadialBar
            dataKey="value"
            background={{ fill: 'var(--tanqe-stone)' }}
            cornerRadius={6}
            animationDuration={600}
          />
          <Tooltip
            content={
              <ChartTooltip
                valueFormatter={valueFormatter ? (v) => valueFormatter(Number(v)) : undefined}
              />
            }
          />
          {showLegend && (
            <Legend
              iconType="circle"
              iconSize={8}
              layout="vertical"
              verticalAlign="middle"
              align="right"
              wrapperStyle={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--tanqe-gray)',
              }}
            />
          )}
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  )
}
