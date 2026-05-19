import { Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from './components/ui/magic/Sonner'
import { AppModeProvider } from './contexts/AppModeContext'
import { DemoSelectorStrip } from './components/DemoSelectorStrip'
import CoverDemo from './components/CoverDemo'
import CoverOpen from './components/CoverOpen'
import OnboardingRise from './screens/OnboardingRise'
import OnboardingSilhouette from './screens/OnboardingSilhouette'
import OnboardingHeight from './screens/OnboardingHeight'
import OnboardingBodyShape from './screens/OnboardingBodyShape'
import OnboardingDenimFeel from './screens/OnboardingDenimFeel'
import Bridge from './screens/Bridge'
import AnchorNew from './screens/AnchorNew'
import Vault from './screens/Vault'
import AuditNew from './screens/AuditNew'
import VerdictVerifiedFit from './screens/VerdictVerifiedFit'
import VerdictFitAdvisory from './screens/VerdictFitAdvisory'
import VerdictSmartEstimate from './screens/VerdictSmartEstimate'
import VerdictOpenPage from './screens/VerdictOpenPage'

export default function App() {
  const { pathname } = useLocation()
  const isOpenMode = pathname.startsWith('/onboarding') ||
    pathname === '/bridge' ||
    pathname === '/anchor/new' ||
    pathname === '/audit/new' ||
    pathname === '/verdict/open'

  return (
    <AppModeProvider>
    <Toaster position="bottom-center" />
    {!isOpenMode && <DemoSelectorStrip />}
    <Routes>
      <Route path="/" element={<CoverDemo />} />
      <Route path="/open" element={<CoverOpen />} />
      <Route path="/onboarding/1" element={<OnboardingRise />} />
      <Route path="/onboarding/2" element={<OnboardingSilhouette />} />
      <Route path="/onboarding/3" element={<OnboardingHeight />} />
      <Route path="/onboarding/4" element={<OnboardingBodyShape />} />
      <Route path="/onboarding/5" element={<OnboardingDenimFeel />} />
      <Route path="/bridge" element={<Bridge />} />
      <Route path="/anchor/new" element={<AnchorNew />} />
      <Route path="/vault" element={<Vault />} />
      <Route path="/audit/new" element={<AuditNew />} />
      <Route path="/verdict/1" element={<VerdictVerifiedFit />} />
      <Route path="/verdict/2" element={<VerdictFitAdvisory />} />
      <Route path="/verdict/3" element={<VerdictSmartEstimate />} />
      <Route path="/verdict/4" element={<VerdictSmartEstimate />} />
      <Route path="/verdict/open" element={<VerdictOpenPage />} />
    </Routes>
    </AppModeProvider>
  )
}
