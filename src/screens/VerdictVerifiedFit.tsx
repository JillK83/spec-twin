import { VerdictCard } from '@/components/VerdictCard'
import { DemoSelectorStrip } from '@/components/DemoSelectorStrip'
import { SCENARIO_1, verifiedPillars } from '@/components/verdictSampleData'

export default function VerdictVerifiedFit() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 pt-16 max-w-xl mx-auto w-full">
      <DemoSelectorStrip />
      <VerdictCard
        state="verified"
        garmentName={SCENARIO_1.garmentName}
        anchorLabel={SCENARIO_1.anchorLabel}
        recommendedSize={SCENARIO_1.recommendedSize}
        pillars={verifiedPillars}
      />
    </div>
  )
}
