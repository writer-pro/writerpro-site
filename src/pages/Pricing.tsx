import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { PageHeader } from "../components/PageHeader"
import type { Session } from "../lib/session"

const packs = [
  { id: "credits_65_monthly", title: "65 Credits", price: "$4.99 CAD / month", meta: "Includes 5 bonus credits (60 + 5)" },
  { id: "credits_100", title: "100 Credits", price: "$9.99 CAD one-time", meta: "Straight value (100)" },
  { id: "credits_180_monthly", title: "180 Credits", price: "$11.99 CAD / month", meta: "Includes 20 bonus credits (160 + 20)" },
  { id: "credits_220", title: "220 Credits", price: "$19.99 CAD one-time", meta: "Includes 20 bonus credits (200 + 20)" },
  { id: "credits_430_monthly", title: "430 Credits", price: "$24.99 CAD / month", meta: "Includes 30 bonus credits (400 + 30)" },
]

interface PricingProps {
  session: Session | null
}

export function Pricing({ session }: PricingProps) {
  const navigate = useNavigate()

  const handlePick = (packId: string) => {
    if (!session?.access_token) {
      navigate(`/signin?next=/billing?pack_id=${encodeURIComponent(packId)}`)
      return
    }
    navigate(`/billing?pack_id=${encodeURIComponent(packId)}`)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pricing"
        subtitle="Pick a plan and jump straight to your dashboard to complete purchase."
        actions={<Button variant="secondary" onClick={() => navigate("/billing")}>Open Dashboard</Button>}
      />

      <div className="section-panel p-6">
        <div className="grid gap-4 md:grid-cols-2">
          {packs.map((pack) => (
            <button
              key={pack.id}
              onClick={() => handlePick(pack.id)}
              className="card-hover text-left rounded-lg border border-stroke0 bg-bg3/60 p-4"
            >
              <div className="text-base font-semibold text-text0">{pack.title}</div>
              <div className="text-sm text-text1 mt-1">{pack.price}</div>
              <div className="text-xs text-text2 mt-2">{pack.meta}</div>
            </button>
          ))}
        </div>
        <div className="mt-4 text-sm text-text2">
          1 credit = 300 characters. Study Pro uses 0.5 credits per flashcard.
        </div>
      </div>
    </div>
  )
}
