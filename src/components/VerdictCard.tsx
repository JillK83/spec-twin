import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Card } from './ui/magic/Card'
import { Button } from './ui/magic/Button'
import { ChevronDown, AlertTriangle, Info } from 'lucide-react'

export type VerdictState = 'verified' | 'advisory' | 'estimate' | 'reduced'
export type PillarStatus = 'verified' | 'advisory' | 'estimate'

export interface Pillar {
  id: string
  name: string
  headline: string
  status: PillarStatus
  detail: string
}

export interface VerdictCardProps {
  state: VerdictState
  garmentName: string
  anchorLabel: string
  recommendedSize: string
  pillars: Pillar[]
  advisoryBannerText?: string
  bannerText?: string
  onReset?: () => void
  sizeNote?: string
  footerNote?: string
}

const badgeConfig: Record<VerdictState, { label: string; classes: string }> = {
  verified: { label: 'VERIFIED FIT', classes: 'bg-secondary text-secondary-foreground' },
  advisory: { label: 'FIT ADVISORY', classes: 'bg-primary text-primary-foreground' },
  estimate: { label: 'SMART ESTIMATE', classes: 'bg-[#7C3AED] text-white' },
  reduced:  { label: 'SMART ESTIMATE', classes: 'bg-[#7C3AED] text-white' },
}

const dotConfig: Record<PillarStatus, string> = {
  verified: 'bg-secondary',
  advisory: 'bg-primary',
  estimate: 'bg-[#7C3AED]',
}

export function VerdictCard({
  state,
  garmentName,
  anchorLabel,
  recommendedSize,
  pillars,
  advisoryBannerText,
  bannerText: bannerTextOverride,
  onReset,
  sizeNote,
  footerNote,
}: VerdictCardProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const isDemoMode = ['/verdict/1', '/verdict/2', '/verdict/3'].includes(location.pathname)
  const [expandedIds, setExpandedIds] = useState<string[]>([])

  const togglePillar = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    )
  }

  const isEstimateOrReduced = state === 'estimate' || state === 'reduced'
  const isReduced = state === 'reduced'
  const badge = badgeConfig[state]
  const sizeLabel = isEstimateOrReduced ? 'BEST ESTIMATE' : 'RECOMMENDED SIZE'
  const sizeValueClass = isEstimateOrReduced ? 'text-[#5B21B6]' : 'text-foreground'

  let bannerText: string | null = null
  let bannerClasses = ''
  let BannerIcon = AlertTriangle

  if (state === 'advisory') {
    bannerText = advisoryBannerText ?? 'Fabric stretch differs from your anchor.'
    bannerClasses = 'bg-[#FFFBEB] text-foreground border-y-2 border-[#FFBF00]'
    BannerIcon = AlertTriangle
  } else if (state === 'estimate') {
    bannerText = 'Incomplete data — verify before buying'
    bannerClasses = 'bg-[#F3E8FF] text-[#5B21B6] border-y-2 border-[#7C3AED]'
    BannerIcon = Info
  } else if (state === 'reduced') {
    bannerText = 'Incomplete Anchor — material data missing'
    bannerClasses = 'bg-[#F3E8FF] text-[#5B21B6] border-y-2 border-[#7C3AED]'
    BannerIcon = Info
  }

  if (bannerTextOverride) {
    bannerText = bannerTextOverride
  }

  const factorCount = isReduced
    ? '2 of 3 factors reviewed · anchor incomplete'
    : '3 of 3 factors reviewed'

  const buttonLabel =
    state === 'reduced'
      ? 'Update Anchor'
      : state === 'estimate'
        ? 'Verify Before Saving'
        : 'Save Fit to Vault'

  const ctaButtonClass =
    state === 'estimate' || state === 'reduced'
      ? `w-full sm:w-auto bg-[#7C3AED] text-white border-4 border-border shadow-hard shadow-hard-hover shadow-hard-active font-black text-base py-6 px-8 uppercase tracking-wide transition-all${isDemoMode ? ' opacity-50 cursor-not-allowed' : ''}`
      : `w-full sm:w-auto bg-primary text-primary-foreground border-4 border-border shadow-hard shadow-hard-hover shadow-hard-active font-black text-base py-6 px-8 uppercase tracking-wide transition-all${isDemoMode ? ' opacity-50 cursor-not-allowed' : ''}`

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl">
      <Card className="w-full max-w-2xl mx-auto border-4 border-border shadow-[8px_8px_0px_0px_var(--border)] rounded-2xl bg-card overflow-hidden relative">
      {/* Purple left accent for estimate/reduced */}
      {isEstimateOrReduced && (
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#7C3AED] z-20" />
      )}

      {/* Header */}
      <div className="border-b-4 border-border p-6 relative">
        <h2 className="font-heading font-black text-3xl text-foreground pr-36 leading-tight">
          {garmentName}
        </h2>
        <div
          className={`absolute top-4 right-4 border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] rounded-lg px-3 py-1.5 font-mono font-black text-xs tracking-[0.13em] ${badge.classes}`}
        >
          {badge.label}
        </div>
      </div>

      {/* Anchor Reference */}
      <div className="px-6 py-3 font-mono text-sm text-muted-foreground">
        Compared to your {anchorLabel}
      </div>

      {/* Banner */}
      {bannerText && (
        <div
          role="status"
          className={`px-6 py-3 font-mono text-sm flex items-center gap-2 ${bannerClasses}`}
        >
          <BannerIcon className="w-4 h-4 shrink-0" />
          {bannerText}
        </div>
      )}

      {/* Size Row */}
      <div className="py-10 px-6 flex flex-col items-center justify-center">
        <span className="font-mono text-xs uppercase tracking-[0.13em] text-muted-foreground mb-2">
          {sizeLabel}
        </span>
        {recommendedSize === 'See brand size guide' ? (
          <p className="font-mono text-sm text-muted-foreground text-center">{recommendedSize}</p>
        ) : (
          <span className={`font-heading font-black text-7xl leading-none ${sizeValueClass}`}>
            {recommendedSize}
          </span>
        )}
        {sizeNote ? (
          <span className="font-mono text-xs text-muted-foreground mt-3">{sizeNote}</span>
        ) : isEstimateOrReduced ? (
          <span className="font-mono text-xs text-muted-foreground mt-3">verify before buying</span>
        ) : null}
      </div>

      {/* Pillars */}
      <div className="border-t-4 border-border">
        {pillars.map((pillar) => {
          const isExpanded = expandedIds.includes(pillar.id)
          return (
            <div key={pillar.id} className="border-b-2 border-border last:border-b-0">
              <button
                onClick={() => togglePillar(pillar.id)}
                aria-expanded={isExpanded}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/30 transition-colors text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-3 h-3 rounded-full shrink-0 ${dotConfig[pillar.status]}`} />
                  <div className="min-w-0">
                    <p className="font-mono font-bold uppercase text-foreground/60 text-lg tracking-[0.08em]">
                      {pillar.name}
                    </p>
                    <p className="font-heading font-medium text-foreground mt-1" style={{ fontSize: '13.5px', lineHeight: '1.4' }}>
                      {pillar.headline}
                    </p>
                  </div>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-foreground transition-transform duration-200 shrink-0 ml-4 ${isExpanded ? 'rotate-180' : ''}`}
                />
              </button>
              {isExpanded && (
                <div className="px-6 pb-4 pl-[34px] text-base text-muted-foreground leading-relaxed animate-in slide-in-from-top-2 duration-200">
                  {pillar.detail}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="bg-muted border-t-4 border-border">
        {footerNote && (
          <div className="px-6 py-3 border-b-2 border-border">
            <p className="font-mono text-xs text-muted-foreground">{footerNote}</p>
          </div>
        )}
        <div className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-mono text-sm text-muted-foreground">{factorCount}</span>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            {onReset && (
              <Button
                variant="outline"
                onClick={onReset}
                className="w-full sm:w-auto font-mono text-sm border-2 border-border bg-background hover:bg-muted/50 shadow-[2px_2px_0px_0px_var(--border)] hover:shadow-[3px_3px_0px_0px_var(--border)] transition-all py-5 px-6"
              >
                Reset
              </Button>
            )}
            <Button
              disabled={isDemoMode}
              onClick={() => {
                if (isDemoMode) return
                if (state === 'reduced') navigate('/anchor/new')
                else if (state === 'estimate') return
                else navigate('/audit/new')
              }}
              className={ctaButtonClass}
            >
              {buttonLabel}
            </Button>
          </div>
        </div>
      </div>
    </Card>
      </div>
    </div>
  )
}
