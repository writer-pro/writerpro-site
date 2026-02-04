import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { PageHeader } from "../components/PageHeader"
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "../lib/constants"
import type { Session } from "../lib/session"
import { supabaseRequest } from "../lib/session"

interface SignInProps {
  onSessionUpdate: (next: Session | null) => void
}

export function SignIn({ onSessionUpdate }: SignInProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [status, setStatus] = useState("")
  const [loading, setLoading] = useState(false)
  const [params] = useSearchParams()
  const navigate = useNavigate()

  const next = params.get("next") || "/billing"

  const handleSignIn = async () => {
    if (!email || !password) {
      setStatus("Enter email and password.")
      return
    }
    setLoading(true)
    setStatus("Signing in...")
    try {
      const res = await supabaseRequest(
        "/auth/v1/token?grant_type=password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        },
        SUPABASE_URL,
        SUPABASE_ANON_KEY,
        null
      )
      if (!res.ok) {
        const payload = await res.json().catch(() => null)
        setStatus(payload?.error_description || payload?.error || "Sign in failed.")
        return
      }
      const session = await res.json()
      onSessionUpdate(session)
      setStatus("Signed in. Redirecting...")
      navigate(next)
    } catch (error: any) {
      setStatus(error?.message || "Sign in failed.")
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async () => {
    setLoading(true)
    setStatus("Creating account...")
    try {
      const res = await supabaseRequest(
        "/auth/v1/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        },
        SUPABASE_URL,
        SUPABASE_ANON_KEY,
        null
      )
      setStatus(res.ok ? "Account created. Check your email." : "Sign up failed.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Sign In" subtitle="Log in first, then manage credits on the dashboard." />
      <div className="section-panel p-6 max-w-xl">
        <div className="space-y-4">
          <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleSignIn} disabled={loading}>Sign In</Button>
            <Button variant="secondary" onClick={handleSignUp} disabled={loading}>Create Account</Button>
          </div>
          <p className="text-xs text-text2">{status}</p>
        </div>
      </div>
    </div>
  )
}
