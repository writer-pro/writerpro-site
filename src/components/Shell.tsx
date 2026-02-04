import type { ReactNode } from "react"
import { Navigation } from "./Navigation"
import { type Session } from "../lib/session"

interface ShellProps {
  session: Session | null
  onSignOut: () => void
  children: ReactNode
}

export function Shell({ session, onSignOut, children }: ShellProps) {
  return (
    <div className="min-h-screen px-6 py-8 text-text0">
      <div className="mx-auto max-w-6xl glass-shell p-6 md:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-white/10 border border-stroke0" />
            <span className="h-3 w-3 rounded-full bg-white/10 border border-stroke0" />
            <span className="h-3 w-3 rounded-full bg-white/10 border border-stroke0" />
          </div>
          <div className="h-px flex-1 bg-white/5" />
        </div>
        <Navigation session={session} onSignOut={onSignOut} />
        <div className="mt-8">{children}</div>
      </div>
      <div className="mt-8 text-center text-xs text-text2">Made by Niccolo Di Maria</div>
    </div>
  )
}
