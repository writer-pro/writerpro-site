import { useNavigate, useSearchParams } from "react-router-dom"
import { Button } from "../components/ui/button"
import { PageHeader } from "../components/PageHeader"
import type { Session } from "../lib/session"

interface DownloadProps {
  session: Session | null
}

export function Download({ session }: DownloadProps) {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const openModal = params.get("download") === "1"

  const handleDownload = () => {
    if (!session?.access_token) {
      navigate("/signin?next=/download?download=1")
      return
    }
    window.location.href = `${import.meta.env.BASE_URL}WriterPro.dmg`
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Download"
        subtitle="Grab the latest macOS build with verified updates and version info."
        actions={<Button variant="secondary" onClick={handleDownload}>Download for macOS</Button>}
      />

      <div className="section-panel p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <div className="text-xs text-text2">Version</div>
            <div className="text-lg font-semibold">1.2.3</div>
          </div>
          <div>
            <div className="text-xs text-text2">Build</div>
            <div className="text-lg font-semibold">14</div>
          </div>
          <div>
            <div className="text-xs text-text2">Updated</div>
            <div className="text-lg font-semibold">Jan 20, 2025</div>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button onClick={handleDownload}>Download Now</Button>
          <Button variant="secondary" onClick={() => navigate("/")}>Back to Home</Button>
        </div>
      </div>

      {!session?.access_token && (
        <div className="section-panel p-4 text-sm text-text2">
          Sign in required before downloading.
        </div>
      )}

      {openModal && session?.access_token && (
        <div className="section-panel p-4 text-sm text-text2">
          By downloading Writer Pro, you agree to the Terms and Privacy Policy.
        </div>
      )}
    </div>
  )
}
