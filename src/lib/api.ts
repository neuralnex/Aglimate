import type { AdviseResponse } from '@/types'

declare global {
  interface Window {
    __AGLIMATE_API_URL__?: string
  }
}

// Inlined to avoid pulling @types/node; Next's bundler still rewrites
// process.env.NEXT_PUBLIC_* references at build time.
declare const process: { env: Record<string, string | undefined> }

// Resolves in priority order:
//   1. window.__AGLIMATE_API_URL__ (runtime-injected by layout, may be changed at runtime)
//   2. NEXT_PUBLIC_API_URL baked at build time
//   3. '' → same-origin. Used when the static Next export is served behind the
//      same FastAPI app on HF Spaces, so /advise hits the backend directly with
//      no CORS and no cold-start 503 from a dead external host.
function resolveApiBase(): string {
  if (typeof window !== 'undefined') {
    const injected = window.__AGLIMATE_API_URL__
    if (typeof injected === 'string' && injected.length > 0) return injected.replace(/\/+$/, '')
  }
  const envUrl = process.env.NEXT_PUBLIC_API_URL
  if (typeof envUrl === 'string' && envUrl.length > 0) return envUrl.replace(/\/+$/, '')
  return ''
}

let API_BASE = resolveApiBase()

// Re-read after the user pastes a URL into the missing-API panel.
export function resetApiBase(): void {
  API_BASE = resolveApiBase()
}

export function getApiBase(): string {
  return API_BASE
}

class APIError extends Error {
  status?: number
  constructor(message: string, status?: number) {
    super(message)
    this.name = 'APIError'
    this.status = status
  }
}

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 120000): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  // If caller provides a signal, abort the timeout controller when that signal aborts
  if (options.signal) {
    options.signal.addEventListener('abort', () => controller.abort())
  }

  try {
    const response = await fetch(url, { ...options, signal: controller.signal })
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    if (error instanceof Error && error.name === 'AbortError') {
      throw new APIError('Request timed out. Please try again.')
    }
    throw error
  }
}

export interface AdviseRequest {
  query: string
  crop?: string
  growthStage?: string
  latitude?: number
  longitude?: number
  photo?: File
}

export const api = {
  async healthCheck(): Promise<{ status: string; models?: Record<string, string> }> {
    const response = await fetchWithTimeout(`${API_BASE}/health`, {}, 10000)
    if (!response.ok) throw new APIError(`Health check failed (${response.status})`, response.status)
    return response.json()
  },

  async advise(data: AdviseRequest, signal?: AbortSignal): Promise<AdviseResponse> {
    const formData = new FormData()
    formData.append('query', data.query)
    if (data.crop) formData.append('crop', data.crop)
    if (data.growthStage) formData.append('growth_stage', data.growthStage)
    if (data.latitude !== undefined) formData.append('latitude', String(data.latitude))
    if (data.longitude !== undefined) formData.append('longitude', String(data.longitude))
    if (data.photo) formData.append('photo', data.photo)

    const response = await fetchWithTimeout(
      `${API_BASE}/advise`,
      { method: 'POST', body: formData, signal },
      1200000,
    )

    if (!response.ok) {
      if (response.status === 429) throw new APIError('Too many requests. Please wait a moment.', 429)
      const detail = response.status === 404
        ? 'Advisory endpoint not found. The backend may be at a different URL.'
        : `Advisory request failed (${response.status})`
      throw new APIError(detail, response.status)
    }

    return response.json()
  },
}

export { APIError }
