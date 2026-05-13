import { useNavigate } from 'react-router-dom'
import { OnboardingLayout } from '@/components/OnboardingLayout'
import { OnboardingFabricFeel, OnboardingFabricFeelHeader } from '@/components/OnboardingFabricFeel'

export default function OnboardingDenimFeel() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex items-center justify-center p-4 max-w-lg mx-auto w-full">
      <OnboardingLayout currentStep={5} headerContent={<OnboardingFabricFeelHeader />}>
        <OnboardingFabricFeel
          onContinue={() => navigate('/bridge')}
          onSkip={() => navigate('/bridge')}
        />
      </OnboardingLayout>
    </div>
  )
}
