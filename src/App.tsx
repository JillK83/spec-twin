import { Routes, Route } from 'react-router-dom'
import { Toaster } from './components/ui/magic/Sonner'
import CoverScreen from './components/CoverScreen'
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

export default function App() {
  return (
    <>
    <Toaster position="bottom-center" />
    <Routes>
      <Route path="/" element={<CoverScreen />} />
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
    </Routes>
    </>
  )
}
