'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { SupportedLanguage, LANGUAGE_MAP } from '@/types'

interface AppState {
  settings: { language: SupportedLanguage }
  isOffline: boolean
  updateSettings: (settings: Partial<AppState['settings']>) => void
  setOffline: (isOffline: boolean) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      settings: { language: 'en' },
      isOffline: false,
      updateSettings: (newSettings) =>
        set((state) => ({ settings: { ...state.settings, ...newSettings } })),
      setOffline: (isOffline) => set({ isOffline }),
    }),
    {
      name: 'aglimate-storage',
      partialize: (state) => ({ settings: state.settings }),
    },
  ),
)
