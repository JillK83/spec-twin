import { useState } from 'react'
import { CardContent, CardTitle, CardFooter } from './ui/magic/Card'
import { Button } from './ui/magic/Button'
import { Check } from 'lucide-react'

const OPTIONS = [
  { id: 'high', title: 'At or above my natural waist', desc: 'I like coverage' },
  { id: 'mid', title: 'At my navel', desc: 'classic fit' },
  { id: 'low-mid', title: 'Just below my navel', desc: 'relaxed waist' },
  { id: 'low', title: 'Low on my hips', desc: "I don't want waistband pressure" },
]

interface OnboardingRisePreferenceProps {
  onContinue?: () => void
}

export function OnboardingRisePreference({ onContinue }: OnboardingRisePreferenceProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  return (
    <>
      <CardContent className="p-4 sm:p-6 flex-1">
        <div className="space-y-4">
          {OPTIONS.map((option) => {
            const isSelected = selectedIds.includes(option.id)
            const isPrimary = selectedIds[0] === option.id
            const isSecondary = isSelected && !isPrimary
            let cardClasses = 'w-full text-left p-3 rounded-xl transition-all relative overflow-hidden group '
            if (isPrimary) {
              cardClasses += 'bg-secondary border-2 border-border shadow-hard translate-x-[-2px] translate-y-[-2px]'
            } else if (isSecondary) {
              cardClasses += 'bg-secondary/20 border-2 border-secondary shadow-[2px_2px_0px_0px_var(--secondary)]'
            } else {
              cardClasses += 'bg-card border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] hover:shadow-hard hover:translate-x-[-2px] hover:translate-y-[-2px]'
            }
            return (
              <button key={option.id} onClick={() => toggleSelection(option.id)} className={cardClasses}>
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <h3 className={`text-xl font-bold ${isPrimary ? 'text-secondary-foreground' : 'text-foreground'}`}>
                      {option.title}
                    </h3>
                  </div>
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 ml-4 transition-colors ${isPrimary ? 'border-border bg-background text-foreground shadow-[2px_2px_0px_0px_var(--border)]' : isSecondary ? 'border-secondary bg-secondary text-secondary-foreground' : 'border-border/30 bg-transparent text-transparent group-hover:border-border/50'}`}>
                    <Check strokeWidth={3} className="w-5 h-5" />
                  </div>
                </div>
                {isPrimary && (
                  <div className="absolute top-0 right-0 bg-border text-background text-xs font-bold px-3 py-1 rounded-bl-xl border-l-2 border-b-2 border-border">
                    PRIMARY
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </CardContent>

      <CardFooter className="bg-card p-4 sm:p-6 border-t-2 border-border">
        <Button
          className={`w-full border-2 font-black text-base py-5 transition-all ${selectedIds.length > 0 ? 'bg-primary text-primary-foreground border-border shadow-hard shadow-hard-hover shadow-hard-active cursor-pointer' : 'bg-muted text-muted-foreground border-border/40 shadow-[1px_1px_0px_0px_var(--border)] cursor-not-allowed'}`}
          disabled={selectedIds.length === 0}
          onClick={() => onContinue?.()}
        >
          Continue
        </Button>
      </CardFooter>
    </>
  )
}

export function OnboardingRisePreferenceHeader() {
  return (
    <>
      <CardTitle className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
        Where do you like your waistband to sit?
      </CardTitle>
      <p className="text-sm font-heading font-normal text-muted-foreground mt-3">
        First selection sets your rise anchor. Additional picks expand your fit range.
      </p>
    </>
  )
}
