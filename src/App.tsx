import { Routes, Route, Navigate } from 'react-router-dom'

// Placeholder screens — will be replaced screen by screen
const Placeholder = ({ name }: { name: string }) => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="border-4 border-border rounded-2xl p-8 shadow-hard bg-card max-w-md text-center">
      <p className="font-heading font-black text-2xl uppercase tracking-tight">{name}</p>
      <p className="font-mono text-muted-foreground mt-2 text-sm">Screen placeholder</p>
    </div>
  </div>
)

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/onboarding/1" replace />} />
      <Route path="/onboarding/1" element={<Placeholder name="Onboarding — Rise" />} />
      <Route path="/onboarding/2" element={<Placeholder name="Onboarding — Silhouette" />} />
      <Route path="/onboarding/3" element={<Placeholder name="Onboarding — Height" />} />
      <Route path="/onboarding/4" element={<Placeholder name="Onboarding — Body Shape" />} />
      <Route path="/onboarding/5" element={<Placeholder name="Onboarding — Denim Feel" />} />
      <Route path="/bridge" element={<Placeholder name="Profile Synced" />} />
      <Route path="/anchor/new" element={<Placeholder name="New Anchor" />} />
      <Route path="/vault" element={<Placeholder name="Fit Vault" />} />
      <Route path="/audit/new" element={<Placeholder name="Audit New Item" />} />
      <Route path="/verdict/1" element={<Placeholder name="Verdict — Verified Fit" />} />
      <Route path="/verdict/2" element={<Placeholder name="Verdict — Fit Advisory" />} />
      <Route path="/verdict/3" element={<Placeholder name="Verdict — Smart Estimate" />} />
      <Route path="/verdict/4" element={<Placeholder name="Verdict — Reduced Card" />} />
    </Routes>
  )
}
