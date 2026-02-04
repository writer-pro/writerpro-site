import { useEffect, useMemo, useState } from "react"
import { Search } from "lucide-react"
import { Button } from "../components/ui/button"
import { Switch } from "../components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs"
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "../lib/constants"
import type { Session } from "../lib/session"
import { refreshSessionIfNeeded, supabaseRequest } from "../lib/session"

const gradeOptions = ["All", "9", "10", "11", "12"]
const reviewOptions = ["All", "Light", "Medium", "Heavy"]

const projectsSeed = [
  { id: 1, name: "Global Warming Essay", grade: "11", review: "Medium", ai: false },
  { id: 2, name: "Rome vs Greece Compare", grade: "10", review: "Light", ai: true },
  { id: 3, name: "Macbeth Theme Analysis", grade: "12", review: "Heavy", ai: false },
  { id: 4, name: "Study Set: Biology Unit 3", grade: "11", review: "Light", ai: false },
]

interface DashboardProps {
  session: Session | null
  onSessionUpdate: (next: Session | null) => void
}

export function Dashboard({ session, onSessionUpdate }: DashboardProps) {
  const [mode, setMode] = useState("writer")
  const [search, setSearch] = useState("")
  const [gradeFilter, setGradeFilter] = useState("All")
  const [reviewFilter, setReviewFilter] = useState("All")
  const [aiOnly, setAiOnly] = useState(false)
  const [credits, setCredits] = useState<number | null>(null)
  const [status] = useState("Idle")

  useEffect(() => {
    const loadCredits = async () => {
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
      if (data?.[0]?.credits !== undefined) setCredits(data[0].credits)
    }
    loadCredits()
  }, [session, onSessionUpdate])

  const filtered = useMemo(() => {
    return projectsSeed.filter((project) => {
      if (aiOnly && !project.ai) return false
      if (gradeFilter !== "All" && project.grade !== gradeFilter) return false
      if (reviewFilter !== "All" && project.review !== reviewFilter) return false
      if (search && !project.name.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [search, gradeFilter, reviewFilter, aiOnly])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-[-0.02em]">Writer Pro</h1>
          <p className="text-sm text-text1">Credits: {credits ?? "—"}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Tabs value={mode} onValueChange={setMode}>
            <TabsList>
              <TabsTrigger value="writer">Writer</TabsTrigger>
              <TabsTrigger value="study">Study</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="secondary">Get Credits</Button>
        </div>
      </div>

      <div className="flex justify-center">
        <Button className="btn-primary px-8 py-3 text-base">+ NEW PROJECT</Button>
      </div>

      <div className="section-panel p-4 md:p-5 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-1 items-center gap-2 rounded-md border border-stroke0 bg-bg2 px-3 py-2">
            <Search className="h-4 w-4 text-text2" />
            <input
              className="w-full bg-transparent text-sm text-text0 placeholder:text-text2 focus:outline-none"
              placeholder="Search projects"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-text1">
            AI only
            <Switch checked={aiOnly} onCheckedChange={setAiOnly} aria-label="Toggle AI only" />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {gradeOptions.map((grade) => (
              <button
                key={grade}
                className={`chip ${gradeFilter === grade ? "chip-active" : ""}`}
                onClick={() => setGradeFilter(grade)}
              >
                {grade}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {reviewOptions.map((review) => (
              <button
                key={review}
                className={`chip ${reviewFilter === review ? "chip-active" : ""}`}
                onClick={() => setReviewFilter(review)}
              >
                {review}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="section-panel p-4 md:p-5 space-y-4">
        {filtered.map((project) => (
          <div
            key={project.id}
            className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-stroke0 bg-bg3/60 p-4 card-hover"
          >
            <div>
              <div className="text-sm font-semibold text-text0">{project.name}</div>
              <div className="text-xs text-text1">Grade {project.grade} • {project.review}</div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="primary">TYPE</Button>
              <Button size="sm" variant="secondary">EDIT</Button>
              <Button size="sm" variant="danger">DEL</Button>
            </div>
          </div>
        ))}
        {!filtered.length && (
          <div className="text-sm text-text2">No projects match your filters.</div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-text2">
        <div>Status: {status}</div>
        <Button variant="secondary" size="sm">Accessibility Settings</Button>
      </div>
    </div>
  )
}
