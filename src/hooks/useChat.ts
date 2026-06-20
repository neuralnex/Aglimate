'use client'

import { useState, useCallback, useRef } from 'react'
import { useAppStore } from '@/lib/store'
import { api } from '@/lib/api'
import { ChatMessage } from '@/types'

export function useChat() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const { 
    sessions, 
    currentSessionId, 
    getCurrentSession,
    addMessage, 
    createSession,
    settings 
  } = useAppStore()

  const currentSession = getCurrentSession()

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return

    setError(null)
    setIsLoading(true)

    // Create session if none exists
    let sessionId = currentSessionId
    if (!sessionId) {
      sessionId = createSession()
    }

    // Add user message
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    }
    addMessage(sessionId!, userMessage)

    try {
      const response = await api.ask(
        content.trim(),
        sessionId!,
        settings.language !== 'en' ? settings.language : undefined
      )

      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: response.answer,
        timestamp: new Date(),
        language: response.detected_language,
        confidence: response.confidence,
        intent: response.intent,
        cached: response.cached,
      }
      addMessage(sessionId!, assistantMessage)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong'
      setError(errorMessage)

      // Add error message
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: `Sorry, I couldn't process your question. ${errorMessage}`,
        timestamp: new Date(),
      }
      addMessage(sessionId!, errorMsg)
    } finally {
      setIsLoading(false)
    }
  }, [currentSessionId, settings.language, createSession, addMessage])

  const retryLastMessage = useCallback(async () => {
    if (!currentSession || currentSession.messages.length < 2) return

    const lastUserMessage = [...currentSession.messages]
      .reverse()
      .find(m => m.role === 'user')

    if (lastUserMessage) {
      // Remove the error response
      const newMessages = currentSession.messages.slice(0, -1)
      // Update session (this is a simplified approach)
      await sendMessage(lastUserMessage.content)
    }
  }, [currentSession, sendMessage])

  return {
    messages: currentSession?.messages || [],
    isLoading,
    error,
    sendMessage,
    retryLastMessage,
    hasSession: !!currentSessionId,
  }
}
