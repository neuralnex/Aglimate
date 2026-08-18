'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { LANGUAGE_MAP, SupportedLanguage } from '@/types'
import { cn } from '@/lib/utils'
import { Sprout, Globe } from 'lucide-react'

export function Header() {
  const [langMenuOpen, setLangMenuOpen] = useState(false)
  const { settings, updateSettings } = useAppStore()

  const handleLanguageChange = (lang: SupportedLanguage) => {
    updateSettings({ language: lang })
    setLangMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 bg-primary text-white shadow-md">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <div className="flex items-center gap-2">
            <Sprout className="h-7 w-7 text-accent" />
            <div>
              <p className="text-lg sm:text-xl font-bold tracking-tight leading-none">Aglimate</p>
              <p className="text-[11px] sm:text-xs text-white/70 leading-none mt-0.5">Farmer-first climate advisory</p>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white/90 hover:bg-white/10 transition-colors min-h-[44px]"
              aria-label="Change language"
            >
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">
                {LANGUAGE_MAP[settings.language as SupportedLanguage]?.native || 'English'}
              </span>
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
        </div>
      </div>
    </header>
  )
}
