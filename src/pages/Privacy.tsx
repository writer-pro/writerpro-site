import { PageHeader } from "../components/PageHeader"

export function Privacy() {
  return (
    <div className="space-y-6">
      <PageHeader title="Privacy" subtitle="We respect your privacy and protect your data." />
      <div className="section-panel p-6 text-sm text-text1 space-y-4">
        <p>We store only the data needed to run your account and credits.</p>
        <p>We do not sell your information to third parties.</p>
        <p>Contact support for data deletion requests.</p>
      </div>
    </div>
  )
}
