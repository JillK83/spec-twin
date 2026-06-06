import { VerdictCard } from '@/components/VerdictCard'
import { SCENARIO_3, estimatePillars } from '@/components/verdictSampleData'
export default function VerdictSmartEstimate() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 pt-16">
      <VerdictCard
        state="estimate"
        garmentName={SCENARIO_3.garmentName}
        anchorLabel={SCENARIO_3.anchorLabel}
        recommendedSize="See brand size guide"
        pillars={estimatePillars}
        bannerText={SCENARIO_3.bannerText}
        footerNote={SCENARIO_3.footerNote}
      />
    </div>
  )
}
