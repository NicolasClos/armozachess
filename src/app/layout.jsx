import { Inter } from 'next/font/google'
import './globals.css'
import Providers from './Providers'
import Header from '@/components/header'
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ArmozaChess',
  description: 'Crea tu Torneo Suizo de Ajedrez',
  icons: {
    icon: '/logo.png',
  }
}

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers><Header />{children}</Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
