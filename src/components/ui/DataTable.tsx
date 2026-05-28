import type { ReactNode, MouseEvent } from 'react'

type Align = 'left' | 'right' | 'center'

export interface DataTableColumn<T> {
  key: string
  label: string
  align?: Align
  width?: string | number
  render?: (row: T) => ReactNode
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[]
  rows: T[]
  onRowClick?: (row: T) => void
  emptyMessage?: string
  rowKey?: (row: T, index: number) => string | number
}

export function DataTable<T>({
  columns,
  rows,
  onRowClick,
  emptyMessage = 'Nada por aqui ainda.',
  rowKey,
}: DataTableProps<T>) {
  if (rows.length === 0) {
    return (
      <div
        style={{
          padding: '60px 24px',
          textAlign: 'center',
          fontFamily: 'var(--font-body)',
          fontWeight: 300,
          fontSize: 14,
          color: 'var(--tanqe-gray)',
        }}
      >
        {emptyMessage}
      </div>
    )
  }
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr
            style={{
              background: 'var(--tanqe-cream)',
              borderBottom: '1px solid var(--tanqe-stone)',
            }}
          >
            {columns.map((c) => (
              <th
                key={c.key}
                style={{
                  textAlign: c.align ?? 'left',
                  padding: '12px 16px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  color: 'var(--tanqe-gray)',
                  fontWeight: 500,
                  width: c.width,
                }}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={rowKey ? rowKey(row, i) : i}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              style={{
                borderBottom:
                  i === rows.length - 1 ? 'none' : '1px solid var(--tanqe-stone)',
                cursor: onRowClick ? 'pointer' : 'default',
                transition: 'background var(--dur-fast) var(--ease-out)',
              }}
              onMouseEnter={(e: MouseEvent<HTMLTableRowElement>) => {
                if (onRowClick) e.currentTarget.style.background = 'var(--tanqe-cream)'
              }}
              onMouseLeave={(e: MouseEvent<HTMLTableRowElement>) => {
                e.currentTarget.style.background = 'transparent'
              }}
            >
              {columns.map((c) => (
                <td
                  key={c.key}
                  style={{
                    textAlign: c.align ?? 'left',
                    padding: '14px 16px',
                    fontFamily: 'var(--font-body)',
                    fontSize: 14,
                    color: 'var(--tanqe-black)',
                    verticalAlign: 'middle',
                  }}
                >
                  {c.render
                    ? c.render(row)
                    : String((row as Record<string, unknown>)[c.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
