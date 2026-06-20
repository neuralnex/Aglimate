import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { BottomNav } from '@/components/layout/BottomNav'
import { OfflineBanner } from '@/components/layout/OfflineBanner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Aglimate - Farmer-First Climate Advisory',
  description: 'AI-powered agricultural advice for Nigerian smallholder farmers',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon-192x192.png',
    apple: '/icon-192x192.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#2E7D32',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-text antialiased`}>
        <Header />
        <OfflineBanner />
        <main className="pb-20 md:pb-6 min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-4rem)] safe-area-inset-bottom">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  )
}
