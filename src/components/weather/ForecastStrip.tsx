'use client'

import { WeatherForecastDay } from '@/types'
import { getWeatherIcon } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface ForecastStripProps {
  days: WeatherForecastDay[]
}

export function ForecastStrip({ days }: ForecastStripProps) {
  const [selectedDay, setSelectedDay] = useState<string | null>(null)

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {days.map((day) => (
          <button
            key={day.date}
            onClick={() => setSelectedDay(selectedDay === day.date ? null : day.date)}
            className={cn(
              'flex flex-col items-center min-w-[72px] p-3 rounded-xl border-2 transition-all',
              selectedDay === day.date
                ? 'border-primary bg-primary/5'
                : 'border-transparent bg-white hover:bg-gray-50'
            )}
          >
            <span className="text-xs text-text-muted mb-1">
              {new Date(day.date).toLocaleDateString('en-NG', { weekday: 'short' })}
            </span>
            <span className="text-2xl mb-1">{getWeatherIcon(day.day.condition.code)}</span>
            <span className="text-sm font-semibold text-text">{Math.round(day.day.maxtemp_c)}&#176;</span>
            <span className="text-xs text-text-muted">{Math.round(day.day.mintemp_c)}&#176;</span>
          </button>
        ))}
      </div>

      {selectedDay && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 animate-slide-up">
          {days.filter(d => d.date === selectedDay).map(day => (
            <div key={day.date}>
              <h4 className="font-semibold text-text mb-2">
                {new Date(day.date).toLocaleDateString('en-NG', { weekday: 'long', day: 'numeric', month: 'long' })}
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                <div>
                  <span className="text-text-muted">Condition</span>
                  <p className="font-medium text-text">{day.day.condition.text}</p>
                </div>
                <div>
                  <span className="text-text-muted">Humidity</span>
                  <p className="font-medium text-text">{day.day.avghumidity}%</p>
                </div>
                <div>
                  <span className="text-text-muted">Rain</span>
                  <p className="font-medium text-text">{day.day.totalprecip_mm} mm</p>
                </div>
                <div>
                  <span className="text-text-muted">UV</span>
                  <p className="font-medium text-text">{day.day.uv}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
