'use client'

import { useState } from 'react'
import { useWeather } from '@/hooks/useWeather'
import { WeatherCard } from '@/components/weather/WeatherCard'
import { ForecastStrip } from '@/components/weather/ForecastStrip'
import { AlertBanner } from '@/components/weather/AlertBanner'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

type WeatherTab = 'current' | 'forecast' | 'alerts'

export default function WeatherPage() {
  const [activeTab, setActiveTab] = useState<WeatherTab>('current')
  const { current, forecast, alerts, isLoading, error, refetch } = useWeather()

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Weather</h1>
        <Button variant="ghost" size="sm" onClick={refetch} disabled={isLoading}>
          <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-gray-100 rounded-xl">
        {([
          { key: 'current', label: 'Current' },
          { key: 'forecast', label: 'Forecast' },
          { key: 'alerts', label: `Alerts${alerts.length ? ` (${alerts.length})` : ''}` },
        ] as const).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'flex-1 py-2.5 text-sm font-medium rounded-lg transition-all',
              activeTab === tab.key
                ? 'bg-white text-primary shadow-sm'
                : 'text-text-muted hover:text-text'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading && !current && (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {error && (
        <div className="p-4 bg-error/10 border border-error/20 rounded-xl text-error text-center">
          <p className="font-medium">{error}</p>
          <Button variant="outline" size="sm" onClick={refetch} className="mt-3">
            Try Again
          </Button>
        </div>
      )}

      {/* Current Tab */}
      {activeTab === 'current' && current && (
        <div className="animate-fade-in">
          <WeatherCard data={current} />
        </div>
      )}

      {/* Forecast Tab */}
      {activeTab === 'forecast' && forecast && (
        <div className="animate-fade-in space-y-4">
          <WeatherCard data={current || forecast} />
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="font-semibold text-text mb-4">7-Day Forecast</h3>
            <ForecastStrip days={forecast.forecast.forecastday} />
          </div>
        </div>
      )}

      {/* Alerts Tab */}
      {activeTab === 'alerts' && (
        <div className="animate-fade-in">
          {alerts.length > 0 ? (
            <AlertBanner alerts={alerts} />
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✓</span>
              </div>
              <h3 className="text-lg font-semibold text-text">No Active Alerts</h3>
              <p className="text-text-secondary mt-1">Weather conditions are normal for your area.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
