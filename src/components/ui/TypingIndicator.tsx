'use client'

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3 bg-gray-100 rounded-2xl rounded-tl-sm w-fit">
      <span className="w-2 h-2 bg-text-muted rounded-full animate-typing" style={{ animationDelay: '0ms' }} />
      <span className="w-2 h-2 bg-text-muted rounded-full animate-typing" style={{ animationDelay: '150ms' }} />
      <span className="w-2 h-2 bg-text-muted rounded-full animate-typing" style={{ animationDelay: '300ms' }} />
    </div>
  )
}
