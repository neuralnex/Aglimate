'use client'

import { useState, useCallback } from 'react'
import { useAppStore } from '@/lib/store'
import { api } from '@/lib/api'
import { StepIndicator } from '@/components/advisory/StepIndicator'
import { PhotoUploader } from '@/components/advisory/PhotoUploader'
import { LocationPicker } from '@/components/advisory/LocationPicker'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { Card, CardContent } from '@/components/ui/Card'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { CheckCircle, ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react'

export default function AdvisoryPage() {
  const { advisoryStep, setAdvisoryStep, advisoryData, setAdvisoryData, resetAdvisory } = useAppStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handlePhotoChange = useCallback((photo: File | null) => {
    setAdvisoryData({ photo })
    if (photo) {
      const url = URL.createObjectURL(photo)
      setPreviewUrl(url)
    } else {
      setPreviewUrl(null)
    }
  }, [setAdvisoryData])

  const handleLocationChange = useCallback((lat: number | null, lon: number | null, name: string | null) => {
    setAdvisoryData({ latitude: lat, longitude: lon })
  }, [setAdvisoryData])

  const handleSubmit = async () => {
    if (!advisoryData.query.trim()) return

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await api.advise({
        query: advisoryData.query,
        latitude: advisoryData.latitude || undefined,
        longitude: advisoryData.longitude || undefined,
        photo: advisoryData.photo || undefined,
      })
      setResult(response.answer)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get advisory')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    resetAdvisory()
    setResult(null)
    setError(null)
    setPreviewUrl(null)
  }

  if (result) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-4 sm:py-6">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="h-7 w-7 text-success flex-shrink-0" />
              <h2 className="text-lg sm:text-xl font-bold text-text">Advisory Ready</h2>
            </div>
            <div className="prose prose-sm max-w-none">
              <p className="text-text leading-relaxed whitespace-pre-wrap text-sm sm:text-base">{result}</p>
            </div>
            <div className="mt-4 sm:mt-6 flex gap-3">
              <Button onClick={handleReset} variant="outline" className="flex-1" size="md">
                <RotateCcw className="h-4 w-4 mr-2" />
                New Advisory
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 sm:py-6">
      <h1 className="text-xl sm:text-2xl font-bold text-text mb-2">Climate Advisory</h1>
      <p className="text-text-secondary mb-4 sm:mb-6 text-sm sm:text-base">Describe your farming situation and optionally add a photo for better advice.</p>

      <StepIndicator
        currentStep={advisoryStep}
        totalSteps={3}
        labels={['Describe', 'Photo', 'Location']}
      />

      {/* Step 1: Description */}
      {advisoryStep === 1 && (
        <div className="space-y-4 animate-fade-in">
          <Textarea
            label="What is happening with your crop?"
            placeholder="Example: My cassava plants have yellow leaves and some are falling off..."
            value={advisoryData.query}
            onChange={(e) => setAdvisoryData({ query: e.target.value })}
            rows={5}
          />

          <div className="flex flex-wrap gap-2">
            {['Leaves changing color', 'Pests visible', 'Water issue', 'Not growing'].map((tag) => (
              <button
                key={tag}
                onClick={() => setAdvisoryData({ query: tag + ' - ' + advisoryData.query })}
                className="px-3 py-1.5 bg-gray-100 rounded-full text-sm text-text hover:bg-primary/10 hover:text-primary transition-colors min-h-[40px]"
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="flex justify-end">
            <Button
              onClick={() => setAdvisoryStep(2)}
              disabled={!advisoryData.query.trim()}
              size="md"
            >
              Continue
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Photo */}
      {advisoryStep === 2 && (
        <div className="space-y-4 animate-fade-in">
          <PhotoUploader
            photo={advisoryData.photo}
            onPhotoChange={handlePhotoChange}
            previewUrl={previewUrl}
          />

          <div className="flex justify-between gap-3">
            <Button variant="ghost" onClick={() => setAdvisoryStep(1)} size="md">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button onClick={() => setAdvisoryStep(3)} size="md">
              {advisoryData.photo ? 'Continue' : 'Skip'}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Location */}
      {advisoryStep === 3 && (
        <div className="space-y-4 animate-fade-in">
          <LocationPicker
            latitude={advisoryData.latitude}
            longitude={advisoryData.longitude}
            locationName={null}
            onLocationChange={handleLocationChange}
          />

          {error && (
            <div className="p-4 bg-error/10 border border-error/20 rounded-xl text-error text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-between gap-3">
            <Button variant="ghost" onClick={() => setAdvisoryStep(2)} size="md">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button
              onClick={handleSubmit}
              isLoading={isSubmitting}
              disabled={!advisoryData.query.trim() || isSubmitting}
              size="md"
            >
              {isSubmitting ? 'Analyzing...' : 'Get Advisory'}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
