import { useState } from 'react'
import { CardContent, CardTitle, CardFooter } from './ui/magic/Card'
import { Button } from './ui/magic/Button'
import { Check } from 'lucide-react'

const OPTIONS = [
  { id: 'straight', title: 'Straight / Athletic' },
  { id: 'pear', title: 'Pear' },
  { id: 'apple', title: 'Apple' },
  { id: 'hourglass', title: 'Hourglass' },
]

interface OnboardingBodyFrameProps {
  onContinue?: () => void
  onSkip?: () => void
}

export function OnboardingBodyFrame({ onContinue, onSkip }: OnboardingBodyFrameProps) {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <>
      <CardContent className="p-4 sm:p-6 flex-1">
        <div className="space-y-4">
          {OPTIONS.map((option) => {
            const isSelected = selected === option.id
            let cardClasses = 'w-full text-left p-3 rounded-xl transition-all relative overflow-hidden group '
            if (isSelected) {
              cardClasses += 'bg-secondary border-2 border-border shadow-hard translate-x-[-2px] translate-y-[-2px]'
            } else {
              cardClasses += 'bg-card border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] hover:shadow-hard hover:translate-x-[-2px] hover:translate-y-[-2px]'
            }
            return (
              <button key={option.id} onClick={() => setSelected(option.id)} className={cardClasses}>
                <div className="flex items-center justify-between relative z-10">
                  <h3 className={`text-xl font-bold ${isSelected ? 'text-secondary-foreground' : 'text-foreground'}`}>
                    {option.title}
                  </h3>
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 ml-4 transition-colors ${isSelected ? 'border-border bg-secondary text-secondary-foreground shadow-[2px_2px_0px_0px_var(--border)]' : 'border-border/30 bg-transparent text-transparent group-hover:border-border/50'}`}>
                    <Check strokeWidth={3} className="w-5 h-5" />
                  </div>
                </div>
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
          className={`w-full border-2 font-black text-base py-4 transition-all ${selected !== null ? 'bg-primary text-primary-foreground border-border shadow-hard shadow-hard-hover shadow-hard-active cursor-pointer' : 'bg-muted text-muted-foreground border-border/40 shadow-[1px_1px_0px_0px_var(--border)] cursor-not-allowed'}`}
          disabled={selected === null}
          onClick={() => onContinue?.()}
        >
          Continue
        </Button>
      </CardFooter>
    </>
  )
}

export function OnboardingBodyFrameHeader() {
  return (
    <>
      <CardTitle className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
        How would you describe your frame?
      </CardTitle>
      <p className="text-sm font-heading font-normal text-muted-foreground mt-3">
        Skipping this step may reduce your fit confidence score.
      </p>
    </>
  )
}
