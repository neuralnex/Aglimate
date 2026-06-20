'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAppStore } from '@/lib/store'
import { api } from '@/lib/api'
import { WeatherCurrent, WeatherForecast, WeatherAlert } from '@/types'

export function useWeather() {
  const [current, setCurrent] = useState<WeatherCurrent | null>(null)
  const [forecast, setForecast] = useState<WeatherForecast | null>(null)
  const [alerts, setAlerts] = useState<WeatherAlert[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { settings } = useAppStore()

  const fetchWeather = useCallback(async () => {
    if (!settings.location && !settings.lat) return

    setIsLoading(true)
    setError(null)

    const params = settings.lat && settings.lon
      ? { lat: settings.lat, lon: settings.lon, aqi: 'yes' }
      : { q: settings.location || 'Lagos,Nigeria', aqi: 'yes' }

    try {
      const [currentData, forecastData, alertsData] = await Promise.all([
        api.getCurrentWeather(params),
        api.getForecast({ ...params, days: 7, alerts: 'yes' }),
        api.getAlerts(params),
      ])

      setCurrent(currentData)
      setForecast(forecastData)
      setAlerts(alertsData.alerts || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather')
    } finally {
      setIsLoading(false)
    }
  }, [settings.location, settings.lat, settings.lon])

  useEffect(() => {
    fetchWeather()
  }, [fetchWeather])

  return {
    current,
    forecast,
    alerts,
    isLoading,
    error,
    refetch: fetchWeather,
  }
}
