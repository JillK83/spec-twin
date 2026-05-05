import React, { useState } from 'react'
import { CardContent, CardTitle, CardFooter } from './ui/magic/Card'
import { Button } from './ui/magic/Button'
import { Label } from './ui/magic/Label'
import { ToggleGroup, ToggleGroupItem } from './ui/magic/ToggleGroup'
import { Check } from 'lucide-react'

const ADJUSTMENT_OPTIONS = [
  { id: 'right', title: 'Yes, that sounds right' },
  { id: 'longer', title: 'My legs run longer' },
  { id: 'shorter', title: 'My legs run shorter' },
]

interface OnboardingHeightProps {
  onContinue?: () => void
}

export function OnboardingHeight({ onContinue }: OnboardingHeightProps) {
  const [unit, setUnit] = useState<'ft' | 'cm'>('ft')
  const [feet, setFeet] = useState('')
  const [inches, setInches] = useState('')
  const [cm, setCm] = useState('')
  const [selectedAdjustment, setSelectedAdjustment] = useState<string | null>(null)

  const isHeightValid =
    unit === 'ft' ? feet.trim() !== '' && inches.trim() !== '' : cm.trim() !== ''

  let estimatedInseam = 0
  if (isHeightValid) {
    const totalInches =
      unit === 'ft'
        ? parseInt(feet || '0') * 12 + parseInt(inches || '0')
        : parseInt(cm || '0') / 2.54
    estimatedInseam = Math.round(totalInches * 0.45)
  }

  const canContinue = isHeightValid && selectedAdjustment !== null

  return (
    <>
      <CardContent className="p-6 sm:p-8 space-y-10 flex-1">
        {/* Height Input Section */}
        <div className="space-y-6">
          <div className="flex justify-center">
            <ToggleGroup
              type="single"
              value={unit}
              onValueChange={(v) => v && setUnit(v as 'ft' | 'cm')}
              className="bg-muted p-1 rounded-xl border-2 border-border"
            >
              <ToggleGroupItem value="ft" className="rounded-lg font-bold px-6 data-[state=on]:bg-background data-[state=on]:shadow-sm data-[state=on]:border-2 data-[state=on]:border-border">
                ft / in
              </ToggleGroupItem>
              <ToggleGroupItem value="cm" className="rounded-lg font-bold px-6 data-[state=on]:bg-background data-[state=on]:shadow-sm data-[state=on]:border-2 data-[state=on]:border-border">
                cm
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div className="flex justify-center gap-4 mx-auto">
            {unit === 'ft' ? (
              <>
                <div className="w-[120px] shrink-0 space-y-2">
                  <Label className="text-muted-foreground font-bold text-center block">Feet</Label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    placeholder="5"
                    value={feet}
                    onChange={(e) => setFeet(e.target.value.replace(/\D/g, '').slice(0, 1))}
                    className="w-full text-3xl py-8 text-center font-medium bg-card border-2 border-border/40 rounded-xl shadow-[2px_2px_0px_0px_var(--border)] transition-all focus:border-border focus:outline-none focus:shadow-[4px_4px_0px_0px_var(--border)] placeholder:text-muted-foreground/40"
                  />
                </div>
                <div className="w-[120px] shrink-0 space-y-2">
                  <Label className="text-muted-foreground font-bold text-center block">Inches</Label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={2}
                    placeholder="8"
                    value={inches}
                    onChange={(e) => setInches(e.target.value.replace(/\D/g, '').slice(0, 2))}
                    className="w-full text-3xl py-8 text-center font-medium bg-card border-2 border-border/40 rounded-xl shadow-[2px_2px_0px_0px_var(--border)] transition-all focus:border-border focus:outline-none focus:shadow-[4px_4px_0px_0px_var(--border)] placeholder:text-muted-foreground/40"
                  />
                </div>
              </>
            ) : (
              <div className="w-40 space-y-2">
                <Label className="text-muted-foreground font-bold text-center block">Centimeters</Label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={3}
                    placeholder="170"
                    value={cm}
                    onChange={(e) => setCm(e.target.value.replace(/\D/g, '').slice(0, 3))}
                    className="w-full text-3xl py-8 text-center font-medium bg-card border-2 border-border/40 rounded-xl shadow-[2px_2px_0px_0px_var(--border)] transition-all focus:border-border focus:outline-none focus:shadow-[4px_4px_0px_0px_var(--border)] pr-14 placeholder:text-muted-foreground/40"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground text-xl">cm</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Inseam Estimation Section */}
        {isHeightValid && (
          <div className="space-y-6 pt-6 border-t-2 border-border border-dashed animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-black">
                Your estimated inseam is{' '}
                <span className="text-primary font-black">{estimatedInseam}"</span>
              </h3>
              <p className="text-muted-foreground font-bold text-lg">— does that sound right?</p>
            </div>

            <div className="space-y-4">
              {ADJUSTMENT_OPTIONS.map((option) => {
                const isSelected = selectedAdjustment === option.id
                let cardClasses = 'w-full text-left p-5 rounded-xl transition-all relative overflow-hidden group '
                if (isSelected) {
                  cardClasses += 'bg-secondary border-2 border-border shadow-hard translate-x-[-2px] translate-y-[-2px]'
                } else {
                  cardClasses += 'bg-card border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] hover:shadow-hard hover:translate-x-[-2px] hover:translate-y-[-2px]'
                }
                return (
                  <button key={option.id} onClick={() => setSelectedAdjustment(option.id)} className={cardClasses}>
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
          </div>
        )}
      </CardContent>

      <CardFooter className="bg-card p-6 sm:p-8 border-t-4 border-border">
        <Button
          className={`w-full border-2 font-black text-xl py-8 transition-all ${canContinue ? 'bg-primary text-primary-foreground border-border shadow-hard shadow-hard-hover shadow-hard-active cursor-pointer' : 'bg-muted text-muted-foreground border-border/40 shadow-[1px_1px_0px_0px_var(--border)] cursor-not-allowed'}`}
          disabled={!canContinue}
          onClick={() => onContinue?.()}
        >
          Continue
        </Button>
      </CardFooter>
    </>
  )
}

export function OnboardingHeightHeader() {
  return (
    <CardTitle className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
      How tall are you?
    </CardTitle>
  )
}
