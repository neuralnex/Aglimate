'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ChatSession, ChatMessage, UserSettings, SupportedLanguage, KnowledgeArticle } from '@/types'
import { generateSessionId } from './utils'

interface AppState {
  // Chat
  sessions: ChatSession[]
  currentSessionId: string | null
  getCurrentSession: () => ChatSession | undefined
  addMessage: (sessionId: string, message: ChatMessage) => void
  createSession: () => string
  setCurrentSession: (sessionId: string) => void
  deleteSession: (sessionId: string) => void
  clearAllSessions: () => void

  // Settings
  settings: UserSettings
  updateSettings: (settings: Partial<UserSettings>) => void

  // UI
  isOffline: boolean
  setOffline: (status: boolean) => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void

  // Knowledge Base
  savedArticles: string[]
  toggleSavedArticle: (articleId: string) => void

  // Advisory
  advisoryStep: number
  setAdvisoryStep: (step: number) => void
  advisoryData: {
    query: string
    photo: File | null
    latitude: number | null
    longitude: number | null
  }
  setAdvisoryData: (data: Partial<AppState['advisoryData']>) => void
  resetAdvisory: () => void
}

const defaultSettings: UserSettings = {
  language: 'en',
  location: null,
  lat: null,
  lon: null,
  farmSize: '2',
  largeText: false,
  highContrast: false,
  voiceReadAloud: false,
  weatherAlerts: true,
  farmingTips: true,
  marketUpdates: false,
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Chat
      sessions: [],
      currentSessionId: null,

      getCurrentSession: () => {
        const { sessions, currentSessionId } = get()
        return sessions.find(s => s.id === currentSessionId)
      },

      addMessage: (sessionId, message) => {
        set(state => ({
          sessions: state.sessions.map(session => {
            if (session.id !== sessionId) return session
            const updatedMessages = [...session.messages, message]
            return {
              ...session,
              messages: updatedMessages,
              updatedAt: new Date(),
              title: session.title === 'New Chat' && message.role === 'user'
                ? message.content.substring(0, 40) + (message.content.length > 40 ? '...' : '')
                : session.title,
            }
          }),
        }))
      },

      createSession: () => {
        const sessionId = generateSessionId()
        const newSession: ChatSession = {
          id: sessionId,
          title: 'New Chat',
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        set(state => ({
          sessions: [newSession, ...state.sessions],
          currentSessionId: sessionId,
        }))
        return sessionId
      },

      setCurrentSession: (sessionId) => {
        set({ currentSessionId: sessionId })
      },

      deleteSession: (sessionId) => {
        set(state => {
          const newSessions = state.sessions.filter(s => s.id !== sessionId)
          return {
            sessions: newSessions,
            currentSessionId: state.currentSessionId === sessionId
              ? (newSessions[0]?.id || null)
              : state.currentSessionId,
          }
        })
      },

      clearAllSessions: () => {
        set({ sessions: [], currentSessionId: null })
      },

      // Settings
      settings: defaultSettings,
      updateSettings: (newSettings) => {
        set(state => ({
          settings: { ...state.settings, ...newSettings },
        }))
      },

      // UI
      isOffline: false,
      setOffline: (status) => set({ isOffline: status }),
      sidebarOpen: false,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      // Knowledge Base
      savedArticles: [],
      toggleSavedArticle: (articleId) => {
        set(state => ({
          savedArticles: state.savedArticles.includes(articleId)
            ? state.savedArticles.filter(id => id !== articleId)
            : [...state.savedArticles, articleId],
        }))
      },

      // Advisory
      advisoryStep: 1,
      setAdvisoryStep: (step) => set({ advisoryStep: step }),
      advisoryData: {
        query: '',
        photo: null,
        latitude: null,
        longitude: null,
      },
      setAdvisoryData: (data) => {
        set(state => ({
          advisoryData: { ...state.advisoryData, ...data },
        }))
      },
      resetAdvisory: () => {
        set({
          advisoryStep: 1,
          advisoryData: {
            query: '',
            photo: null,
            latitude: null,
            longitude: null,
          },
        })
      },
    }),
    {
      name: 'aglimate-storage',
      partialize: (state) => ({
        sessions: state.sessions,
        settings: state.settings,
        savedArticles: state.savedArticles,
      }),
    }
  )
)
