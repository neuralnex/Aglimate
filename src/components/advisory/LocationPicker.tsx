'use client'

import { useState, useCallback } from 'react'
import { useGeolocation } from '@/hooks/useGeolocation'
import { NIGERIAN_STATES } from '@/types'
import { cn } from '@/lib/utils'
import { Navigation, Search, Check } from 'lucide-react'
import { Input } from '@/components/ui/Input'

interface LocationPickerProps {
  latitude: number | null
  longitude: number | null
  locationName: string | null
  onLocationChange: (lat: number | null, lon: number | null, name: string | null) => void
}

export function LocationPicker({ latitude, longitude, locationName, onLocationChange }: LocationPickerProps) {
  const { getLocation, isLoading: geoLoading, error: geoError, isSupported } = useGeolocation()
  const [searchQuery, setSearchQuery] = useState('')
  const [showStates, setShowStates] = useState(false)

  const handleUseLocation = useCallback(() => {
    getLocation()
  }, [getLocation])

  const handleSelectState = useCallback((state: string) => {
    onLocationChange(null, null, `${state}, Nigeria`)
    setShowStates(false)
  }, [onLocationChange])

  const hasLocation = latitude !== null || locationName !== null

  return (
    <div className="space-y-4">
      {/* GPS Button */}
      {isSupported && (
        <button
          onClick={handleUseLocation}
          disabled={geoLoading}
          className={cn(
            'w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-colors',
            hasLocation && latitude
              ? 'border-primary bg-primary/5 text-primary'
              : 'border-gray-200 hover:border-primary hover:bg-gray-50'
          )}
        >
          <Navigation className={cn('h-5 w-5', geoLoading && 'animate-spin')} />
          <span className="font-medium">
            {geoLoading ? 'Getting location...' :
             hasLocation && latitude ? `${locationName || 'Current Location'}` :
             'Use My Current Location'}
          </span>
        </button>
      )}

      {geoError && (
        <p className="text-sm text-error bg-error/10 p-3 rounded-lg">{geoError}</p>
      )}

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-3 text-sm text-text-muted">or select manually</span>
        </div>
      </div>

      {/* State Search */}
      <div className="relative">
        <button
          onClick={() => setShowStates(!showStates)}
          className={cn(
            'w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-colors',
            showStates ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200 hover:border-gray-300'
          )}
        >
          <span className={locationName ? 'text-text font-medium' : 'text-text-muted'}>
            {locationName || 'Select state or city...'}
          </span>
          <Search className="h-4 w-4 text-text-muted" />
        </button>

        {showStates && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
            <div className="p-2">
              <Input
                placeholder="Search states..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mb-2"
              />
            </div>
            {NIGERIAN_STATES.filter(s => 
              s.toLowerCase().includes(searchQuery.toLowerCase())
            ).map(state => (
              <button
                key={state}
                onClick={() => handleSelectState(state)}
                className={cn(
                  'w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors flex items-center justify-between',
                  locationName?.includes(state) && 'bg-primary/5 text-primary font-medium'
                )}
              >
                {state}
                {locationName?.includes(state) && <Check className="h-4 w-4" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
