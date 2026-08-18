'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { api, getApiBase, resetApiBase } from '@/lib/api'
import { AdviseResponse, COMMON_CROPS, GROWTH_STAGES } from '@/types'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { PhotoUploader } from '@/components/advisory/PhotoUploader'
import { LocationPicker } from '@/components/advisory/LocationPicker'
import {
  Sprout,
  RotateCcw,
  AlertTriangle,
  Cloud,
  Database,
  Droplets,
  Sun,
  Thermometer,
  Wifi,
  WifiOff,
  CheckCircle2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type Status = 'idle' | 'loading' | 'result' | 'error'

const TAG_CHIPS = ['Leaves yellowing', 'Pests visible', 'Water issue', 'Not growing', 'Wilting']

export default function HomePage() {
  const [status, setStatus] = useState<Status>('idle')
  const [response, setResponse] = useState<AdviseResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [query, setQuery] = useState('')
  const [crop, setCrop] = useState('')
  const [growthStage, setGrowthStage] = useState('')
  const [photo, setPhoto] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [lat, setLat] = useState<number | null>(null)
  const [lon, setLon] = useState<number | null>(null)
  const [locationName, setLocationName] = useState<string | null>(null)

  const [showPhoto, setShowPhoto] = useState(false)
  const [showLocation, setShowLocation] = useState(false)
  const [healthBanner, setHealthBanner] = useState<{ ok: boolean; message: string } | null>(null)

  const [apiBaseMissing, setApiBaseMissing] = useState(false)
  useEffect(() => {
    const injected = typeof window !== 'undefined' ? (window.__AGLIMATE_API_URL__ ?? '') : ''
    setApiBaseMissing(getApiBase().length === 0 && injected.length === 0)
  }, [])

  const handlePhotoChange = (next: File | null) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPhoto(next)
    setPreviewUrl(next ? URL.createObjectURL(next) : null)
  }

  const handleLocationChange = (nextLat: number | null, nextLon: number | null, name: string | null) => {
    setLat(nextLat)
    setLon(nextLon)
    setLocationName(name)
  }

  const appendChip = (chip: string) => {
    setQuery((prev) => (prev.trim() ? `${prev} ${chip.toLowerCase()}` : `${chip.toLowerCase()}`))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    setStatus('loading')
    setError(null)
    setHealthBanner(null)

    try {
      const result = await api.advise({
        query: query.trim(),
        crop: crop.trim() || undefined,
        growthStage: growthStage.trim() || undefined,
        latitude: lat ?? undefined,
        longitude: lon ?? undefined,
        photo: photo ?? undefined,
      })
      setResponse(result)
      setStatus('result')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get advisory')
      setStatus('error')
    }
  }

  const handleReset = () => {
    setStatus('idle')
    setResponse(null)
    setError(null)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setQuery('')
    setCrop('')
    setGrowthStage('')
    setPhoto(null)
    setPreviewUrl(null)
    setLat(null)
    setLon(null)
    setLocationName(null)
    setShowPhoto(false)
    setShowLocation(false)
  }

  const testConnection = async () => {
    setHealthBanner(null)
    try {
      await api.healthCheck()
      setHealthBanner({ ok: true, message: 'Backend reachable.' })
    } catch (err) {
      setHealthBanner({
        ok: false,
        message: `Backend not reachable${err instanceof Error ? `: ${err.message}` : '.'}`,
      })
    }
  }

  if (apiBaseMissing) {
    return <MissingApiPanel onSaved={() => window.location.reload()} />
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 sm:py-6 space-y-5">
      {status === 'result' && response ? (
        <ResultPanel response={response} onReset={handleReset} onTest={testConnection} />
      ) : status === 'error' ? (
        <ErrorPanel error={error ?? 'Unknown error'} onReset={handleReset} onTest={testConnection} healthBanner={healthBanner} />
      ) : (
        <>
          <Hero />

          <Card>
            <CardContent className="p-4 sm:p-6 space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <Textarea
                  label="What is happening with your crop?"
                  placeholder="Example: My cassava leaves are yellowing and the soil is dry..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  rows={4}
                />

                <div className="flex flex-wrap gap-2">
                  {TAG_CHIPS.map((tag) => (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => appendChip(tag)}
                      className="px-3 py-1.5 bg-gray-100 rounded-full text-sm text-text hover:bg-primary/10 hover:text-primary transition-colors min-h-[40px]"
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    label="Crop (optional)"
                    placeholder="e.g. Maize, Cassava"
                    value={crop}
                    onChange={(e) => setCrop(e.target.value)}
                    list="crop-suggestions"
                  />
                  <datalist id="crop-suggestions">
                    {COMMON_CROPS.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>

                  <div className="w-full">
                    <label className="block text-sm font-medium text-text mb-1.5">
                      Growth stage (optional)
                    </label>
                    <select
                      value={growthStage}
                      onChange={(e) => setGrowthStage(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 bg-white text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 border-gray-200 hover:border-gray-300"
                    >
                      <option value="">Select stage…</option>
                      {GROWTH_STAGES.map((stage) => (
                        <option key={stage} value={stage}>
                          {stage}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <label className="flex items-center gap-2 text-sm text-text cursor-pointer min-h-[44px] px-3 rounded-lg hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={showPhoto}
                      onChange={(e) => setShowPhoto(e.target.checked)}
                      className="w-4 h-4 accent-primary"
                    />
                    <span>Add photo</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm text-text cursor-pointer min-h-[44px] px-3 rounded-lg hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={showLocation}
                      onChange={(e) => setShowLocation(e.target.checked)}
                      className="w-4 h-4 accent-primary"
                    />
                    <span>Use my location</span>
                  </label>
                </div>

                {showPhoto && (
                  <PhotoUploader photo={photo} onPhotoChange={handlePhotoChange} previewUrl={previewUrl} />
                )}

                {showLocation && (
                  <LocationPicker
                    latitude={lat}
                    longitude={lon}
                    locationName={locationName}
                    onLocationChange={handleLocationChange}
                  />
                )}

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  isLoading={status === 'loading'}
                  disabled={!query.trim() || status === 'loading'}
                >
                  {status === 'loading' ? 'Analyzing climate data…' : 'Get Climate-First Advisory'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {status === 'loading' && (
            <Card>
              <CardContent className="p-6 flex flex-col items-center gap-3 text-text-secondary">
                <LoadingSpinner size="lg" />
                <p className="text-sm">Reading WaPOR data, checking climate, and drafting advice…</p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}

function Hero() {
  return (
    <div className="text-center py-2 sm:py-4">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-3">
        <Sprout className="h-8 w-8 text-primary" />
      </div>
      <h1 className="text-xl sm:text-2xl font-bold text-text mb-1">Ask Aglimate about your farm</h1>
      <p className="text-text-secondary max-w-md mx-auto text-sm sm:text-base">
        Climate-first agricultural advice. We start with what's happening in your region — rainfall,
        soil moisture, growing degree days — and tailor the answer to your crop.
      </p>
    </div>
  )
}

function ResultPanel({
  response,
  onReset,
  onTest,
}: {
  response: AdviseResponse
  onReset: () => void
  onTest: () => void
}) {
  const cf = response.climate_first
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4 sm:p-6 space-y-3">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-7 w-7 text-success flex-shrink-0" />
            <h2 className="text-lg sm:text-xl font-bold text-text">Advisory Ready</h2>
          </div>
          <p className="text-text leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
            {response.answer}
          </p>
        </CardContent>
      </Card>

      {cf && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-4 sm:p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Cloud className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-text">Climate-first read</h3>
              <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                {Math.round(cf.confidence * 100)}% confidence
              </span>
            </div>
            <p className="text-sm text-text-secondary whitespace-pre-wrap">{cf.advisory}</p>
            <p className="text-xs text-text-muted">Model: {cf.model}</p>
          </CardContent>
        </Card>
      )}

      {(response.used_wapor || (response.wapor_layers?.length ?? 0) > 0 || (response.data_sources?.length ?? 0) > 0) && (
        <Card>
          <CardContent className="p-4 sm:p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-text">Data sources</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {response.used_wapor && (
                <Pill icon={<Droplets className="h-3 w-3" />} label="WaPOR" />
              )}
              {(response.wapor_layers ?? []).map((layer) => (
                <Pill key={layer} icon={<Droplets className="h-3 w-3" />} label={layer} />
              ))}
              {(response.data_sources ?? []).map((src) => (
                <Pill key={src} icon={<Database className="h-3 w-3" />} label={src} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {response.crop_requirements && Object.keys(response.crop_requirements).length > 0 && (
        <Card>
          <CardContent className="p-4 sm:p-5 space-y-2">
            <h3 className="font-semibold text-text flex items-center gap-2">
              <Thermometer className="h-5 w-5 text-primary" />
              Crop requirements
            </h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
              {Object.entries(response.crop_requirements).map(([key, value]) => (
                <div key={key} className="flex justify-between sm:block">
                  <dt className="text-text-muted text-xs uppercase tracking-wide">{key.replace(/_/g, ' ')}</dt>
                  <dd className="text-text font-medium">{String(value)}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-3">
        <Button onClick={onReset} variant="outline" className="flex-1">
          <RotateCcw className="h-4 w-4 mr-2" />
          Ask another question
        </Button>
        <Button onClick={onTest} variant="ghost" className="flex-none">
          Test connection
        </Button>
      </div>
    </div>
  )
}

function ErrorPanel({
  error,
  onReset,
  onTest,
  healthBanner,
}: {
  error: string
  onReset: () => void
  onTest: () => void
  healthBanner: { ok: boolean; message: string } | null
}) {
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4 sm:p-6 space-y-3">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-7 w-7 text-error flex-shrink-0" />
            <h2 className="text-lg sm:text-xl font-bold text-text">Could not reach advisory</h2>
          </div>
          <p className="text-error text-sm">{error}</p>
          {healthBanner && (
            <div
              className={cn(
                'flex items-center gap-2 text-sm p-3 rounded-lg',
                healthBanner.ok
                  ? 'bg-success/10 text-success'
                  : 'bg-error/10 text-error'
              )}
            >
              {healthBanner.ok ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
              <span>{healthBanner.message}</span>
            </div>
          )}
          <div className="flex gap-3">
            <Button onClick={onReset} className="flex-1">
              <RotateCcw className="h-4 w-4 mr-2" />
              Try again
            </Button>
            <Button onClick={onTest} variant="outline">
              Test connection
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function Pill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-text text-xs">
      {icon}
      {label}
    </span>
  )
}

function MissingApiPanel({ onSaved }: { onSaved: () => void }) {
  const [url, setUrl] = useState('')
  const [saved, setSaved] = useState(false)

  const save = () => {
    const trimmed = url.trim().replace(/\/+$/, '')
    if (!trimmed) return
    window.localStorage.setItem('aglimate_api_url', trimmed)
    window.__AGLIMATE_API_URL__ = trimmed
    resetApiBase()
    setSaved(true)
    setTimeout(onSaved, 400)
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8 sm:py-12 space-y-5">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-warning/10 rounded-2xl mb-3">
          <Sun className="h-8 w-8 text-warning" />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-text mb-1">Set your backend URL</h1>
        <p className="text-text-secondary text-sm">
          Paste the URL of your Aglimate backend (e.g. <code className="px-1 py-0.5 bg-gray-100 rounded">https://username-aglimate.hf.space</code>).
          We'll use same-origin if you leave it blank and the frontend is co-deployed with the API.
        </p>
      </div>

      <Card>
        <CardContent className="p-4 sm:p-6 space-y-3">
          <Input
            label="Backend URL"
            placeholder="https://your-space.hf.space"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Button onClick={save} disabled={!url.trim() || saved} size="lg" className="w-full">
            {saved ? 'Saved — reloading…' : 'Save and continue'}
          </Button>
          <button
            onClick={onSaved}
            className="w-full text-sm text-text-muted hover:text-text"
            type="button"
          >
            Use same-origin (skip)
          </button>
        </CardContent>
      </Card>
    </div>
  )
}
