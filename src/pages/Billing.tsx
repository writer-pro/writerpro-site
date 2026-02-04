import { useEffect, useMemo, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { PageHeader } from "../components/PageHeader"
import { FN_CREATE_CHECKOUT, FN_PORTAL, SUPABASE_ANON_KEY, SUPABASE_URL } from "../lib/constants"
import type { Session } from "../lib/session"
import { refreshSessionIfNeeded, supabaseRequest } from "../lib/session"

interface BillingProps {
  session: Session | null
  onSessionUpdate: (next: Session | null) => void
}

const monthlyPacks = [
  { id: "credits_65_monthly", label: "Monthly 65 (60 + 5 bonus) • $4.99 CAD" },
  { id: "credits_180_monthly", label: "Monthly 180 (160 + 20 bonus) • $11.99 CAD" },
  { id: "credits_430_monthly", label: "Monthly 430 (400 + 30 bonus) • $24.99 CAD" },
]
const oneTimePacks = [
  { id: "credits_100", label: "Buy 100 (no bonus) • $9.99 CAD" },
  { id: "credits_220", label: "Buy 220 (200 + 20 bonus) • $19.99 CAD" },
]

export function Billing({ session, onSessionUpdate }: BillingProps) {
  const [credits, setCredits] = useState<number | null>(null)
  const [status, setStatus] = useState("")
  const [accountEmail, setAccountEmail] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [params] = useSearchParams()
  const navigate = useNavigate()

  const requestedPack = params.get("pack_id") || ""

  const isSignedIn = !!session?.access_token

  useEffect(() => {
    const load = async () => {
      if (!session?.access_token) return
      const fresh = await refreshSessionIfNeeded(session, SUPABASE_URL, SUPABASE_ANON_KEY)
      if (fresh && fresh !== session) onSessionUpdate(fresh)
      const userRes = await supabaseRequest(
        "/auth/v1/user",
        { method: "GET" },
        SUPABASE_URL,
        SUPABASE_ANON_KEY,
        fresh ?? session
      )
      if (!userRes.ok) return
      const user = await userRes.json()
      setAccountEmail(user?.email ?? "")
      const email = encodeURIComponent(user?.email ?? "")
      const profileRes = await supabaseRequest(
        `/rest/v1/profiles?select=credits&email=eq.${email}`,
        { method: "GET" },
        SUPABASE_URL,
        SUPABASE_ANON_KEY,
        fresh ?? session
      )
      if (!profileRes.ok) return
      const data = await profileRes.json()
      setCredits(data?.[0]?.credits ?? null)
    }
    load()
  }, [session, onSessionUpdate])

  const startCheckout = async (packId: string) => {
    if (!session?.access_token) {
      navigate(`/signin?next=/billing?pack_id=${encodeURIComponent(packId)}`)
      return
    }
    const fresh = await refreshSessionIfNeeded(session, SUPABASE_URL, SUPABASE_ANON_KEY)
    if (fresh && fresh !== session) onSessionUpdate(fresh)
    setStatus("Opening checkout...")
    try {
      const res = await supabaseRequest(
        `/functions/v1/${FN_CREATE_CHECKOUT}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pack_id: packId, access_token: fresh?.access_token || session.access_token }),
        },
        SUPABASE_URL,
        SUPABASE_ANON_KEY,
        fresh ?? session
      )
      if (!res.ok) {
        const payload = await res.json().catch(() => null)
        setStatus(payload?.error || payload?.message || "Checkout failed.")
        return
      }
      const payload = await res.json()
      if (payload?.url) window.location.href = payload.url
    } catch (error: any) {
      setStatus(error?.message || "Checkout failed.")
    }
  }

  const openPortal = async () => {
    if (!session?.access_token) {
      navigate("/signin?next=/billing")
      return
    }
    const fresh = await refreshSessionIfNeeded(session, SUPABASE_URL, SUPABASE_ANON_KEY)
    if (fresh && fresh !== session) onSessionUpdate(fresh)
    setStatus("Opening portal...")
    const res = await supabaseRequest(
      `/functions/v1/${FN_PORTAL}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_token: fresh?.access_token || session.access_token }),
      },
      SUPABASE_URL,
      SUPABASE_ANON_KEY,
      fresh ?? session
    )
    if (!res.ok) {
      const payload = await res.json().catch(() => null)
      setStatus(payload?.error || payload?.message || "Portal failed.")
      return
    }
    const payload = await res.json()
    if (payload?.url) window.location.href = payload.url
  }

  const refreshCredits = async () => {
    if (!session?.access_token) return
    const userRes = await supabaseRequest(
      "/auth/v1/user",
      { method: "GET" },
      SUPABASE_URL,
      SUPABASE_ANON_KEY,
      session
    )
    if (!userRes.ok) return
    const user = await userRes.json()
    const email = encodeURIComponent(user?.email ?? "")
    const profileRes = await supabaseRequest(
      `/rest/v1/profiles?select=credits&email=eq.${email}`,
      { method: "GET" },
      SUPABASE_URL,
      SUPABASE_ANON_KEY,
      session
    )
    if (!profileRes.ok) return
    const data = await profileRes.json()
    setCredits(data?.[0]?.credits ?? null)
  }

  const saveAccount = async () => {
    if (!session?.access_token) {
      setStatus("Please sign in to update account details.")
      return
    }
    if (!accountEmail.includes("@")) {
      setStatus("Enter a valid email address.")
      return
    }
    if ((newPassword || confirmPassword || currentPassword) && newPassword !== confirmPassword) {
      setStatus("New password confirmation does not match.")
      return
    }
    setStatus("Saving account changes...")
    let updated = false
    const userRes = await supabaseRequest(
      "/auth/v1/user",
      { method: "GET" },
      SUPABASE_URL,
      SUPABASE_ANON_KEY,
      session
    )
    const user = userRes.ok ? await userRes.json() : null
    const currentEmail = user?.email ?? ""
    if (accountEmail && currentEmail && accountEmail !== currentEmail) {
      const emailRes = await supabaseRequest(
        "/auth/v1/user",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: accountEmail }),
        },
        SUPABASE_URL,
        SUPABASE_ANON_KEY,
        session
      )
      if (emailRes.ok) {
        setStatus("Email update requested. Check your inbox to confirm.")
        updated = true
      }
    }
    if (currentPassword && newPassword) {
      const verifyRes = await supabaseRequest(
        "/auth/v1/token?grant_type=password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: accountEmail, password: currentPassword }),
        },
        SUPABASE_URL,
        SUPABASE_ANON_KEY,
        null
      )
      if (!verifyRes.ok) {
        setStatus("Current password is incorrect.")
        return
      }
      const nextSession = await verifyRes.json()
      onSessionUpdate(nextSession)
      const passRes = await supabaseRequest(
        "/auth/v1/user",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: newPassword }),
        },
        SUPABASE_URL,
        SUPABASE_ANON_KEY,
        nextSession
      )
      if (passRes.ok) {
        setStatus("Password updated.")
        updated = true
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
        setPasswordOpen(false)
      }
    }
    if (!updated) setStatus("No changes detected.")
  }

  const highlightPack = useMemo(() => requestedPack, [requestedPack])

  return (
    <div className="space-y-6">
      <PageHeader title="Billing" subtitle="Manage credits and subscription details in one place." />

      {!isSignedIn && (
        <div className="section-panel p-6">
          <p className="text-sm text-text1">Sign in to manage credits.</p>
          <Button className="mt-4" onClick={() => navigate("/signin?next=/billing")}>Sign In</Button>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="section-panel p-5 md:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold">Account Status</h3>
              <p className="text-xs text-text2">{isSignedIn ? "Signed in" : "Not signed in"}</p>
            </div>
            <div className="text-2xl font-semibold">Balance: {credits ?? "—"}</div>
          </div>
          <p className="mt-3 text-xs text-text2">{status}</p>
        </div>

        <div className="section-panel p-5">
          <h3 className="text-base font-semibold">Subscriptions</h3>
          <p className="text-xs text-text2">Best value for steady weekly writing.</p>
          <div className="mt-4 space-y-2">
            {monthlyPacks.map((pack) => (
              <Button
                key={pack.id}
                variant={highlightPack === pack.id ? "primary" : "secondary"}
                className="w-full justify-start"
                onClick={() => startCheckout(pack.id)}
              >
                {pack.label}
              </Button>
            ))}
          </div>
          <Button variant="secondary" className="mt-4" onClick={openPortal}>Manage Subscription</Button>
        </div>

        <div className="section-panel p-5">
          <h3 className="text-base font-semibold">One-Time Credits</h3>
          <p className="text-xs text-text2">One-off top-ups for larger essays or study sets.</p>
          <div className="mt-4 space-y-2">
            {oneTimePacks.map((pack) => (
              <Button
                key={pack.id}
                variant={highlightPack === pack.id ? "primary" : "secondary"}
                className="w-full justify-start"
                onClick={() => startCheckout(pack.id)}
              >
                {pack.label}
              </Button>
            ))}
          </div>
          <Button variant="secondary" className="mt-4" onClick={refreshCredits}>Refresh Credits</Button>
        </div>

        <div className="section-panel p-5 md:col-span-2">
          <h3 className="text-base font-semibold">Account Details</h3>
          <p className="text-xs text-text2">Update your email and password securely.</p>
          <div className="mt-4 space-y-3">
            <Input value={accountEmail} onChange={(e) => setAccountEmail(e.target.value)} placeholder="Account email" />
            <Button variant="secondary" onClick={() => setPasswordOpen((prev) => !prev)}>
              {passwordOpen ? "Hide Password Fields" : "Change Password"}
            </Button>
            {passwordOpen && (
              <div className="grid gap-3 md:grid-cols-2">
                <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Current password" />
                <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New password" />
                <Input className="md:col-span-2" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password" />
              </div>
            )}
            <Button onClick={saveAccount}>Save Account Changes</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
