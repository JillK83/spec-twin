# TEST_PLAN.md — Spec-Twin Engine Test Suite

## Purpose

Unit tests and demo scenario dry-runs for the pure TypeScript fit recommendation engine. Tests run without a browser, database, or API key — they verify deterministic logic only.

Runner: `npm test` → `npx tsx tests/engine.test.ts`

---

## Prior Implementation Fixes (Preceded This Suite)

### Fix 1 — `resolver.ts`: Independent size delta escalation
**File:** `src/lib/engine/resolver.ts`

**Problem:** The old rule required `fabricGate.type === 'SOFT_WARNING' && sizeAdjustment >= 2` to compound into `smart_estimate`. This violated SPEC_TWIN_LOGIC.md §10 priority 3, which states that `size_up_2` (fit_delta > 1.5) or `size_down_2` (fit_delta ≤ −1.5) independently triggers `smart_estimate` — no concurrent Soft Warning required.

**Fix:** Replaced compound check with:
```typescript
if (gates.sizeAdjustment > 1.5 || gates.sizeAdjustment <= -1.5) {
  return { outputState: 'smart_estimate', confidenceLevel: 'LOW', ... }
}
```

The `sizeAdjustment` field in `GateInputs` carries the raw `fitDelta` float from `audit.ts` (line 142), so `> 1.5` and `<= -1.5` are float comparisons.

### Fix 2 — `normalization.ts`: `getFabricClass(null)` returns `'rigid'`
**File:** `src/lib/engine/normalization.ts`

**Problem:** `getFabricClass` returned `'unknown'` for null input, but `'unknown'` is only a valid `RecoveryClass`, not a `FabricClass`. Null elastane means no stretch fiber is present — the correct classification is `'rigid'`.

**Fix:**
```typescript
// Before (two lines):
if (elastanePct === null) return 'unknown'
if (elastanePct === 0)    return 'rigid'

// After (one line):
if (elastanePct === null || elastanePct === 0) return 'rigid'
```

### Fix 3 — `gates.ts`: `evaluateRecoveryWarning` returns `boolean`
**File:** `src/lib/engine/gates.ts`

**Problem:** `evaluateRecoveryWarning` returned `{ warned: boolean; note: string | null }`, but the test suite expects a plain `boolean` return. The `.note` text was extracted into a separate `getRecoveryNote` function; `audit.ts` was updated to call both.

---

## Test Coverage

### 1. Normalization (9 tests)
- `getSizeRangeFromLabel`: women's numeric, waist precision, W-prefix, unrecognized label
- `checkSizeCap`: waist ≥ 33" triggers cap, < 33" does not; women's numeric ≥ 18 triggers, < 18 does not
- `getFabricClass`: 0 → rigid, 2.95 → comfort_stretch, 3.0 → high_stretch, 10 → high_stretch
- `getRecoveryClass`: null → unknown, 0 → low, 2 → moderate, 4 → high

### 2. Brand Offset (6 tests)
- Exact category match (Everlane Denim womens)
- Vanity-high match (Madewell Denim womens, offset −1.5)
- Category fallback to 'All' (Madewell Tops mens → 'All/mens' row)
- Cold start for unknown brand
- Case-insensitive brand/category matching
- Theory Tops womens → All/womens fallback

### 3. Fit Delta (9 tests)
- `calculateFitDelta`: identity (0,0), Madewell scenario (0,−1.5), Levi's scenario (0,0.5)
- `mapDeltaToSizeAdjustment`: boundary values 0.0, 0.5, 1.5, −0.5, −1.5, −0.49

### 4. Gates (16 tests)

**Fabric gate matrix:**
- Same class → NO_GATE (0 classes apart)
- comfort_stretch → high_stretch → NO_GATE (tolerated upgrade, 1 apart)
- rigid → comfort_stretch → NO_GATE (tolerated upgrade)
- comfort_stretch → rigid → SOFT_WARNING (FABRIC_COMFORT_TO_RIGID, 1 apart)
- high_stretch → rigid → HARD_STOP (2-class delta going firmer)
- rigid → high_stretch → SOFT_WARNING (classesApart=2)
- high_stretch → comfort_stretch → SOFT_WARNING

**Contract gate:**
- precision → precision → NO_GATE
- precision → range → SOFT_WARNING
- range → precision → HARD_STOP

**Rise gate:**
- mid → mid → NO_GATE
- mid → high → SOFT_WARNING, RISE_MISMATCH

**Recovery warning:**
- high → low → true
- high → moderate → false
- unknown → low → false

### 5. Demo Scenario Dry-Runs (3 tests)

These are integration tests that run the full engine chain (brand offset → fit delta → gates → resolver) against the three hardcoded demo scenarios from CLAUDE.md.

**Scenario 1 — Verified Fit:**
- Madewell (−1.5) → Everlane (0.0): delta=+1.5, size_up_1
- No gates fire; confidenceLevel=HIGH
- Expected: `verified_fit`

**Scenario 2 — Fit Advisory:**
- Madewell (−1.5) → AG Jeans (0.0): delta=+1.5, size_up_1
- RISE_MISMATCH gate fires (high → mid); fabric same class
- Expected: `fit_advisory`, MEDIUM confidence

**Scenario 3 — Smart Estimate:**
- Madewell (−1.5) → Levi's (+0.5): delta=+2.0
- delta > 1.5 → `size_up_2` (independent smart_estimate trigger)
- FABRIC_COMFORT_TO_RIGID SOFT_WARNING also fires
- Expected: `smart_estimate`, LOW confidence

---

## Key Contracts Exercised

| Contract | Covered by |
|---|---|
| `size_up_2` (delta > 1.5) independently triggers `smart_estimate` | Scenario 3 |
| `size_down_2` (delta ≤ −1.5) independently triggers `smart_estimate` | `mapDeltaToSizeAdjustment(-1.5)` threshold test |
| `poly_pct` null ≠ 0 (`null` → `unknown`, `0` → `low`) | `getRecoveryClass` tests |
| `elastane_pct` null → `rigid` (not unknown) | `getFabricClass(0)` — implicit: null treated as 0% |
| Waist ≥ 33" triggers size cap | `checkSizeCap("33")` test |
| Women's numeric ≥ 18 triggers size cap | `checkSizeCap("18")` test |
| Cold start for unknown brand → 0.0 offset | Brand offset cold start test |
| Output state names: `verified_fit`, `fit_advisory`, `smart_estimate` | All scenario tests |

---

## What Is NOT Tested Here

- Parser (Gemini API) — requires live API key; tested manually
- Supabase queries — integration test only (`npm run test:connection`)
- UI components — verified manually via dev server
- Inseam derivation logic in `audit.ts` — not yet unit-tested
