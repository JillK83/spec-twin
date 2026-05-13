import { Card, CardHeader } from './ui/magic/Card'

interface OnboardingLayoutProps {
  currentStep: number
  headerContent: React.ReactNode
  children: React.ReactNode
}

export function OnboardingLayout({ currentStep, headerContent, children }: OnboardingLayoutProps) {
  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg">
    <Card className="onboarding-container">
      {/* Header with Progress */}
      <div className="bg-background border-b-2 border-border p-4 sm:p-6">
        {/* Progress Indicator */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3, 4, 5].map((step) => (
            <div
              key={step}
              className={`h-3 flex-1 rounded-full border-2 border-border ${step <= currentStep ? 'bg-secondary shadow-[2px_2px_0px_0px_var(--border)]' : 'bg-muted'}`}
            />
          ))}
        </div>
        <CardHeader className="p-0">{headerContent}</CardHeader>
      </div>
      {children}
    </Card>
      </div>
    </div>
  )
}
