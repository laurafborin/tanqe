const BRL = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
})

const BRL_INT = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

const NUM = new Intl.NumberFormat('pt-BR')

const NUM2 = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const NUM3 = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 3,
  maximumFractionDigits: 3,
})

export function formatBRL(n: number, integer = false): string {
  if (!Number.isFinite(n)) return 'R$ —'
  return integer ? BRL_INT.format(n) : BRL.format(n)
}

export function formatBRLPerL(n: number): string {
  return `${NUM3.format(n)} R$/L`.replace(NUM3.format(n), formatBRL(n).replace('R$', '')) || `R$ ${NUM3.format(n)}/L`
}

export function formatPrecoLitro(n: number): string {
  return `R$ ${NUM3.format(n)}/L`
}

export function formatLitros(n: number, unit = 'L'): string {
  return `${NUM.format(Math.round(n))} ${unit}`
}

export function formatNumber(n: number, decimals = 0): string {
  return decimals === 2 ? NUM2.format(n) : NUM.format(Math.round(n))
}

export function formatPct(n: number, decimals = 1, withSign = false): string {
  const v = (n * (n < 1 && n > -1 ? 100 : 1)).toFixed(decimals).replace('.', ',')
  const sign = withSign && n > 0 ? '+' : ''
  return `${sign}${v}%`
}

export function formatPctRaw(n: number, decimals = 1, withSign = false): string {
  const v = n.toFixed(decimals).replace('.', ',')
  const sign = withSign && n > 0 ? '+' : ''
  return `${sign}${v}%`
}

export function formatData(iso: string): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('pt-BR')
}

export function formatDataHora(iso: string): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return '—'
  return `${d.toLocaleDateString('pt-BR')} ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
}

export function formatHora(iso: string): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

export function timeAgo(iso: string): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return '—'
  const diffMs = Date.now() - d.getTime()
  const min = Math.floor(diffMs / 60000)
  if (min < 1) return 'agora'
  if (min < 60) return `há ${min}min`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `há ${hr}h`
  const days = Math.floor(hr / 24)
  if (days < 7) return `há ${days}d`
  if (days < 30) return `há ${Math.floor(days / 7)}sem`
  return formatData(iso)
}

export function timeUntil(iso: string): { h: number; m: number; s: number; total: number } {
  const target = new Date(iso).getTime()
  const diff = target - Date.now()
  if (diff <= 0) return { h: 0, m: 0, s: 0, total: 0 }
  const total = Math.floor(diff / 1000)
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  return { h, m, s, total }
}

export function formatCountdown(iso: string): string {
  const { h, m, s, total } = timeUntil(iso)
  if (total === 0) return 'encerrado'
  if (h >= 24) {
    const d = Math.floor(h / 24)
    return `${d}d ${h % 24}h`
  }
  if (h > 0) return `${h}h ${String(m).padStart(2, '0')}m`
  if (m > 0) return `${m}m ${String(s).padStart(2, '0')}s`
  return `${s}s`
}

export function formatCNPJ(cnpj: string): string {
  return cnpj
}

export function formatChaveAcesso(chave: string): string {
  if (!chave) return '—'
  return chave.replace(/(.{4})/g, '$1 ').trim()
}
