import { useEffect, useState } from 'react'
import { Card } from './ui/magic/Card'

const LOADING_MESSAGES = [
  'Checking your anchor fit…',
  'Reading the fabric details…',
  'Working out your size…',
]
const STEP_DURATION = 350

interface AuditLoadingStateProps {
  onComplete: () => void
}

export function AuditLoadingState({ onComplete }: AuditLoadingStateProps) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (step < LOADING_MESSAGES.length - 1) {
      const t = setTimeout(() => setStep(step + 1), STEP_DURATION)
      return () => clearTimeout(t)
    }
    const t = setTimeout(onComplete, STEP_DURATION)
    return () => clearTimeout(t)
  }, [step, onComplete])

  return (
    <Card
      role="status"
      aria-live="polite"
      className="w-full max-w-lg mx-auto border-4 border-border shadow-[8px_8px_0px_0px_var(--border)] rounded-2xl bg-card overflow-hidden"
    >
      <div className="py-20 px-6 flex flex-col items-center justify-center">
        {/* Segmented progress bar */}
        <div className="flex items-center" style={{ width: '260px', gap: '6px' }}>
          {[0, 1, 2].map((i) => {
            const filled = i <= step
            return (
              <div
                key={i}
                className="flex-1 border-2 border-foreground shadow-[2px_2px_0px_0px_var(--foreground)] transition-colors duration-150"
                style={{
                  height: '14px',
                  borderRadius: '4px',
                  backgroundColor: filled ? '#FFBF00' : 'var(--background)',
                }}
              />
            )
          })}
        </div>
        <p className="font-mono text-base text-foreground mt-6 text-center">
          {LOADING_MESSAGES[step]}
        </p>
      </div>
    </Card>
  )
}
