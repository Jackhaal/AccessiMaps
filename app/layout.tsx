
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import '@/lib/types'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AccessiMaps - Accessibilité pour tous',
  description: 'Trouvez et évaluez l\'accessibilité des lieux publics en France',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
