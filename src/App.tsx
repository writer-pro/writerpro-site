import { HashRouter, Route, Routes, Navigate } from "react-router-dom"
import { Shell } from "./components/Shell"
import { useSession } from "./hooks/useSession"
import { Dashboard } from "./pages/Dashboard"
import { Features } from "./pages/Features"
import { Pricing } from "./pages/Pricing"
import { Support } from "./pages/Support"
import { Download } from "./pages/Download"
import { Billing } from "./pages/Billing"
import { SignIn } from "./pages/SignIn"
import { Terms } from "./pages/Terms"
import { Privacy } from "./pages/Privacy"

export default function App() {
  const { session, setSession } = useSession()

  return (
    <HashRouter>
      <Shell session={session} onSignOut={() => setSession(null)}>
        <Routes>
          <Route path="/" element={<Dashboard session={session} onSessionUpdate={setSession} />} />
          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<Pricing session={session} />} />
          <Route path="/support" element={<Support session={session} />} />
          <Route path="/download" element={<Download session={session} />} />
          <Route path="/billing" element={<Billing session={session} onSessionUpdate={setSession} />} />
          <Route path="/signin" element={<SignIn onSessionUpdate={setSession} />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Shell>
    </HashRouter>
  )
}
