const PALETTE = ['#E8581A', '#F4874A', '#C23F06', '#2E2D2A', '#7A7870']

function colorFor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return PALETTE[Math.abs(hash) % PALETTE.length]
}

function initials(name: string): string {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p[0])
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].toUpperCase()
  return (parts[0] + parts[parts.length - 1]).toUpperCase()
}

interface AvatarProps {
  name: string
  size?: number
  square?: boolean
}

export function Avatar({ name, size = 36, square = false }: AvatarProps) {
  return (
    <div
      aria-label={name}
      style={{
        width: size,
        height: size,
        borderRadius: square ? 4 : '50%',
        background: colorFor(name),
        color: 'var(--tanqe-white)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: Math.round(size * 0.36),
        letterSpacing: '-0.02em',
        flexShrink: 0,
      }}
    >
      {initials(name)}
    </div>
  )
}
