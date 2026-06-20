'use client'

import { useRef, useState, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { Camera, Image, X, Check } from 'lucide-react'

interface PhotoUploaderProps {
  photo: File | null
  onPhotoChange: (photo: File | null) => void
  previewUrl: string | null
}

export function PhotoUploader({ photo, onPhotoChange, previewUrl }: PhotoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPG, PNG, WEBP)')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB')
      return
    }
    onPhotoChange(file)
  }, [onPhotoChange])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }, [handleFile])

  return (
    <div className="space-y-3">
      {previewUrl ? (
        <div className="relative rounded-xl overflow-hidden border-2 border-primary">
          <img
            src={previewUrl}
            alt="Selected photo"
            className="w-full h-48 sm:h-64 object-cover"
          />
          <button
            onClick={() => onPhotoChange(null)}
            className="absolute top-2 right-2 p-2 bg-error text-white rounded-lg shadow-md hover:bg-red-700 transition-colors"
            aria-label="Remove photo"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-primary text-white text-xs rounded-lg flex items-center gap-1">
            <Check className="h-3 w-3" />
            {photo?.name}
          </div>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          className={cn(
            'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors',
            dragOver ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary hover:bg-gray-50'
          )}
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Camera className="h-6 w-6 text-primary" />
              </div>
              <span className="text-sm font-medium text-text">Take Photo</span>
            </div>
            <span className="text-text-muted hidden sm:block">or</span>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Image className="h-6 w-6 text-primary" />
              </div>
              <span className="text-sm font-medium text-text">Choose from Gallery</span>
            </div>
          </div>
          <p className="text-xs text-text-muted mt-4">JPG, PNG, WEBP up to 5MB</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        capture="environment"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        className="hidden"
      />
    </div>
  )
}
