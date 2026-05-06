import { useNavigate } from 'react-router-dom'
import { OnboardingLayout } from '@/components/OnboardingLayout'
import { OnboardingSilhouette as OnboardingSilhouetteForm, OnboardingSilhouetteHeader } from '@/components/OnboardingSilhouette'

export default function OnboardingSilhouette() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <OnboardingLayout currentStep={2} headerContent={<OnboardingSilhouetteHeader />}>
        <OnboardingSilhouetteForm onContinue={() => navigate('/onboarding/3')} />
      </OnboardingLayout>
    </div>
  )
}
