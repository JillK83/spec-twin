import { useNavigate } from 'react-router-dom'
import { OnboardingLayout } from '@/components/OnboardingLayout'
import { OnboardingBodyFrame, OnboardingBodyFrameHeader } from '@/components/OnboardingBodyFrame'

export default function OnboardingBodyShape() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <OnboardingLayout currentStep={4} headerContent={<OnboardingBodyFrameHeader />}>
        <OnboardingBodyFrame
          onContinue={() => navigate('/onboarding/5')}
          onSkip={() => navigate('/onboarding/5')}
        />
      </OnboardingLayout>
    </div>
  )
}
