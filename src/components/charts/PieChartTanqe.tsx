'use client'

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { ChartTooltip } from './ChartTooltip'

const PALETTE = ['#E8581A', '#F4874A', '#F9C9AE', '#7A7870', '#1C1B19', '#C23F06']

interface Props {
  data: Array<Record<string, unknown>>
  nameKey: string
  valueKey: string
  height?: number
  innerRadius?: number
  outerRadius?: number
  valueFormatter?: (v: number) => string
  showLegend?: boolean
  palette?: string[]
}

export function PieChartTanqe({
  data,
  nameKey,
  valueKey,
  height = 240,
  innerRadius = 50,
  outerRadius = 90,
  valueFormatter,
  showLegend = true,
  palette = PALETTE,
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
        <PieChart>
          <Pie
            data={data}
            nameKey={nameKey}
            dataKey={valueKey}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={2}
            animationDuration={600}
            stroke="none"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={palette[i % palette.length]} />
            ))}
          </Pie>
          <Tooltip
            content={
              <ChartTooltip
                valueFormatter={valueFormatter ? (v) => valueFormatter(Number(v)) : undefined}
              />
            }
          />
          {showLegend && (
            <Legend
              iconType="square"
              iconSize={8}
              wrapperStyle={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--tanqe-gray)',
                paddingTop: 8,
              }}
            />
          )}
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
