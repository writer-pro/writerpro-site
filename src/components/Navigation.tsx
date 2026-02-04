import { Link, useNavigate } from "react-router-dom"
import { Button } from "./ui/button"
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "../lib/constants"
import { type Session, supabaseRequest } from "../lib/session"

interface NavigationProps {
  session: Session | null
  onSignOut: () => void
}

export function Navigation({ session, onSignOut }: NavigationProps) {
  const navigate = useNavigate()

  const handleSignOut = async () => {
    if (!session?.access_token) return
    try {
      await supabaseRequest(
        "/auth/v1/logout",
        { method: "POST", headers: { "Content-Type": "application/json" } },
        SUPABASE_URL,
        SUPABASE_ANON_KEY,
        session
      )
    } catch {}
    onSignOut()
    navigate("/signin")
  }

  return (
    <nav className="flex flex-wrap items-center justify-between gap-4">
      <Link to="/" className="text-sm font-semibold tracking-[0.3em] text-text0">
        WRITER PRO
      </Link>
      <div className="flex flex-wrap items-center gap-2">
        <Link to="/features"><Button variant="secondary">Features</Button></Link>
        <Link to="/pricing"><Button variant="secondary">Pricing</Button></Link>
        <Link to="/support"><Button variant="secondary">Support</Button></Link>
        <Link to="/download"><Button variant="secondary">Download</Button></Link>
        <Link to="/billing"><Button variant="secondary">Dashboard</Button></Link>
        {session?.access_token ? (
          <Button variant="secondary" onClick={handleSignOut}>Sign Out</Button>
        ) : (
          <Link to="/signin"><Button variant="secondary">Sign In</Button></Link>
        )}
      </div>
    </nav>
  )
}
