import { AskResponse, AdviseResponse, WeatherCurrent, WeatherForecast, WeatherAlert } from '@/types'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://aglimate.onrender.com'

class APIError extends Error {
  constructor(message: string, public status?: number) {
    super(message)
    this.name = 'APIError'
  }
}

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 30000): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    })
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    if (error instanceof Error && error.name === 'AbortError') {
      throw new APIError('Request timed out. Please check your connection.')
    }
    throw error
  }
}

export const api = {
  // Health check
  async healthCheck(): Promise<{ status: string; models?: Record<string, string> }> {
    const response = await fetchWithTimeout(`${API_BASE}/health`)
    if (!response.ok) throw new APIError('Health check failed', response.status)
    return response.json()
  },

  // Ask endpoint
  async ask(query: string, sessionId?: string, language?: string): Promise<AskResponse> {
    const response = await fetchWithTimeout(`${API_BASE}/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        session_id: sessionId || undefined,
        language: language || undefined,
      }),
    }, 60000)

    if (!response.ok) {
      if (response.status === 429) throw new APIError('Too many requests. Please wait a moment.')
      throw new APIError('Failed to get response', response.status)
    }

    return response.json()
  },

  // Advise endpoint (multimodal)
  async advise(data: {
    query: string
    sessionId?: string
    latitude?: number
    longitude?: number
    photo?: File
    video?: File
  }): Promise<AdviseResponse> {
    const formData = new FormData()
    formData.append('query', data.query)
    if (data.sessionId) formData.append('session_id', data.sessionId)
    if (data.latitude !== undefined) formData.append('latitude', data.latitude.toString())
    if (data.longitude !== undefined) formData.append('longitude', data.longitude.toString())
    if (data.photo) formData.append('photo', data.photo)
    if (data.video) formData.append('video', data.video)

    const response = await fetchWithTimeout(`${API_BASE}/advise`, {
      method: 'POST',
      body: formData,
    }, 120000)

    if (!response.ok) {
      if (response.status === 429) throw new APIError('Too many requests. Please wait a moment.')
      throw new APIError('Advisory request failed', response.status)
    }

    return response.json()
  },

  // Weather endpoints
  async getCurrentWeather(params: {
    q?: string
    state?: string
    lat?: number
    lon?: number
    aqi?: string
  }): Promise<WeatherCurrent> {
    const query = new URLSearchParams()
    if (params.q) query.append('q', params.q)
    if (params.state) query.append('state', params.state)
    if (params.lat !== undefined) query.append('lat', params.lat.toString())
    if (params.lon !== undefined) query.append('lon', params.lon.toString())
    if (params.aqi) query.append('aqi', params.aqi)

    const response = await fetchWithTimeout(`${API_BASE}/weather/current?${query}`)
    if (!response.ok) throw new APIError('Failed to fetch weather', response.status)
    return response.json()
  },

  async getForecast(params: {
    q?: string
    state?: string
    lat?: number
    lon?: number
    days?: number
    aqi?: string
    alerts?: string
  }): Promise<WeatherForecast> {
    const query = new URLSearchParams()
    if (params.q) query.append('q', params.q)
    if (params.state) query.append('state', params.state)
    if (params.lat !== undefined) query.append('lat', params.lat.toString())
    if (params.lon !== undefined) query.append('lon', params.lon.toString())
    if (params.days) query.append('days', params.days.toString())
    if (params.aqi) query.append('aqi', params.aqi)
    if (params.alerts) query.append('alerts', params.alerts)

    const response = await fetchWithTimeout(`${API_BASE}/weather/forecast?${query}`)
    if (!response.ok) throw new APIError('Failed to fetch forecast', response.status)
    return response.json()
  },

  async getAlerts(params: {
    q?: string
    state?: string
    lat?: number
    lon?: number
  }): Promise<{ alerts: WeatherAlert[] }> {
    const query = new URLSearchParams()
    if (params.q) query.append('q', params.q)
    if (params.state) query.append('state', params.state)
    if (params.lat !== undefined) query.append('lat', params.lat.toString())
    if (params.lon !== undefined) query.append('lon', params.lon.toString())

    const response = await fetchWithTimeout(`${API_BASE}/weather-alerts?${query}`)
    if (!response.ok) throw new APIError('Failed to fetch alerts', response.status)
    return response.json()
  },

  async searchLocation(q: string): Promise<Array<{ name: string; region: string; country: string }>> {
    const response = await fetchWithTimeout(`${API_BASE}/weather/search?q=${encodeURIComponent(q)}`)
    if (!response.ok) throw new APIError('Search failed', response.status)
    return response.json()
  },
}

export { APIError }
