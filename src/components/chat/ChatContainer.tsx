'use client'

import { useEffect, useRef } from 'react'
import { useChat } from '@/hooks/useChat'
import { ChatBubble } from './ChatBubble'
import { ChatInput } from './ChatInput'
import { TypingIndicator } from '@/components/ui/TypingIndicator'
import { Button } from '@/components/ui/Button'
import { MessageSquare, Plus } from 'lucide-react'
import { useAppStore } from '@/lib/store'

export function ChatContainer() {
  const { messages, isLoading, error, sendMessage, retryLastMessage, hasSession } = useChat()
  const { createSession } = useAppStore()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const handleNewChat = () => {
    createSession()
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)]">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {!hasSession || messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-text mb-2">Ask Aglimate Anything</h2>
            <p className="text-text-secondary max-w-sm mb-6">
              Get farming advice in your language. Ask about crops, weather, pests, or anything agricultural.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md">
              {[
                'Best time to plant maize?',
                'How to treat tomato blight?',
                'What fertilizer for cassava?',
                'Weather forecast for this week?',
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => sendMessage(suggestion)}
                  className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-text hover:border-primary hover:bg-primary/5 transition-all text-left"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatBubble
                key={message.id}
                message={message}
                onRetry={message.content.includes("couldn't process") ? retryLastMessage : undefined}
              />
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="shrink-0 w-8 h-8 rounded-full bg-gray-100 text-primary flex items-center justify-center">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div className="space-y-2">
                  <TypingIndicator />
                  <p className="text-xs text-text-muted">Aglimate is thinking...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* New Chat Button */}
      {hasSession && messages.length > 0 && (
        <div className="absolute top-20 right-4 z-10">
          <Button
            variant="outline"
            size="sm"
            onClick={handleNewChat}
            className="bg-white/90 backdrop-blur-sm shadow-sm"
          >
            <Plus className="h-4 w-4 mr-1" />
            New Chat
          </Button>
        </div>
      )}

      {/* Input Area */}
      <ChatInput onSend={sendMessage} isLoading={isLoading} disabled={!hasSession && messages.length === 0} />
    </div>
  )
}
