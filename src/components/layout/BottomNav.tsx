'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Home, MessageSquare, Camera, CloudSun, BookOpen } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/chat', label: 'Chat', icon: MessageSquare },
  { href: '/advisory', label: 'Advisory', icon: Camera },
  { href: '/weather', label: 'Weather', icon: CloudSun },
  { href: '/knowledge', label: 'Learn', icon: BookOpen },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-pb">
      <div className="flex items-center justify-around h-16">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center w-full h-full py-1 px-2 transition-colors',
                isActive ? 'text-primary' : 'text-text-muted hover:text-text-secondary'
              )}
            >
              <Icon className={cn('h-6 w-6', isActive ? 'text-primary' : 'text-text-muted')}
              />
              <span className="text-[10px] font-medium mt-0.5">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
