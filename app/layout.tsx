import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import { SessionProvider } from '@/components/session-provider'
import './globals.css'

export const metadata: Metadata = {
  title: 'SystemGen - Generador de Software con IA',
  description: 'Plataforma de generación de software personalizado con inteligencia artificial',
  generator: 'SystemGen',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <SessionProvider>
          {children}
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  )
}
