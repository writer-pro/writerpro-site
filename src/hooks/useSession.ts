import { useEffect, useState } from "react"
import { loadSession, storeSession, type Session } from "../lib/session"

export function useSession() {
  const [session, setSessionState] = useState<Session | null>(null)

  useEffect(() => {
    setSessionState(loadSession())
  }, [])

  const setSession = (next: Session | null) => {
    storeSession(next)
    setSessionState(next)
  }

  return { session, setSession }
}
