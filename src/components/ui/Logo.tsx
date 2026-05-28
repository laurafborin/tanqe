type LogoVariant = 'dark' | 'light'
type LogoSize = 'sm' | 'md' | 'lg'

interface LogoProps {
  variant?: LogoVariant
  size?: LogoSize
  className?: string
}

const SIZE_MAP: Record<LogoSize, number> = {
  sm: 17,
  md: 25,
  lg: 44,
}

export function Logo({ variant = 'dark', size = 'md', className = '' }: LogoProps) {
  const fontSize = SIZE_MAP[size]
  const tanColor = variant === 'dark' ? '#F7F5F1' : '#1C1B19'
  const qeColor = '#E8581A'

  return (
    <span
      aria-label="TANQE"
      role="img"
      className={className}
      style={{
        display: 'inline-flex',
        fontFamily: 'var(--font-sora), Sora, sans-serif',
        fontWeight: 800,
        fontSize,
        letterSpacing: '-0.02em',
        lineHeight: 1,
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ color: tanColor }}>TAN</span>
      <span style={{ color: qeColor }}>QE</span>
    </span>
  )
}
