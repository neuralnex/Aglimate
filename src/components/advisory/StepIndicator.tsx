'use client'

import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
  labels: string[]
}

export function StepIndicator({ currentStep, totalSteps, labels }: StepIndicatorProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors',
                i + 1 < currentStep ? 'bg-primary text-white' :
                i + 1 === currentStep ? 'bg-primary text-white ring-4 ring-primary/20' :
                'bg-gray-200 text-text-muted'
              )}
            >
              {i + 1 < currentStep ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            {i < totalSteps - 1 && (
              <div
                className={cn(
                  'flex-1 h-1 mx-2 rounded-full transition-colors',
                  i + 1 < currentStep ? 'bg-primary' : 'bg-gray-200'
                )}
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between text-xs text-text-muted">
        {labels.map((label, i) => (
          <span key={i} className={cn(i + 1 === currentStep && 'text-primary font-medium')}>
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}
