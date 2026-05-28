type LogoProps = {
  variant?: 'dark' | 'light' | 'orange' | 'light-orange'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

// fontSize define o tamanho da letra; o resto (width, height, posicionamento de QE)
// é derivado proporcionalmente — assim o kerning é coerente em qualquer escala.
const FONT_SIZES: Record<NonNullable<LogoProps['size']>, number> = {
  xs: 16,
  sm: 22,
  md: 36,
  lg: 64,
  xl: 96,
}

export function Logo({
  variant = 'dark',
  size = 'md',
  className = '',
}: LogoProps) {
  const fontSize = FONT_SIZES[size]
  // Letter-spacing proporcional (Syne 800 com kerning apertado = -0.04em).
  const tracking = -fontSize * 0.04
  // Largura aproximada do "TAN" em Syne 800 ≈ 1.7em; adicionamos folga para "QE".
  const tanWidth = fontSize * 1.78
  const qeStart = tanWidth + fontSize * 0.04
  const totalWidth = qeStart + fontSize * 1.28
  const height = fontSize * 1.04
  const baselineY = fontSize * 0.86

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
      width={totalWidth}
      height={height}
      viewBox={`0 0 ${totalWidth} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="TANQE"
      role="img"
    >
      <text
        x="0"
        y={baselineY}
        fontFamily="var(--font-display)"
        fontSize={fontSize}
        fontWeight="800"
        fill={colors.tan}
        letterSpacing={tracking}
      >
        TAN
      </text>
      <text
        x={qeStart}
        y={baselineY}
        fontFamily="var(--font-display)"
        fontSize={fontSize}
        fontWeight="800"
        fill={colors.qe}
        letterSpacing={tracking}
      >
        QE
      </text>
    </svg>
  )
}
