import type {
  OutputState,
  ConfidenceLevel,
  FabricClass,
  RecoveryClass,
  ContractType,
  Gender,
} from '../database.types'

export type { OutputState, ConfidenceLevel, FabricClass, RecoveryClass, ContractType, Gender }

export type Rise = 'high' | 'mid' | 'low'
export type GateType = 'HARD_STOP' | 'SOFT_WARNING' | 'NO_GATE'

export type GateResult = {
  fired: boolean
  type: GateType
  outputState: OutputState | null
  reasonCode: string | null
  userText: string | null
}

// Fabric gate result carries classesApart so the resolver can derive confidence level accurately.
// (RIGID → HIGH_STRETCH is 2 classes apart but SOFT_WARNING — resolver needs to know.)
export type FabricGateResult = GateResult & { classesApart: number }

export type SizeAdjustment = {
  adjustment: -2 | -1 | 0 | 1 | 2
  label: 'size_down_2' | 'size_down_1' | 'stay_true' | 'size_up_1' | 'size_up_2'
}

export type BrandOffsetResult = {
  weightedOffset: number
  driftAdjustment: number
  effectiveOffset: number
  coldStart: boolean
  offsetId: string | null
  fitTag: string | null
}

export type GateInputs = {
  fabricGate: FabricGateResult
  contractGate: GateResult
  riseGate: GateResult
  recoveryWarning: boolean
  coldStart: boolean
  sizeCap: boolean
  sizeAdjustment: number
}

export type ResolverResult = {
  outputState: OutputState
  confidenceLevel: ConfidenceLevel
  firedGates: string[]
  coldStart: boolean
}
