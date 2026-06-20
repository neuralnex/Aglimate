'use client'

import { WeatherCurrent } from '@/types'
import { getWeatherIcon } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { MapPin, Droplets, Wind, Eye, Sun } from 'lucide-react'

interface WeatherCardProps {
  data: WeatherCurrent
}

export function WeatherCard({ data }: WeatherCardProps) {
  const { location, current } = data

  return (
    <div className="bg-gradient-to-br from-primary to-primary-dark text-white rounded-2xl p-5 sm:p-6 shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 text-white/90 mb-1">
            <MapPin className="h-4 w-4" />
            <span className="text-sm font-medium">{location.name}, {location.region}</span>
          </div>
          <p className="text-xs text-white/70">
            Updated: {new Date(location.localtime).toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <span className="text-5xl">{getWeatherIcon(current.condition.code)}</span>
      </div>

      <div className="flex items-end gap-3 mb-6">
        <span className="text-5xl sm:text-6xl font-bold">{Math.round(current.temp_c)}&#176;</span>
        <div className="mb-2">
          <p className="text-lg font-medium">{current.condition.text}</p>
          <p className="text-sm text-white/80">Feels like {Math.round(current.feelslike_c)}&#176;</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
          <Droplets className="h-4 w-4 text-white/80 mb-1" />
          <p className="text-lg font-semibold">{current.humidity}%</p>
          <p className="text-xs text-white/70">Humidity</p>
        </div>
        <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
          <Wind className="h-4 w-4 text-white/80 mb-1" />
          <p className="text-lg font-semibold">{current.wind_kph} <span className="text-sm">km/h</span></p>
          <p className="text-xs text-white/70">Wind {current.wind_dir}</p>
        </div>
        <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
          <Eye className="h-4 w-4 text-white/80 mb-1" />
          <p className="text-lg font-semibold">{current.precip_mm} <span className="text-sm">mm</span></p>
          <p className="text-xs text-white/70">Rain</p>
        </div>
        <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
          <Sun className="h-4 w-4 text-white/80 mb-1" />
          <p className="text-lg font-semibold">{current.uv}</p>
          <p className="text-xs text-white/70">UV Index</p>
        </div>
      </div>

      {current.air_quality && (
        <div className="mt-4 pt-4 border-t border-white/20">
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/80">Air Quality</span>
            <span className={cn(
              'px-2.5 py-1 rounded-full text-xs font-medium',
              current.air_quality['us-epa-index'] <= 2 ? 'bg-green-400/30 text-green-100' :
              current.air_quality['us-epa-index'] <= 4 ? 'bg-yellow-400/30 text-yellow-100' :
              'bg-red-400/30 text-red-100'
            )}>
              {current.air_quality['us-epa-index'] <= 2 ? 'Good' :
               current.air_quality['us-epa-index'] <= 4 ? 'Moderate' : 'Unhealthy'} ({current.air_quality['us-epa-index']})
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
