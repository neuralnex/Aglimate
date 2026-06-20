import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en-NG', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date)
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-NG', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(date)
}

export function getConfidenceColor(confidence: number): string {
  if (confidence >= 0.8) return 'bg-green-500'
  if (confidence >= 0.5) return 'bg-yellow-500'
  return 'bg-red-500'
}

export function getConfidenceLabel(confidence: number): string {
  if (confidence >= 0.8) return 'High'
  if (confidence >= 0.5) return 'Medium'
  return 'Low'
}

export function getWeatherIcon(code: number): string {
  // Map weather condition codes to text labels
  if (code === 1000) return 'Sunny'
  if (code === 1003) return 'Partly cloudy'
  if (code === 1006 || code === 1009) return 'Cloudy'
  if ([1030, 1135, 1147].includes(code)) return 'Mist'
  if ([1063, 1180, 1183, 1186, 1189, 1192, 1195, 1198, 1201, 1240, 1243, 1246, 1273, 1276].includes(code)) return 'Rain'
  if ([1066, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258, 1279, 1282].includes(code)) return 'Snow'
  if ([1087, 1273, 1276, 1279, 1282].includes(code)) return 'Thunderstorm'
  if ([1150, 1153, 1168, 1171, 1180, 1183].includes(code)) return 'Drizzle'
  if ([1237, 1261, 1264].includes(code)) return 'Hail'
  return 'Weather'
}

export function getAlertSeverityColor(severity: string): string {
  const s = severity.toLowerCase()
  if (s.includes('extreme') || s.includes('severe')) return 'bg-red-100 border-red-300 text-red-800'
  if (s.includes('moderate')) return 'bg-orange-100 border-orange-300 text-orange-800'
  if (s.includes('minor')) return 'bg-yellow-100 border-yellow-300 text-yellow-800'
  return 'bg-blue-100 border-blue-300 text-blue-800'
}

export function generateSessionId(): string {
  return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}
