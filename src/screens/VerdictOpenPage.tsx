import { useNavigate, useLocation } from 'react-router-dom'
import { VerdictCard } from '@/components/VerdictCard'
import type { VerdictState, Pillar, PillarStatus } from '@/components/VerdictCard'
import { Button } from '@/components/ui/magic/Button'
import type { AuditOutput } from '@/lib/audit'

export default function VerdictOpenPage() {
  const navigate = useNavigate()
  const location = useLocation()

  console.log('VerdictOpenPage location.state:', location.state)

  const pageState = location.state as {
    auditOutput?: AuditOutput
    targetBrand?: string
    targetModel?: string
    anchorLabel?: string
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
    {
      id: 'waist-hip',
      name: 'Waist and Hip Fit',
      headline: auditOutput.riseMismatchWarning
        ? (auditOutput.riseMismatchNote ?? 'Rise differs from your preference.')
        : auditOutput.contractGate
          ? (auditOutput.contractGateUserText ?? 'Sizing system differs from your anchor.')
          : 'Rise and fit contract align with your anchor.',
      status: pillarStatus(auditOutput.riseMismatchWarning || auditOutput.contractGate),
      detail: auditOutput.riseMismatchNote
        ?? (auditOutput.contractGate
          ? (auditOutput.contractGateUserText ?? 'Sizing system differs from your anchor.')
          : 'Rise and fit contract align with your anchor.'),
    },
    {
      id: 'shape',
      name: 'Shape Retention',
      headline: auditOutput.recoveryWarning
        ? (auditOutput.recoveryNote ?? 'Recovery profile differs from your anchor.')
        : 'Recovery profile is comparable to your anchor.',
      status: pillarStatus(auditOutput.recoveryWarning),
      detail: auditOutput.recoveryNote ?? 'Shape retention should be comparable to your anchor item.',
    },
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
        sizeNote={auditOutput.inseamNote ?? undefined}
        pillars={pillars}
        advisoryBannerText={auditOutput.riseMismatchNote ?? undefined}
        onReset={() => navigate('/audit/new')}
        footerNote={
          auditOutput.parserError ? `Parser note: ${auditOutput.parserError}` : undefined
        }
      />
    </div>
  )
}
