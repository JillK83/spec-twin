import { useNavigate } from 'react-router-dom'
import { Card } from './ui/magic/Card'
import { Button } from './ui/magic/Button'
import { Sparkles } from 'lucide-react'

export function BridgeSplash() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl">
      <Card className="w-full max-w-2xl mx-auto border-4 border-border shadow-hard bg-card rounded-2xl overflow-hidden flex flex-col">
      {/* Amber Header */}
      <div className="w-full bg-primary border-b-4 border-border px-6 py-5">
        <p className="text-center font-black text-sm tracking-[0.2em] uppercase text-primary-foreground">
          Profile Synced
        </p>
      </div>

      {/* Hero Body */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-8 py-20">
        <h1 className="font-heading font-black text-5xl sm:text-6xl tracking-tight text-foreground uppercase text-center">
          End the Guesswork
        </h1>
        <p className="font-heading font-bold text-xl text-foreground mt-4 text-center">
          Your personal fit DNA is officially live.
        </p>

        {/* Definition Card */}
        <div className="mt-12 w-full max-w-xl">
          <div className="input-retro rounded-xl overflow-hidden">
            <div className="p-6 sm:p-8">
              <p className="text-base font-heading font-normal text-foreground leading-relaxed">
                The final step is to drop your first Anchor. This is the
                &ldquo;perfect-fitting&rdquo; pair of jeans already in your
                closet. Once saved, we&rsquo;ll use it to tell you exactly how
                any other pair will fit—before you buy.
              </p>
            </div>
            <div className="bg-secondary border-t-2 border-border px-6 py-3 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-secondary-foreground" strokeWidth={2.5} />
              <span className="font-bold text-sm text-secondary-foreground tracking-wide">
                Blueprint Captured.
              </span>
            </div>
          </div>
        </div>

        {/* Primary CTA */}
        <div className="mt-12 w-full max-w-xl">
          <Button
            className="w-full border-2 font-black text-xl py-8 transition-all bg-primary text-primary-foreground border-border shadow-hard shadow-hard-hover shadow-hard-active cursor-pointer"
            onClick={() => navigate('/anchor/new?demo=true')}
          >
            + Drop Your First Anchor
          </Button>
        </div>
      </div>
    </Card>
      </div>
    </div>
  )
}
