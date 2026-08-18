// Build-time replacement target. Keeps process.env out of layout.tsx so the
// type-narrowing there is cleaner. Next's bundler still rewrites this literal
// at build time.
declare const process: { env: Record<string, string | undefined> }

export function getInitialApiUrl(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL || ''
  return raw.replace(/\/+$/, '')
}

export function apiUrlBootstrapScript(): string {
  return `window.__AGLIMATE_API_URL__=${JSON.stringify(getInitialApiUrl())};`
}
