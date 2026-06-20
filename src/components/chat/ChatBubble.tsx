'use client'

import { ChatMessage } from '@/types'
import { formatTime, getConfidenceColor, getConfidenceLabel } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { User, Bot, RotateCcw } from 'lucide-react'

interface ChatBubbleProps {
  message: ChatMessage
  onRetry?: () => void
}

export function ChatBubble({ message, onRetry }: ChatBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <div
      className={cn(
        'flex gap-3 animate-fade-in',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
          isUser ? 'bg-primary text-white' : 'bg-gray-100 text-primary'
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      {/* Message Content */}
      <div className={cn('max-w-[80%] sm:max-w-[75%]', isUser ? 'items-end' : 'items-start')}>
        <div
          className={cn(
            'px-4 py-3 rounded-2xl text-sm leading-relaxed',
            isUser
              ? 'bg-farmer-bubble text-text rounded-tr-sm'
              : 'bg-aglimate-bubble border border-gray-200 text-text rounded-tl-sm shadow-sm'
          )}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>

        {/* Metadata */}
        <div className={cn('flex items-center gap-2 mt-1.5', isUser ? 'justify-end' : 'justify-start')}>
          <span className="text-xs text-text-muted">{formatTime(message.timestamp)}</span>

          {!isUser && message.confidence !== undefined && (
            <span className="flex items-center gap-1">
              <span className={cn('w-2 h-2 rounded-full', getConfidenceColor(message.confidence))} />
              <span className="text-xs text-text-muted">{getConfidenceLabel(message.confidence)}</span>
            </span>
          )}

          {!isUser && message.language && (
            <span className="text-xs text-text-muted">in {message.language}</span>
          )}

          {!isUser && message.cached && (
            <span className="text-xs text-text-muted">cached</span>
          )}

          {!isUser && onRetry && message.content.includes("couldn't process") && (
            <button
              onClick={onRetry}
              className="flex items-center gap-1 text-xs text-primary hover:text-primary-dark transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
