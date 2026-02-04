import { PageHeader } from "../components/PageHeader"

export function Terms() {
  return (
    <div className="space-y-6">
      <PageHeader title="Terms" subtitle="By using Writer Pro, you agree to the following terms." />
      <div className="section-panel p-6 text-sm text-text1 space-y-4">
        <p>By downloading or using Writer Pro, you agree to these Terms.</p>
        <p>Do not abuse, resell, or reverse engineer the service.</p>
        <p>We may update these terms periodically.</p>
      </div>
    </div>
  )
}
