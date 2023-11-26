import { Inter } from 'next/font/google'
import './globals.css'
import Providers from './Providers'
import Header from '@/components/header'
const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ArmozaChess',
  description: 'Chess CentroCulturalArmoza',
  icons: {
    icon: '/logo.png',
  }
}

export default function RootLayout({
  children,
}){
  return (
    <html lang="en">
        <body className={inter.className}>
          <Providers><Header />{children}</Providers>
        </body>
    </html>
  )
}
