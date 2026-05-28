import Image from 'next/image'

type LogoVariant = 'dark' | 'light'
type LogoSize = 'sm' | 'md' | 'lg'

interface LogoProps {
  variant?: LogoVariant
  size?: LogoSize
  showSymbol?: boolean
  symbolOnly?: boolean
  className?: string
}

const SIZE_MAP: Record<LogoSize, { symbol: number; fontSize: number; gap: number }> = {
  sm: { symbol: 24, fontSize: 17, gap: 8 },
  md: { symbol: 36, fontSize: 25, gap: 12 },
  lg: { symbol: 64, fontSize: 44, gap: 18 },
}

export function Logo({
  variant = 'dark',
  size = 'md',
  showSymbol = true,
  symbolOnly = false,
  className = '',
}: LogoProps) {
  const { symbol, fontSize, gap } = SIZE_MAP[size]
  // dark = fundo escuro (TAN claro). light = fundo claro (TAN escuro). QE sempre laranja.
  const tanColor = variant === 'dark' ? '#F7F5F1' : '#1C1B19'
  const qeColor = '#E8581A'

  if (symbolOnly) {
    return (
      <span
        aria-label="TANQE"
        role="img"
        className={className}
        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Image
          src="/simbolo-tanqe.png"
          alt="TANQE"
          width={symbol}
          height={symbol}
          style={{ width: symbol, height: symbol, objectFit: 'contain' }}
          priority
        />
      </span>
    )
  }

  return (
    <span
      aria-label="TANQE"
      role="img"
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap,
        lineHeight: 1,
      }}
    >
      {showSymbol && (
        <Image
          src="/simbolo-tanqe.png"
          alt=""
          width={symbol}
          height={symbol}
          style={{ width: symbol, height: symbol, objectFit: 'contain', flexShrink: 0 }}
          priority
        />
      )}
      <span
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
    </span>
  )
}
