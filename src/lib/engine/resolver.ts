import type { GateInputs, ResolverResult, ConfidenceLevel } from './types'

// Output state resolution — priority order per SPEC_TWIN_LOGIC.md §10:
//   1. Size cap triggered                                  → smart_estimate
//   2. Any HARD_STOP gate                                  → smart_estimate
//   3. Fabric SOFT_WARNING + sizeAdjustment ≥ 2 (§10)    → smart_estimate
//   4. Any SOFT_WARNING / recovery                         → fit_advisory
//   5. Clean match                                         → verified_fit
//
// Confidence level rules per SPEC_TWIN_LOGIC.md §12:
//   LOW    — hard stop, size cap, two-class fabric delta, multiple gates
//   MEDIUM — one soft warning, cold start, or adjacent fabric class (no gate)
//   HIGH   — no gates, no cold start, same fabric class, same contract type

function deriveConfidenceLevel(gates: GateInputs): ConfidenceLevel {
  if (gates.sizeCap) return 'LOW'

  const hardStop =
    gates.fabricGate.type   === 'HARD_STOP' ||
    gates.contractGate.type === 'HARD_STOP'
  if (hardStop) return 'LOW'

  const firedCount = [
    gates.fabricGate.fired,
    gates.contractGate.fired,
    gates.riseGate.fired,
    gates.recoveryWarning,
  ].filter(Boolean).length

  if (firedCount > 1) return 'LOW'

  if (firedCount >= 1)                    return 'MEDIUM'
  if (gates.coldStart)                    return 'MEDIUM'
  if (gates.fabricGate.classesApart === 1) return 'MEDIUM'  // adjacent, no gate

  return 'HIGH'
}

export function resolveOutputState(gates: GateInputs): ResolverResult {
  const fired: string[] = []
  if (gates.fabricGate.fired   && gates.fabricGate.reasonCode)   fired.push(gates.fabricGate.reasonCode)
  if (gates.contractGate.fired && gates.contractGate.reasonCode) fired.push(gates.contractGate.reasonCode)
  if (gates.riseGate.fired     && gates.riseGate.reasonCode)     fired.push(gates.riseGate.reasonCode)
  if (gates.recoveryWarning)                                      fired.push('RECOVERY_WARNING')

  const confidenceLevel = deriveConfidenceLevel(gates)

  const coldStart = gates.coldStart

  if (gates.sizeCap) {
    return { outputState: 'smart_estimate', confidenceLevel: 'LOW', firedGates: fired, coldStart }
  }

  const hasHardStop =
    gates.fabricGate.type   === 'HARD_STOP' ||
    gates.contractGate.type === 'HARD_STOP'
  if (hasHardStop) {
    return { outputState: 'smart_estimate', confidenceLevel, firedGates: fired, coldStart }
  }

  // Compounding uncertainty: fabric soft warning + size_up_2 → escalate per §10
  if (gates.fabricGate.type === 'SOFT_WARNING' && gates.sizeAdjustment >= 2) {
    return { outputState: 'smart_estimate', confidenceLevel: 'LOW', firedGates: fired, coldStart }
  }

  const hasSoftWarning =
    gates.fabricGate.type   === 'SOFT_WARNING' ||
    gates.contractGate.type === 'SOFT_WARNING' ||
    gates.riseGate.type     === 'SOFT_WARNING' ||
    gates.recoveryWarning
  if (hasSoftWarning) {
    return { outputState: 'fit_advisory', confidenceLevel, firedGates: fired, coldStart }
  }

  return { outputState: 'verified_fit', confidenceLevel, firedGates: fired, coldStart }
}
