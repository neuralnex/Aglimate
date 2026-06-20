'use client'

import Link from 'next/link'
import { useAppStore } from '@/lib/store'
import { Card, CardContent } from '@/components/ui/Card'
import { MessageSquare, Camera, CloudSun, BookOpen, Sprout } from 'lucide-react'

export default function HomePage() {
  const { sessions, settings, isOffline } = useAppStore()

  const recentChats = sessions.slice(0, 3)

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 sm:py-6 space-y-5">
      {/* Welcome */}
      <div className="text-center py-3 sm:py-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-3 sm:mb-4">
          <Sprout className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-text mb-2">
          Welcome to Aglimate
        </h1>
        <p className="text-text-secondary max-w-md mx-auto text-sm sm:text-base">
          Your AI farming assistant. Ask questions, check weather, diagnose crops, and learn best practices.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {[
          { href: '/chat', icon: MessageSquare, label: 'Ask Question', color: 'bg-blue-50 text-blue-600' },
          { href: '/advisory', icon: Camera, label: 'Check Crop', color: 'bg-green-50 text-green-600' },
          { href: '/weather', icon: CloudSun, label: 'Weather', color: 'bg-amber-50 text-amber-600' },
          { href: '/knowledge', icon: BookOpen, label: 'Learn', color: 'bg-purple-50 text-purple-600' },
        ].map((action) => (
          <Link key={action.href} href={action.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="p-3 sm:p-4 flex flex-col items-center text-center gap-2 min-h-[120px]">
                <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center`}>
                  <action.icon className="h-6 w-6" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-text">{action.label}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Chats */}
      {recentChats.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-text">Recent Chats</h2>
            <Link href="/chat" className="text-sm text-primary hover:text-primary-dark">
              View All
            </Link>
          </div>
          <div className="space-y-2">
            {recentChats.map((session) => (
              <Link key={session.id} href={`/chat`}>
                <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <p className="font-medium text-text truncate text-sm">{session.title}</p>
                    <p className="text-xs text-text-muted mt-1">
                      {session.messages.length} messages &bull; {new Date(session.updatedAt).toLocaleDateString('en-NG')}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Weather Preview */}
      {settings.location && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-text">Weather</h2>
            <Link href="/weather" className="text-sm text-primary hover:text-primary-dark">
              Full Forecast
            </Link>
          </div>
          <Link href="/weather">
            <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <div>
                  <p className="font-semibold text-text">{settings.location}</p>
                  <p className="text-sm text-text-secondary">Tap to view full forecast and alerts</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      )}

      {/* Offline Notice */}
      {isOffline && (
        <div className="bg-warning/10 border border-warning/20 rounded-xl p-4 text-center">
          <p className="text-sm text-warning font-medium">You are currently offline</p>
          <p className="text-xs text-text-secondary mt-1">Some features may be limited. Chats will sync when you reconnect.</p>
        </div>
      )}
    </div>
  )
}
