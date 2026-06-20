'use client'

import { WeatherAlert } from '@/types'
import { getAlertSeverityColor } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { AlertTriangle, X } from 'lucide-react'
import { useState } from 'react'

interface AlertBannerProps {
  alerts: WeatherAlert[]
}

export function AlertBanner({ alerts }: AlertBannerProps) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())

  if (!alerts.length) return null

  const visibleAlerts = alerts.filter(a => !dismissed.has(a.headline))

  if (!visibleAlerts.length) return null

  return (
    <div className="space-y-3">
      {visibleAlerts.map((alert) => (
        <div
          key={alert.headline}
          className={cn(
            'rounded-xl border-2 p-4 relative',
            getAlertSeverityColor(alert.severity)
          )}
        >
          <button
            onClick={() => setDismissed(prev => new Set([...prev, alert.headline]))}
            className="absolute top-2 right-2 p-1 rounded-lg hover:bg-black/5 transition-colors"
            aria-label="Dismiss alert"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-start gap-3 pr-6">
            <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm">{alert.headline}</h4>
              <p className="text-sm mt-1 opacity-90">{alert.desc}</p>
              {alert.instruction && (
                <div className="mt-2 p-2.5 bg-white/50 rounded-lg">
                  <p className="text-xs font-medium opacity-80">What to do:</p>
                  <p className="text-sm mt-0.5">{alert.instruction}</p>
                </div>
              )}
              <p className="text-xs mt-2 opacity-70">
                Effective: {new Date(alert.effective).toLocaleString('en-NG')}
                {' &#8594; '}
                Expires: {new Date(alert.expires).toLocaleString('en-NG')}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
