import { useState } from 'react'
import { CardContent, CardTitle, CardFooter } from './ui/magic/Card'
import { Button } from './ui/magic/Button'
import { Check } from 'lucide-react'

const OPTIONS = [
  { id: 'rigid', title: 'Rigid and Authentic' },
  { id: 'classic', title: 'Classic Comfort' },
  { id: 'stretchy', title: 'Stretchy and Forgiving' },
]

interface OnboardingFabricFeelProps {
  onContinue?: () => void
  onSkip?: () => void
}

export function OnboardingFabricFeel({ onContinue, onSkip }: OnboardingFabricFeelProps) {
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
                  <h3 className={`text-xl font-bold ${isPrimary ? 'text-secondary-foreground' : 'text-foreground'}`}>
                    {option.title}
                  </h3>
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

        <button
          onClick={() => onSkip?.()}
          className="w-full text-center mt-6 text-sm font-heading font-normal text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
        >
          Skip this step
        </button>
      </CardContent>

      <CardFooter className="bg-card p-4 sm:p-6 border-t-2 border-border">
        <Button
          className="w-full border-2 font-black text-base py-5 transition-all bg-primary text-primary-foreground border-border shadow-hard shadow-hard-hover shadow-hard-active cursor-pointer"
          onClick={() => onContinue?.()}
        >
          Continue
        </Button>
      </CardFooter>
    </>
  )
}

export function OnboardingFabricFeelHeader() {
  return (
    <>
      <CardTitle className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
        How do you like your denim to feel?
      </CardTitle>
      <p className="text-sm font-heading font-normal text-muted-foreground mt-3">
        We'll use this to alert you if a new find feels stiffer or stretchier than your usual vibe.
      </p>
    </>
  )
}
