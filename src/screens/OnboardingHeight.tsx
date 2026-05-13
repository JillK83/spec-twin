import { useNavigate } from 'react-router-dom'
import { OnboardingLayout } from '@/components/OnboardingLayout'
import { OnboardingHeight as OnboardingHeightForm, OnboardingHeightHeader } from '@/components/OnboardingHeight'

export default function OnboardingHeight() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex items-center justify-center p-4 max-w-lg mx-auto w-full">
      <OnboardingLayout currentStep={3} headerContent={<OnboardingHeightHeader />}>
        <OnboardingHeightForm onContinue={() => navigate('/onboarding/4')} />
      </OnboardingLayout>
    </div>
  )
}
