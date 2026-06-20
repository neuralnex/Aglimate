'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: null },
  { href: '/chat', label: 'Chat', icon: null },
  { href: '/advisory', label: 'Advisory', icon: null },
  { href: '/weather', label: 'Weather', icon: null },
  { href: '/knowledge', label: 'Learn', icon: null },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-pb">
      <div className="flex items-center justify-around h-16 px-2">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center justify-center gap-0.5 w-full h-full transition-colors px-2',
              pathname === item.href
                ? 'text-primary'
                : 'text-text-muted hover:text-text-secondary'
            )}
          >
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
