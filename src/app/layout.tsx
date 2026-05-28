import type { Metadata } from 'next'
import { Sora, DM_Sans, DM_Mono } from 'next/font/google'
import '../styles/tokens.css'
import './globals.css'
import { ToastProvider } from '@/components/ui/Toast'

const sora = Sora({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-sora',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-body-loaded',
  display: 'swap',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono-loaded',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'TANQE — Negocie combustível com inteligência',
  description:
    'A plataforma B2B de leilão reverso que digitaliza a negociação de combustíveis e empodera o posto bandeira branca.',
  openGraph: {
    title: 'TANQE — Negocie combustível com inteligência',
    description: 'Leilão reverso de combustíveis para postos independentes.',
    locale: 'pt_BR',
    type: 'website',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${sora.variable} ${dmSans.variable} ${dmMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  )
}
