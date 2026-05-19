import { useNavigate } from 'react-router-dom'
import { useAppMode } from '@/contexts/AppModeContext'

export default function CoverOpen() {
  const navigate = useNavigate()
  const { setMode } = useAppMode()

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
        @keyframes scaleInX {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        @keyframes revealText {
          from { clip-path: inset(0 100% 0 0); }
          to   { clip-path: inset(0 0%   0 0); }
        }
      `}</style>

      <div className="min-h-screen w-full flex flex-col items-center justify-center relative">

        {/* Status bar */}
        <div className="fixed top-0 left-0 right-0 flex items-center justify-between px-7 py-3 z-10">
          <span
            className="font-mono text-[10px] uppercase tracking-widest opacity-50 whitespace-nowrap"
            style={{ animation: 'revealText 400ms steps(9, end) 1800ms both' }}
          >
            SYS:READY
          </span>
          <span
            className="font-mono text-[10px] uppercase tracking-widest opacity-50 whitespace-nowrap"
            style={{ animation: 'revealText 400ms steps(18, end) 2200ms both' }}
          >
            MVP — WOMENS DENIM
          </span>
          <span
            className="font-mono text-[10px] uppercase tracking-widest opacity-50 whitespace-nowrap"
            style={{ animation: 'revealText 400ms steps(11, end) 2600ms both' }}
          >
            ENGINE V1.0
          </span>
        </div>

        {/* Corner marks */}
        <div className="fixed top-10 left-10 w-[18px] h-[18px] border-t-2 border-l-2 border-[#1A1A1A] opacity-25" />
        <div className="fixed bottom-10 right-10 w-[18px] h-[18px] border-b-2 border-r-2 border-[#1A1A1A] opacity-25" />

        {/* Main content */}
        <div className="flex flex-col items-center">

          <svg
            width="100"
            height="100"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ animation: 'fadeIn 300ms ease 200ms both' }}
          >
            <rect x="34" y="28" width="32" height="32" fill="#BFFF00" />
            <rect x="8"  y="14" width="50" height="50" stroke="#1A1A1A" strokeWidth="3" />
            <rect x="42" y="36" width="50" height="50" stroke="#1A1A1A" strokeWidth="3" />
          </svg>

          <h1
            className="font-heading font-black text-6xl uppercase tracking-tighter text-foreground mt-4"
            style={{ animation: 'fadeIn 300ms ease 600ms both' }}
          >
            SPEC<span className="text-[#BFFF00]">/</span>TWIN
          </h1>

          <p
            className="font-mono text-[11px] uppercase tracking-widest opacity-60 mt-2 text-center"
            style={{ animation: 'fadeIn 250ms ease 900ms both' }}
          >
            ELIMINATE SIZING UNCERTAINTY — AUDIT BEFORE YOU BUY
          </p>

          <div className="relative mt-8 min-w-[340px]">
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'var(--border)',
                transformOrigin: 'left',
                animation: 'scaleInX 300ms ease 1200ms both',
              }}
            />

            <div
              className="border-4 border-border bg-background p-8 flex flex-col gap-5 min-w-[340px]"
              style={{
                boxShadow: '5px 5px 0px var(--border)',
                animation: 'fadeIn 200ms ease 1500ms both',
              }}
            >
              <span
                className="font-mono text-[10px] uppercase tracking-widest opacity-40 self-start"
                style={{ animation: 'fadeIn 200ms ease 2400ms both' }}
              >
                // SYSTEM ENTRY
              </span>

              <button
                className="bg-primary text-primary-foreground border-4 border-border font-black text-sm uppercase tracking-widest py-5 w-full cursor-pointer"
                style={{
                  boxShadow: '4px 4px 0px var(--border)',
                  transition: 'transform 75ms, box-shadow 75ms',
                  animation: 'slideUpFade 300ms ease 2700ms both',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translate(-2px, -2px)'
                  e.currentTarget.style.boxShadow = '6px 6px 0px var(--border)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = ''
                  e.currentTarget.style.boxShadow = '4px 4px 0px var(--border)'
                }}
                onMouseDown={e => {
                  e.currentTarget.style.transform = 'translate(2px, 2px)'
                  e.currentTarget.style.boxShadow = '2px 2px 0px var(--border)'
                }}
                onMouseUp={e => {
                  e.currentTarget.style.transform = 'translate(-2px, -2px)'
                  e.currentTarget.style.boxShadow = '6px 6px 0px var(--border)'
                }}
                onClick={() => { setMode('open'); navigate('/onboarding/1') }}
              >
                GET STARTED
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
