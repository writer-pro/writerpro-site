export type Session = {
  access_token: string
  refresh_token?: string
  expires_at?: number
  token_type?: string
}

const SESSION_KEY = "wp_session"

export function loadSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return null
}

export function storeSession(next: Session | null) {
  if (!next) {
    localStorage.removeItem(SESSION_KEY)
    sessionStorage.removeItem(SESSION_KEY)
    return
  }
  const serialized = JSON.stringify(next)
  localStorage.setItem(SESSION_KEY, serialized)
  sessionStorage.setItem(SESSION_KEY, serialized)
}

export function hasSessionToken(session: Session | null): boolean {
  return !!(session && session.access_token)
}

export async function refreshSessionIfNeeded(
  session: Session | null,
  supabaseUrl: string,
  supabaseAnonKey: string
): Promise<Session | null> {
  if (!session || !session.refresh_token || !session.expires_at) return session
  const now = Math.floor(Date.now() / 1000)
  if (now < session.expires_at - 45) return session
  try {
    const res = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=refresh_token`, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: supabaseAnonKey },
      body: JSON.stringify({ refresh_token: session.refresh_token }),
    })
    if (!res.ok) return session
    const next = await res.json()
    if (next?.access_token) {
      storeSession(next)
      return next
    }
  } catch {}
  return session
}

export async function supabaseRequest(
  path: string,
  options: RequestInit,
  supabaseUrl: string,
  supabaseAnonKey: string,
  session: Session | null
): Promise<Response> {
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
    apikey: supabaseAnonKey,
  }
  if (session?.access_token) headers.Authorization = `Bearer ${session.access_token}`
  return fetch(`${supabaseUrl}${path}`, { ...options, headers })
}
