import { VerdictCard } from '@/components/VerdictCard'
import { SCENARIO_2, advisoryPillars, ADVISORY_BANNER_TEXT } from '@/components/verdictSampleData'

export default function VerdictFitAdvisory() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 pt-16">
      <VerdictCard
        state="advisory"
        garmentName={SCENARIO_2.garmentName}
        anchorLabel={SCENARIO_2.anchorLabel}
        recommendedSize={SCENARIO_2.recommendedSize}
        pillars={advisoryPillars}
        advisoryBannerText={ADVISORY_BANNER_TEXT}
        sizeNote={SCENARIO_2.sizeNote}
        footerNote={SCENARIO_2.footerNote}
      />
    </div>
  )
}
