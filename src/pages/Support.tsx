import { useState } from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { PageHeader } from "../components/PageHeader"
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "../lib/constants"
import type { Session } from "../lib/session"

interface SupportProps {
  session: Session | null
}

export function Support({ session }: SupportProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [topic, setTopic] = useState("Billing")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState("")
  const [loading, setLoading] = useState(false)

  const submitTicket = async () => {
    if (!email || !message) {
      setStatus("Please provide an email and a message.")
      return
    }
    setLoading(true)
    setStatus("Sending support request...")
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/support-ticket`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({
          name,
          email,
          topic,
          message,
          page_url: window.location.href,
        }),
      })
      if (!res.ok) {
        const payload = await res.json().catch(() => null)
        setStatus(payload?.error || payload?.message || "Support request failed.")
        return
      }
      setStatus("Ticket submitted. We’ll reply soon.")
      setName("")
      setEmail("")
      setMessage("")
    } catch (error: any) {
      setStatus(error?.message || "Support request failed.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Support" subtitle="Tell us what you need and we’ll get back to you quickly." />

      <div className="section-panel p-6 max-w-2xl">
        <div className="space-y-4">
          <Input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input placeholder="Account email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <select
            className="input"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          >
            <option>Billing</option>
            <option>Account</option>
            <option>Writer Pro</option>
            <option>Study Pro</option>
            <option>Bug</option>
            <option>Other</option>
          </select>
          <textarea
            className="input min-h-[140px]"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe the issue, steps to reproduce, and device info."
          />
          <Button onClick={submitTicket} disabled={loading}>Send Support Request</Button>
          <p className="text-xs text-text2">{status}</p>
        </div>
      </div>
    </div>
  )
}
