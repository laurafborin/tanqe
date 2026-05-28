type LogoProps = {
  variant?: 'dark' | 'light' | 'orange' | 'light-orange'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const SIZE_MAP = {
  sm: { width: 80, height: 22, fontSize: 20 },
  md: { width: 140, height: 38, fontSize: 36 },
  lg: { width: 260, height: 72, fontSize: 64 },
}

export function Logo({ variant = 'dark', size = 'md', className = '' }: LogoProps) {
  const { width, height, fontSize } = SIZE_MAP[size]

  const colors =
    variant === 'light'
      ? { tan: '#FFFFFF', qe: '#FFFFFF' }
      : variant === 'orange'
      ? { tan: '#FFFFFF', qe: '#FFFFFF' }
      : variant === 'light-orange'
      ? { tan: '#FFFFFF', qe: '#E8581A' }
      : { tan: '#0F0F0E', qe: '#E8581A' }

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="TANQE"
    >
      <text
        x="0"
        y={fontSize * 0.85}
        fontFamily="var(--font-display)"
        fontSize={fontSize}
        fontWeight="800"
        fill={colors.tan}
        letterSpacing="-1.5"
      >
        TAN
      </text>
      <text
        x={fontSize * 2.3}
        y={fontSize * 0.85}
        fontFamily="var(--font-display)"
        fontSize={fontSize}
        fontWeight="800"
        fill={colors.qe}
        letterSpacing="-1.5"
      >
        QE
      </text>
    </svg>
  )
}
