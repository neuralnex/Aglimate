'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import { LANGUAGE_MAP, SupportedLanguage } from '@/types'
import { cn } from '@/lib/utils'
import { Menu, X, Sprout, Settings, Globe } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/chat', label: 'Chat' },
  { href: '/advisory', label: 'Advisory' },
  { href: '/weather', label: 'Weather' },
  { href: '/knowledge', label: 'Learn' },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [langMenuOpen, setLangMenuOpen] = useState(false)
  const { settings, updateSettings, sidebarOpen, setSidebarOpen } = useAppStore()
  const pathname = usePathname()

  const handleLanguageChange = (lang: SupportedLanguage) => {
    updateSettings({ language: lang })
    setLangMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 bg-primary text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Sprout className="h-7 w-7 text-accent" />
            <span className="text-lg sm:text-xl font-bold tracking-tight">Aglimate</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors min-h-[40px]',
                  pathname === item.href
                    ? 'bg-white/20 text-white'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white/90 hover:bg-white/10 transition-colors"
                aria-label="Change language"
              >
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">{LANGUAGE_MAP[settings.language as SupportedLanguage]?.native || 'English'}</span>
              </button>

              {langMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setLangMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 animate-fade-in">
                    {Object.entries(LANGUAGE_MAP).map(([code, info]) => (
                      <button
                        key={code}
                        onClick={() => handleLanguageChange(code as SupportedLanguage)}
                        className={cn(
                          'w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors flex items-center gap-2',
                          settings.language === code ? 'text-primary font-medium bg-primary/5' : 'text-text'
                        )}
                      >
                        <span>{info.flag}</span>
                        <span>{info.native}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Settings */}
            <Link
              href="/settings"
              className={cn(
                'p-2 rounded-lg transition-colors',
                pathname === '/settings'
                  ? 'bg-white/20'
                  : 'hover:bg-white/10'
              )}
              aria-label="Settings"
            >
              <Settings className="h-5 w-5" />
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-primary-dark border-t border-white/10 animate-slide-up safe-area-inset-top">
          <nav className="px-4 py-3 space-y-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'block px-4 py-3 rounded-lg text-base font-medium transition-colors min-h-[44px]',
                  pathname === item.href
                    ? 'bg-white/20 text-white'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
