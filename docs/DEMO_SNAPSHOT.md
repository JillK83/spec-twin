# DEMO_SNAPSHOT.md — Spec-Twin Demo Mode Inventory

Read-only reference. Documents every route, all hardcoded scenario data, mode-gating logic, and component ownership as of the open-mode branch.

---

## 1. Routes

| Path | Component |
|---|---|
| `/` | `CoverDemo` |
| `/open` | `CoverOpen` |
| `/onboarding/1` | `OnboardingRise` |
| `/onboarding/2` | `OnboardingSilhouette` |
| `/onboarding/3` | `OnboardingHeight` |
| `/onboarding/4` | `OnboardingBodyShape` |
| `/onboarding/5` | `OnboardingDenimFeel` |
| `/bridge` | `Bridge` |
| `/anchor/new` | `AnchorNew` |
| `/vault` | `Vault` |
| `/audit/new` | `AuditNew` |
| `/verdict/1` | `VerdictVerifiedFit` |
| `/verdict/2` | `VerdictFitAdvisory` |
| `/verdict/3` | `VerdictSmartEstimate` |
| `/verdict/4` | `VerdictSmartEstimate` (same component) |
| `/verdict/open` | `VerdictOpenPage` |

---

## 2. Hardcoded Scenario Data Objects

**Source file:** `src/components/verdictSampleData.ts`

### Scenario 1 — Verified Fit (`/verdict/1`)
```typescript
export const SCENARIO_1 = {
  garmentName: 'Everlane 90s Cheeky Straight',
  anchorLabel: 'Madewell Perfect Vintage Straight, Size 27x29',
  recommendedSize: '28 x 29',
}
```

### Scenario 2 — Fit Advisory (`/verdict/2`)
```typescript
export const SCENARIO_2 = {
  garmentName: 'AG Jeans Farrah Boot Jean',
  anchorLabel: 'Madewell Perfect Vintage Straight, Size 27x29',
  recommendedSize: '28 x 30',
  sizeNote: 'INSEAM ADJUSTED FOR SILHOUETTE',
  footerNote: 'New to our system — treat this as a starting point',
}
```

### Scenario 3 — Smart Estimate (`/verdict/3`)
```typescript
export const SCENARIO_3 = {
  garmentName: "Levi's 501 Original Jean",
  anchorLabel: 'Madewell Perfect Vintage Straight, Size 27x29',
  footerNote: 'VERIFY BEFORE BUYING',
  bannerText: 'This item will likely feel much firmer and less stretchy than your reference item.',
}
```

---

## 3. DemoSelectorStrip

**Source file:** `src/components/DemoSelectorStrip.tsx`

### What it renders
Fixed top bar (`z-[100]`) with three toggle buttons labeled **Scenario 1 / 2 / 3**. Active scenario has bold font, filled foreground background, 4px border, and hard shadow with -2px translation. Inactive buttons have muted background and 2px shadow.

### How it works
- Returns `null` on any route that is not `/verdict/1–3` or `/audit/new`
- On `/verdict/*` routes: navigates to `/verdict/{n}` when a scenario button is clicked
- On `/audit/new`: navigates to `/audit/new?scenario={n}&demo=true` when clicked

### What it gates
The strip is the only in-app way to switch between demo scenarios. It is rendered at the App level and only when `mode === 'demo'` (via `AppModeContext`). In open mode the strip is never mounted.

---

## 4. AppModeContext

**Source file:** `src/contexts/AppModeContext.tsx`

```typescript
type AppMode = 'demo' | 'open'
```

**Default state:** `'open'`

### How mode is set
| Entry point | Action | Mode set |
|---|---|---|
| `CoverDemo` (`/`) | "RUN DEMO" button click | `'demo'` |
| `CoverOpen` (`/open`) | "GET STARTED" button click | `'open'` |

### Where mode is consumed
| File | Usage |
|---|---|
| `VerdictCard.tsx` | `const isDemoMode = mode === 'demo'` — disables CTA button when in demo mode |
| `BridgeSplash.tsx` | Navigates to `/anchor/new?demo=true` in demo mode; `/anchor/new` in open mode |
| `App.tsx` | `!isOpenMode` pathname check gates `<DemoSelectorStrip />` rendering at app level |
| `CoverDemo.tsx` | Calls `setMode('demo')` |
| `CoverOpen.tsx` | Calls `setMode('open')` |

---

## 5. Component Ownership

### Demo-only
These components either contain hardcoded scenario data or exist solely to serve demo mode.

| Component | Why demo-only |
|---|---|
| `CoverDemo.tsx` | Demo entry point — sets mode to `'demo'`, shows "RUN DEMO" + scenario footer |
| `DemoSelectorStrip.tsx` | Only renders when `mode === 'demo'`; hardcoded scenario buttons |
| `VerdictVerifiedFit.tsx` | Uses hardcoded `SCENARIO_1` + `verifiedPillars` data |
| `VerdictFitAdvisory.tsx` | Uses hardcoded `SCENARIO_2` + `advisoryPillars` data |
| `VerdictSmartEstimate.tsx` | Uses hardcoded `SCENARIO_3` + `estimatePillars` data |
| `verdictSampleData.ts` | Source of all three hardcoded scenario objects |

### Open-mode only
| Component | Why open-mode only |
|---|---|
| `CoverOpen.tsx` | Open entry point — sets mode to `'open'`, shows "GET STARTED", no demo footer |
| `VerdictOpenPage.tsx` | Dynamic verdict powered by live audit output; not used in scripted demo |

### Shared (both modes)
| Component | Notes |
|---|---|
| `VerdictCard.tsx` | Checks `isDemoMode` to disable CTAs, but renders in both modes |
| `BridgeSplash.tsx` | Mode-aware navigation but shared layout |
| `AuditNew.tsx` | Shared; DemoSelectorStrip shown above it in demo mode via App level |
| `AddAnchorForm.tsx` | Shared; pre-fills from `?demo=true` param in demo mode |
| `AuditNewItemForm.tsx` | Shared; auto-triggers from `?scenario=N` param in demo mode |
| `AuditLoadingState.tsx` | Shared loading animation |
| `FitVault.tsx` | Shared vault display |
| `AnchorReferenceBar.tsx` | Shared audit form header bar |
| All 5 onboarding screens | Shared; no demo content |
| `OnboardingLayout.tsx` | Shared layout wrapper |
| `src/components/ui/magic/*` | All Magic Patterns primitives — shared everywhere |
