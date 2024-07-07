import { Providers } from '@/providers/Providers'
import { Topbar } from '@/components/Topbar'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Genitive Network',
  description: 'The First FHE-based Native Bitcoin Layer2 Cross-chain Bridge',
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
  },

  icons: {
    icon: '/icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <Topbar />
          {children}
        </Providers>
      </body>
    </html>
  )
}
