import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { OfflineBanner } from '@/components/layout/OfflineBanner'
import { ApiUrlBootstrap } from '@/components/layout/ApiUrlBootstrap'
import { apiUrlBootstrapScript } from '@/components/layout/layoutConfig'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Aglimate — Farmer-First Climate Advisory',
  description: 'AI-powered agricultural advice for smallholder farmers, starting with climate.',
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: apiUrlBootstrapScript() }} />
      </head>
      <body className={`${inter.className} bg-background text-text antialiased`}>
        <ApiUrlBootstrap />
        <Header />
        <OfflineBanner />
        <main className="min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </body>
    </html>
  )
}
