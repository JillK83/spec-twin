import type {
  FabricClass,
  ContractType,
  RecoveryClass,
  Rise,
  GateResult,
  FabricGateResult,
} from './types'

// ─── Fabric gate ──────────────────────────────────────────────────────────────
// Gate matrix from SPEC_TWIN_LOGIC.md §4.
// Exact FABRIC_GATES constant from the spec — do not reorder or rename keys.
//
// class ordering (for classesApart):  rigid(0) < comfort_stretch(1) < high_stretch(2)
//
// HARD_STOP:    high_stretch → rigid   (two-class delta, going to firmer)
// SOFT_WARNING: high_stretch → comfort_stretch, comfort_stretch → rigid, rigid → high_stretch
// NO_GATE:      comfort_stretch → high_stretch, rigid → comfort_stretch, any same → same

const FABRIC_CLASS_RANK: Record<FabricClass, number> = {
  rigid: 0,
  comfort_stretch: 1,
  high_stretch: 2,
  unknown: -1,
}

const NO_FABRIC_GATE = (classesApart: number): FabricGateResult => ({
  fired: false,
  type: 'NO_GATE',
  outputState: null,
  reasonCode: null,
  userText: null,
  classesApart,
})

export function evaluateFabricGate(
  anchor: FabricClass,
  target: FabricClass
): FabricGateResult {
  const classesApart = Math.abs(FABRIC_CLASS_RANK[anchor] - FABRIC_CLASS_RANK[target])

  if (anchor === target) return NO_FABRIC_GATE(0)

  // NO_GATE transitions (softer → firmer is tolerated without warning)
  if (anchor === 'comfort_stretch' && target === 'high_stretch') return NO_FABRIC_GATE(1)
  if (anchor === 'rigid'           && target === 'comfort_stretch') return NO_FABRIC_GATE(1)

  // HARD_STOP — only high_stretch → rigid (two-class delta going to firmer)
  if (anchor === 'high_stretch' && target === 'rigid') {
    return {
      fired: true,
      type: 'HARD_STOP',
      outputState: 'smart_estimate',
      reasonCode: 'FABRIC_HIGH_STRETCH_TO_RIGID',
      userText: 'This item will likely feel much firmer and less stretchy than your reference item.',
      classesApart,
    }
  }

  // SOFT_WARNINGs
  if (anchor === 'high_stretch' && target === 'comfort_stretch') {
    return {
      fired: true,
      type: 'SOFT_WARNING',
      outputState: 'fit_advisory',
      reasonCode: 'FABRIC_HIGH_STRETCH_TO_COMFORT',
      userText: 'This item has less give than your reference item and may feel slightly firmer.',
      classesApart,
    }
  }
  if (anchor === 'comfort_stretch' && target === 'rigid') {
    return {
      fired: true,
      type: 'SOFT_WARNING',
      outputState: 'fit_advisory',
      reasonCode: 'FABRIC_COMFORT_TO_RIGID',
      userText: 'This item has less stretch than your reference item and may feel tighter or more structured.',
      classesApart,
    }
  }
  if (anchor === 'rigid' && target === 'high_stretch') {
    return {
      fired: true,
      type: 'SOFT_WARNING',
      outputState: 'fit_advisory',
      reasonCode: 'FABRIC_RIGID_TO_HIGH_STRETCH',
      userText: 'This item will likely feel softer and more forgiving than your reference item.',
      classesApart,
    }
  }

  // Exhaustive — all nine combos covered above
  return NO_FABRIC_GATE(classesApart)
}

// ─── Contract gate ────────────────────────────────────────────────────────────
// Gate matrix from SPEC_TWIN_LOGIC.md §6.

export function evaluateContractGate(
  anchor: ContractType,
  target: ContractType
): GateResult {
  if (anchor === target) {
    return { fired: false, type: 'NO_GATE', outputState: null, reasonCode: null, userText: null }
  }
  if (anchor === 'precision' && target === 'range') {
    return {
      fired: true,
      type: 'SOFT_WARNING',
      outputState: 'fit_advisory',
      reasonCode: 'CONTRACT_PRECISION_TO_RANGE',
      userText: 'This item uses a more flexible size system than your reference item, so the fit may feel less exact.',
    }
  }
  // range → precision: HARD_STOP
  return {
    fired: true,
    type: 'HARD_STOP',
    outputState: 'smart_estimate',
    reasonCode: 'CONTRACT_RANGE_TO_PRECISION',
    userText: 'This item uses a more exact size system than your reference item, so your usual size may not translate as cleanly.',
  }
}

// ─── Rise gate ────────────────────────────────────────────────────────────────
// Per SPEC_TWIN_LOGIC.md §8: any rise mismatch → SOFT_WARNING → fit_advisory.
// Hardware gate (closure_type) is inactive at MVP.

export function evaluateRiseGate(anchor: Rise, target: Rise): GateResult {
  if (anchor === target) {
    return { fired: false, type: 'NO_GATE', outputState: null, reasonCode: null, userText: null }
  }
  return {
    fired: true,
    type: 'SOFT_WARNING',
    outputState: 'fit_advisory',
    reasonCode: 'RISE_MISMATCH',
    userText: "This style sits differently than your usual preference, which may affect how the waist and hip feel.",
  }
}

// ─── Recovery warning ─────────────────────────────────────────────────────────
// Per SPEC_TWIN_LOGIC.md §7: does not block recommendation — surfaces as a note.
// Returns warned: true for the four listed transitions only. All others return false.

export function evaluateRecoveryWarning(
  anchor: RecoveryClass,
  target: RecoveryClass
): { warned: boolean; note: string | null } {
  if (anchor === 'high' && target === 'low') {
    return { warned: true, note: 'This item may feel tighter at first and may loosen more through the day than your reference item.' }
  }
  if (anchor === 'low' && target === 'high') {
    return { warned: true, note: 'This item will hold its shape significantly better than your reference item and may feel more structured throughout the day.' }
  }
  if (anchor === 'unknown' && target === 'high') {
    return { warned: true, note: 'This item may hold its shape more firmly than your reference item.' }
  }
  if (anchor === 'high' && target === 'unknown') {
    return { warned: true, note: 'Shape retention data is unavailable for this item — your reference item holds its shape well, so verify before buying.' }
  }
  return { warned: false, note: null }
}
