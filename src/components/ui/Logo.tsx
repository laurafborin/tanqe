type LogoVariant = 'dark' | 'light' | 'light-orange' | 'orange'

type LogoProps = {
  variant?: LogoVariant
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  showMark?: boolean
  showTagline?: boolean
  className?: string
}

const FONT_SIZES: Record<NonNullable<LogoProps['size']>, number> = {
  xs: 14,
  sm: 22,
  md: 36,
  lg: 64,
  xl: 96,
}

export function Logo({
  variant = 'light-orange',
  size = 'md',
  showMark = true,
  showTagline = false,
  className = '',
}: LogoProps) {
  const fontSize = FONT_SIZES[size]
  const tracking = -fontSize * 0.04

  // Variant colors: QE é SEMPRE laranja na identidade atual.
  // O variant só controla a cor do TAN (TAN dark p/ fundos claros, TAN white p/ fundos escuros).
  const isDark = variant === 'dark'
  const tanColor = isDark ? '#0F0F0E' : '#FFFFFF'
  const qeColor = '#E8581A'
  const taglineColor = isDark ? 'rgba(15,15,14,0.55)' : 'rgba(255,255,255,0.55)'
  const taglineAccent = '#E8581A'

  // --- Wordmark proportions
  const tanWidth = fontSize * 1.78
  const wordGap = fontSize * 0.04
  const qeWidth = fontSize * 1.32

  // --- Mark proportions (hexágono com T dentro)
  const markH = fontSize * 1.32
  const markW = markH * 0.94
  const markGap = showMark ? fontSize * 0.34 : 0

  // --- Tagline ("Plataforma inteligente de combustíveis")
  const taglineFs = Math.max(fontSize * 0.28, 9)
  const taglineSpacing = taglineFs * 0.16
  const taglineGap = fontSize * 0.18
  // Comprimento aproximado da string tagline em letterSpacing ~0.16em
  const taglineW = taglineFs * 27.5

  // --- Geometria do hexágono (pointy-top: ponta em cima e em baixo, lados retos esq/dir)
  // Pontos do polígono dentro de markW × markH
  const sw = Math.max(2, fontSize * 0.075)
  const pad = sw / 2
  const cx = markW / 2
  const cy = markH / 2
  const halfW = markW / 2 - pad
  const halfH = markH / 2 - pad
  const qH = halfH * 0.5 // quarter height (y do ombro)
  const hexPoints = [
    `${cx},${cy - halfH}`,
    `${cx + halfW},${cy - qH}`,
    `${cx + halfW},${cy + qH}`,
    `${cx},${cy + halfH}`,
    `${cx - halfW},${cy + qH}`,
    `${cx - halfW},${cy - qH}`,
  ].join(' ')

  // --- T estilizado dentro do hexágono
  // Top bar + stem com leve corte angular no canto inferior direito (lembra a versão estilizada)
  const tBarTop = markH * 0.30
  const tBarH = markH * 0.13
  const tBarLeft = markW * 0.22
  const tBarRight = markW * 0.78
  const tStemW = markW * 0.22
  const tStemX1 = cx - tStemW / 2
  const tStemX2 = cx + tStemW / 2
  const tBottom = markH * 0.78
  const tCut = markW * 0.06
  // path: barra superior + stem com chanfro inferior direito
  const tPath = [
    `M ${tBarLeft},${tBarTop}`,
    `L ${tBarRight},${tBarTop}`,
    `L ${tBarRight},${tBarTop + tBarH}`,
    `L ${tStemX2},${tBarTop + tBarH}`,
    `L ${tStemX2},${tBottom - tCut}`,
    `L ${tStemX2 - tCut},${tBottom}`,
    `L ${tStemX1},${tBottom}`,
    `L ${tStemX1},${tBarTop + tBarH}`,
    `L ${tBarLeft},${tBarTop + tBarH}`,
    'Z',
  ].join(' ')

  // --- Posicionamento final
  const wordmarkX = showMark ? markW + markGap : 0
  const wordmarkW = tanWidth + wordGap + qeWidth
  const taglineActualW = showTagline ? Math.max(taglineW, wordmarkW) : 0
  const totalWidth = Math.max(wordmarkX + wordmarkW, showTagline ? wordmarkX + taglineActualW : 0)

  const lineHeight = fontSize * 1.06
  const baseHeight = Math.max(markH, lineHeight)
  const totalHeight = baseHeight + (showTagline ? taglineGap + taglineFs * 1.2 : 0)

  const markY = (baseHeight - markH) / 2
  const baselineY = (baseHeight - lineHeight) / 2 + lineHeight * 0.82
  const taglineY = baseHeight + taglineGap + taglineFs * 0.86

  // ID único pro gradient (evita colisão quando múltiplos Logos coexistem)
  const gradId = `tanqe-grad-${variant}-${size}`

  return (
    <svg
      width={totalWidth}
      height={totalHeight}
      viewBox={`0 0 ${totalWidth} ${totalHeight}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="TANQE — Plataforma inteligente de combustíveis"
      role="img"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F4874A" />
          <stop offset="55%" stopColor="#E8581A" />
          <stop offset="100%" stopColor="#C23F06" />
        </linearGradient>
      </defs>

      {/* Mark hexagonal com T */}
      {showMark && (
        <g transform={`translate(0 ${markY})`}>
          <polygon
            points={hexPoints}
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth={sw}
            strokeLinejoin="miter"
            strokeLinecap="square"
          />
          <path d={tPath} fill={`url(#${gradId})`} />
        </g>
      )}

      {/* Wordmark TAN */}
      <text
        x={wordmarkX}
        y={baselineY}
        fontFamily="var(--font-display)"
        fontSize={fontSize}
        fontWeight="800"
        fill={tanColor}
        letterSpacing={tracking}
      >
        TAN
      </text>
      {/* Wordmark QE */}
      <text
        x={wordmarkX + tanWidth + wordGap}
        y={baselineY}
        fontFamily="var(--font-display)"
        fontSize={fontSize}
        fontWeight="800"
        fill={qeColor}
        letterSpacing={tracking}
      >
        QE
      </text>

      {/* Tagline opcional */}
      {showTagline && (
        <text
          x={wordmarkX}
          y={taglineY}
          fontFamily="var(--font-mono)"
          fontSize={taglineFs}
          fontWeight="500"
          fill={taglineColor}
          letterSpacing={taglineSpacing}
        >
          PLATAFORMA INTELIGENTE DE{' '}
          <tspan fill={taglineAccent}>COMBUSTÍVEIS</tspan>
          {' /'}
        </text>
      )}
    </svg>
  )
}
