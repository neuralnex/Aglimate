'use client'

import { useAppStore } from '@/lib/store'
import { LANGUAGE_MAP, NIGERIAN_STATES, SupportedLanguage } from '@/types'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { cn } from '@/lib/utils'
import { Trash2, Download, Star, MessageSquare, Sprout } from 'lucide-react'

export default function SettingsPage() {
  const { settings, updateSettings, sessions, clearAllSessions } = useAppStore()

  const languageOptions = Object.entries(LANGUAGE_MAP).map(([code, info]) => ({
    value: code,
    label: `${info.flag} ${info.native}`,
  }))

  const farmSizeOptions = [
    { value: '0.5', label: 'Less than 1 hectare' },
    { value: '1', label: '1 hectare' },
    { value: '2', label: '2 hectares' },
    { value: '5', label: '5 hectares' },
    { value: '10', label: '10+ hectares' },
  ]

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold text-text">Settings</h1>

      {/* Profile */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-text flex items-center gap-2">
            <Sprout className="h-5 w-5 text-primary" />
            Your Profile
          </h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select
            label="Preferred Language"
            options={languageOptions}
            value={settings.language}
            onChange={(e) => updateSettings({ language: e.target.value as SupportedLanguage })}
          />

          <Select
            label="Farm Size"
            options={farmSizeOptions}
            value={settings.farmSize}
            onChange={(e) => updateSettings({ farmSize: e.target.value })}
          />

          <div>
            <label className="block text-sm font-medium text-text mb-1.5">Default Location</label>
            <select
              value={settings.location || ''}
              onChange={(e) => updateSettings({ location: e.target.value || null })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-text focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            >
              <option value="">Select your state...</option>
              {NIGERIAN_STATES.map(state => (
                <option key={state} value={`${state}, Nigeria`}>{state}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Accessibility */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-text">Accessibility</h2>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { key: 'largeText', label: 'Large Text', description: 'Increase text size throughout the app' },
            { key: 'highContrast', label: 'High Contrast Mode', description: 'Stronger colors for better visibility' },
            { key: 'voiceReadAloud', label: 'Voice Read-Aloud', description: 'Automatically read responses aloud' },
          ].map((option) => (
            <label
              key={option.key}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div>
                <p className="font-medium text-text">{option.label}</p>
                <p className="text-xs text-text-secondary">{option.description}</p>
              </div>
              <div className={cn(
                'w-12 h-7 rounded-full transition-colors relative',
                settings[option.key as keyof typeof settings] ? 'bg-primary' : 'bg-gray-300'
              )}>
                <div className={cn(
                  'absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-sm transition-transform',
                  settings[option.key as keyof typeof settings] ? 'translate-x-5' : 'translate-x-0.5'
                )} />
              </div>
              <input
                type="checkbox"
                className="sr-only"
                checked={!!settings[option.key as keyof typeof settings]}
                onChange={(e) => updateSettings({ [option.key]: e.target.checked })}
              />
            </label>
          ))}
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-text">Notifications</h2>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { key: 'weatherAlerts', label: 'Weather Alerts', description: 'Severe weather warnings for your area' },
            { key: 'farmingTips', label: 'Farming Tips', description: 'Weekly seasonal advice and reminders' },
            { key: 'marketUpdates', label: 'Market Price Updates', description: 'Price changes for your crops' },
          ].map((option) => (
            <label
              key={option.key}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div>
                <p className="font-medium text-text">{option.label}</p>
                <p className="text-xs text-text-secondary">{option.description}</p>
              </div>
              <div className={cn(
                'w-12 h-7 rounded-full transition-colors relative',
                settings[option.key as keyof typeof settings] ? 'bg-primary' : 'bg-gray-300'
              )}>
                <div className={cn(
                  'absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-sm transition-transform',
                  settings[option.key as keyof typeof settings] ? 'translate-x-5' : 'translate-x-0.5'
                )} />
              </div>
              <input
                type="checkbox"
                className="sr-only"
                checked={!!settings[option.key as keyof typeof settings]}
                onChange={(e) => updateSettings({ [option.key]: e.target.checked })}
              />
            </label>
          ))}
        </CardContent>
      </Card>

      {/* Data & Privacy */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-text">Data & Privacy</h2>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3">
            <div>
              <p className="font-medium text-text flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Chat History
              </p>
              <p className="text-xs text-text-secondary">{sessions.length} saved conversations</p>
            </div>
            <Button variant="danger" size="sm" onClick={clearAllSessions}>
              <Trash2 className="h-4 w-4 mr-1" />
              Clear
            </Button>
          </div>

          <button className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors text-sm font-medium text-text">
            <Download className="h-4 w-4" />
            Export My Data
          </button>
        </CardContent>
      </Card>

      {/* Feedback */}
      <div className="flex gap-3">
        <Button variant="outline" className="flex-1">
          <Star className="h-4 w-4 mr-2" />
          Rate App
        </Button>
        <Button variant="outline" className="flex-1">
          Give Feedback
        </Button>
      </div>

      {/* Version */}
      <p className="text-center text-xs text-text-muted pb-4">
        Aglimate v1.0.0 &bull; Farmer-First Climate Advisory
      </p>
    </div>
  )
}
