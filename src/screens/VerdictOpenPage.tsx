import { useNavigate, useLocation } from 'react-router-dom'
import { VerdictCard } from '@/components/VerdictCard'
import type { VerdictState, Pillar, PillarStatus } from '@/components/VerdictCard'
import { Button } from '@/components/ui/magic/Button'
import type { AuditOutput } from '@/lib/audit'

// Waist and Hip Fit copy map — 9 states per locked voice spec.
// Pending wiring (requires AuditOutput extension):
//   - riseDirection (higher/lower): needs userPrimaryRise + targetRise comparison
//   - fitDirection (smaller/larger): needs fitDelta sign exposed in AuditOutput
//   - targetSizeOriginal: needs product_audits.target_size_original in AuditOutput
//   - brand offset reason codes (euro_slim, rigid_bias, vanity_high): not yet in AuditOutput
// anchorBrand: passed via pageState.anchorBrand — needs wiring from AuditNewItemForm
function getWaistHipPillar(
  output: AuditOutput,
  verdictState: VerdictState,
  anchorBrand: string,
): Pillar {
  const { riseMismatchWarning, contractGate, contractGateReason, coldStart } = output

  const triggered = riseMismatchWarning || contractGate
  const status: PillarStatus =
    verdictState === 'estimate' ? 'estimate'
    : triggered ? 'advisory'
    : 'verified'

  // State 9 — range → precision HARD_STOP: sizing systems incompatible (purple)
  if (contractGateReason === 'CONTRACT_RANGE_TO_PRECISION') {
    return {
      id: 'waist-hip',
      name: 'Waist and Hip Fit',
      status,
      headline: "Can't confirm waist fit",
      detail: "This item's sizing system doesn't translate cleanly to your numeric anchor size. We can't confidently resolve the waist and hip fit. Check the brand's measurement guide before buying.",
    }
  }

  // State 8 — cold start, no waist-hip gate (amber)
  if (coldStart && !riseMismatchWarning && !contractGate) {
    return {
      id: 'waist-hip',
      name: 'Waist and Hip Fit',
      status,
      headline: 'New to our system',
      detail: "We don't have enough data on how this brand fits yet. The waist and hip recommendation is a starting point — check the brand's size guide before ordering.",
    }
  }

  // State 3 — rise mismatch (amber)
  // State 4 (rise + brand offset) collapses here until fitDirection is wired
  // {higher/lower} in detail pending riseDirection wiring
  if (riseMismatchWarning) {
    return {
      id: 'waist-hip',
      name: 'Waist and Hip Fit',
      status,
      headline: `Different rise than your ${anchorBrand}`,
      detail: `This style sits differently than your ${anchorBrand}. The waist and hips will feel different as a result — factor that in before ordering.`,
    }
  }

  // States 5–7 — brand offset reason codes (euro_slim, rigid_bias, vanity_high)
  // Not yet implementable — requires reason codes in AuditOutput

  // State 1 — clean match (lime)
  // State 2 (size adjustment, no gates) collapses here until fitDirection is wired
  return {
    id: 'waist-hip',
    name: 'Waist and Hip Fit',
    status,
    headline: `Fits like your ${anchorBrand}`,
    detail: `This sits and fits the same way as your ${anchorBrand}. You should be able to order your usual size with confidence.`,
  }
}

function getShapeRetentionPillar(output: AuditOutput, anchorBrand: string): Pillar {
  const { recoveryWarning, targetRecoveryClass } = output

  const status: PillarStatus =
    (targetRecoveryClass === 'unknown' || (recoveryWarning && targetRecoveryClass === 'low'))
      ? 'advisory'
      : 'verified'

  // State 1 — unknown recovery data (amber)
  if (targetRecoveryClass === 'unknown') {
    return {
      id: 'shape',
      name: 'Shape Retention',
      status,
      headline: 'Recovery data unavailable',
      detail: "We don't have polyester data for this item, so we can't predict how well it holds its shape through wear. Expect standard denim behavior.",
    }
  }

  // State 2 — downgrade: target has no recovery, anchor does (amber)
  if (recoveryWarning && targetRecoveryClass === 'low') {
    return {
      id: 'shape',
      name: 'Shape Retention',
      status,
      headline: `May loosen more than your ${anchorBrand}`,
      detail: `Your ${anchorBrand} has recovery fiber that helps it bounce back. This item doesn't — it may relax and loosen slightly over time.`,
    }
  }

  // State 6 — upgrade: target has more recovery than anchor (lime)
  if (recoveryWarning) {
    return {
      id: 'shape',
      name: 'Shape Retention',
      status,
      headline: `Holds shape better than your ${anchorBrand}`,
      detail: `This item has more recovery fiber than your ${anchorBrand}. It should bounce back more reliably and hold its shape through wear.`,
    }
  }

  // State 3 — both low (lime)
  if (targetRecoveryClass === 'low') {
    return {
      id: 'shape',
      name: 'Shape Retention',
      status,
      headline: `Matches your ${anchorBrand}`,
      detail: `Both items have no recovery fiber. Expect a similar break-in pattern — the fabric may relax slightly with wear over time.`,
    }
  }

  // State 4 — both moderate (lime)
  if (targetRecoveryClass === 'moderate') {
    return {
      id: 'shape',
      name: 'Shape Retention',
      status,
      headline: `Matches your ${anchorBrand}`,
      detail: `Both items have a similar fiber profile. Shape retention should be consistent — expect the fit to hold through the day.`,
    }
  }

  // State 5 — both high (lime)
  return {
    id: 'shape',
    name: 'Shape Retention',
    status,
    headline: `Matches your ${anchorBrand}`,
    detail: `Both items have strong recovery fiber. The fit should snap back and hold its shape reliably through wear.`,
  }
}

export default function VerdictOpenPage() {
  const navigate = useNavigate()
  const location = useLocation()

  console.log('VerdictOpenPage location.state:', location.state)

  const pageState = location.state as {
    auditOutput?: AuditOutput
    targetBrand?: string
    targetModel?: string
    anchorLabel?: string
    anchorBrand?: string
  } | null

  const auditOutput = pageState?.auditOutput

  if (!auditOutput) {
    return (
      <div className="min-h-screen w-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-2xl mx-auto text-center space-y-6">
          <p className="font-black text-2xl uppercase tracking-tight">No audit result found</p>
          <p className="text-muted-foreground font-mono text-sm">
            Navigate here from the audit form to see your verdict.
          </p>
          <Button
            className="bg-primary text-primary-foreground border-2 border-border font-black text-base py-6 px-8 uppercase tracking-wide shadow-hard"
            onClick={() => navigate('/audit/new')}
          >
            Run an Audit
          </Button>
        </div>
      </div>
    )
  }

  const verdictStateMap: Record<string, VerdictState> = {
    verified_fit: 'verified',
    fit_advisory: 'advisory',
    smart_estimate: 'estimate',
  }
  const verdictState: VerdictState = verdictStateMap[auditOutput.outputState] ?? 'estimate'

  function pillarStatus(triggered: boolean): PillarStatus {
    if (verdictState === 'estimate') return 'estimate'
    return triggered ? 'advisory' : 'verified'
  }

  const anchorBrand = pageState?.anchorBrand ?? 'your anchor'

  const pillars: Pillar[] = [
    {
      id: 'fabric',
      name: 'Fabric Behavior',
      headline: auditOutput.fabricGate
        ? (auditOutput.fabricGateUserText ?? 'Fabric class differs from your anchor.')
        : 'Fabric class matches your anchor.',
      status: pillarStatus(auditOutput.fabricGate),
      detail: auditOutput.fabricGate
        ? (auditOutput.fabricGateUserText ?? 'Fabric class differs from your anchor.')
        : 'The fabric composition is comparable to your anchor item.',
    },
    getWaistHipPillar(auditOutput, verdictState, anchorBrand),
    getShapeRetentionPillar(auditOutput, anchorBrand),
  ]

  const garmentName =
    [pageState?.targetBrand, pageState?.targetModel].filter(Boolean).join(' ') || 'Audited Item'

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <VerdictCard
        state={verdictState}
        garmentName={garmentName}
        anchorLabel={pageState?.anchorLabel ?? 'Your anchor'}
        recommendedSize={auditOutput.recommendedSize}
        sizeNote={
          !auditOutput.inseamAvailable
            ? 'Inseam not available — check brand size guide'
            : (auditOutput.inseamNote ?? undefined)
        }
        pillars={pillars}
        advisoryBannerText={auditOutput.riseMismatchNote ?? undefined}
        onReset={() => navigate('/audit/new')}
        footerNote={
          auditOutput.coldStart
            ? 'New to our system — treat this as a starting point.'
            : auditOutput.parserError
              ? `Parser note: ${auditOutput.parserError}`
              : undefined
        }
      />
    </div>
  )
}
