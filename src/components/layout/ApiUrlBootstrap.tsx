'use client'

import { useEffect } from 'react'
import { resetApiBase } from '@/lib/api'

// If a user pastes a backend URL into the missing-API panel, we save it to
// localStorage and re-read the API base on next mount so the request actually
// uses it.
export function ApiUrlBootstrap() {
  useEffect(() => {
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem('aglimate_api_url') : null
    if (stored && stored.length > 0 && stored !== window.__AGLIMATE_API_URL__) {
      window.__AGLIMATE_API_URL__ = stored
      resetApiBase()
    }
    // Re-resolve at mount even if nothing changed, in case the inline script
    // for some reason ran with a stale value.
    resetApiBase()
  }, [])
  return null
}
