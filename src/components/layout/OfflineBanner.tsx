'use client'

import { useAppStore } from '@/lib/store'
import { WifiOff } from 'lucide-react'

export function OfflineBanner() {
  const { isOffline } = useAppStore()

  if (!isOffline) return null

  return (
    <div className="fixed top-14 sm:top-16 left-0 right-0 z-40 bg-warning/90 text-white text-center py-2 px-4 text-sm font-medium animate-fade-in">
      <div className="flex items-center justify-center gap-2">
        <WifiOff className="h-4 w-4" />
        <span>You are offline. Some features may not work.</span>
      </div>
    </div>
  )
}
