import { useNavigate } from 'react-router-dom'
import { OnboardingLayout } from '@/components/OnboardingLayout'
import { OnboardingRisePreference, OnboardingRisePreferenceHeader } from '@/components/OnboardingRisePreference'

export default function OnboardingRise() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <OnboardingLayout currentStep={1} headerContent={<OnboardingRisePreferenceHeader />}>
        <OnboardingRisePreference onContinue={() => navigate('/onboarding/2')} />
      </OnboardingLayout>
    </div>
  )
}
