import { PageHeader } from "../components/PageHeader"

export function Features() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Features"
        subtitle="Every tool you need to write, study, and deliver on time — in one place."
      />

      <div className="grid gap-4 md:grid-cols-2">
        {[
          { title: "Project Dashboard", desc: "Manage every essay or study set with clean project cards and quick actions." },
          { title: "Humanized Typing", desc: "Natural rhythm, pauses, and backspaces that feel like real typing." },
          { title: "Smart Presets", desc: "Grade, review level, and speed presets update live as you type." },
          { title: "Study Pro", desc: "Flashcards, quizzes, and rapid review with smart grading." },
          { title: "Smart Brief", desc: "Preview essay type, time estimate, and credit cost before saving." },
          { title: "Predictive Guardrails", desc: "Warnings for long sessions, low credits, and heavy review." },
        ].map((item) => (
          <div key={item.title} className="section-panel p-5 card-hover">
            <div className="text-base font-semibold">{item.title}</div>
            <p className="mt-2 text-sm text-text1">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
