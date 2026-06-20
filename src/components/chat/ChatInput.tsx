'use client'

import { useState, useRef, useCallback } from 'react'
import { useSpeech } from '@/hooks/useSpeech'
import { cn } from '@/lib/utils'
import { Send, Mic, MicOff } from 'lucide-react'

interface ChatInputProps {
  onSend: (message: string) => void
  isLoading?: boolean
  disabled?: boolean
}

export function ChatInput({ onSend, isLoading, disabled }: ChatInputProps) {
  const [text, setText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { isListening, transcript, startListening, stopListening, resetTranscript, isSupported } = useSpeech()

  const handleInput = useCallback(() => {
    const el = textareaRef.current
    if (el) {
      el.style.height = 'auto'
      el.style.height = `${Math.min(el.scrollHeight, 120)}px`
    }
  }, [])

  const handleSend = useCallback(() => {
    const trimmed = text.trim() || transcript.trim()
    if (!trimmed || isLoading) return
    onSend(trimmed)
    setText('')
    resetTranscript()
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }, [text, transcript, isLoading, onSend, resetTranscript])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }, [handleSend])

  const handleVoiceToggle = useCallback(() => {
    if (isListening) {
      stopListening()
      if (transcript) {
        setText(transcript)
      }
    } else {
      resetTranscript()
      startListening('en-NG')
    }
  }, [isListening, transcript, startListening, stopListening, resetTranscript])

  const displayText = isListening ? transcript : text

  return (
    <div className="border-t border-gray-200 bg-white p-3 sm:p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-end gap-2 bg-gray-50 rounded-2xl border-2 border-gray-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
          <textarea
            ref={textareaRef}
            value={displayText}
            onChange={(e) => {
              if (!isListening) {
                setText(e.target.value)
                handleInput()
              }
            }}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? 'Listening...' : 'Type or speak your question...'}
            disabled={disabled || isLoading}
            rows={1}
            className={cn(
              'flex-1 bg-transparent px-4 py-3 text-sm resize-none outline-none min-h-[44px] max-h-[120px]',
              isListening && 'text-primary font-medium'
            )}
          />

          <div className="flex items-center gap-1 pr-2 pb-2">
            {isSupported && (
              <button
                onClick={handleVoiceToggle}
                disabled={disabled || isLoading}
                className={cn(
                  'p-2.5 rounded-xl transition-colors',
                  isListening
                    ? 'bg-error text-white animate-pulse'
                    : 'text-text-muted hover:text-primary hover:bg-primary/10'
                )}
                aria-label={isListening ? 'Stop recording' : 'Start voice input'}
              >
                {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </button>
            )}

            <button
              onClick={handleSend}
              disabled={(!displayText.trim() && !transcript.trim()) || isLoading || disabled}
              className={cn(
                'p-2.5 rounded-xl transition-colors',
                displayText.trim() || transcript.trim()
                  ? 'bg-primary text-white hover:bg-primary-dark shadow-sm'
                  : 'text-text-muted cursor-not-allowed'
              )}
              aria-label="Send message"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>

        {isListening && (
          <p className="text-center text-xs text-primary mt-2 animate-pulse">
            Listening... Tap microphone to stop
          </p>
        )}
      </div>
    </div>
  )
}
