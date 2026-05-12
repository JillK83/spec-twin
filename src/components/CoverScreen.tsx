import { useNavigate } from 'react-router-dom'

export default function CoverScreen() {
  const navigate = useNavigate()

  return (
    <>
      <style>{`
        @keyframes logoIn {
          from { transform: scale(0.8); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
        @keyframes wordmarkIn {
          from { transform: translateY(8px); opacity: 0; }
          to   { transform: translateY(0);   opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes cardIn {
          from { transform: translateY(12px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @keyframes ctaIn {
          from { transform: scale(0.95); opacity: 0; }
          to   { transform: scale(1);    opacity: 1; }
        }
      `}</style>

      <div className="min-h-screen w-full flex flex-col items-center justify-center relative">

        {/* Status bar */}
        <div
          className="fixed top-0 left-0 right-0 flex items-center justify-between px-7 py-3 z-10"
          style={{ animation: 'fadeIn 300ms ease 100ms both' }}
        >
          <span className="font-mono text-[10px] uppercase tracking-widest opacity-50 whitespace-nowrap">SYS:READY</span>
          <span className="font-mono text-[10px] uppercase tracking-widest opacity-50 whitespace-nowrap">MVP — WOMENS DENIM</span>
          <span className="font-mono text-[10px] uppercase tracking-widest opacity-50 whitespace-nowrap">ENGINE V1.0</span>
        </div>

        {/* Corner marks */}
        <div className="fixed top-10 left-10 w-[18px] h-[18px] border-t-2 border-l-2 border-[#1A1A1A] opacity-25" />
        <div className="fixed bottom-10 right-10 w-[18px] h-[18px] border-b-2 border-r-2 border-[#1A1A1A] opacity-25" />

        {/* Main content */}
        <div className="flex flex-col items-center gap-4">

          {/* Logo mark — scales in as a unit */}
          <svg
            width="100"
            height="100"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ animation: 'logoIn 600ms ease-out 0ms both' }}
          >
            <rect x="34" y="28" width="32" height="32" fill="#BFFF00" />
            <rect x="8"  y="14" width="50" height="50" stroke="#1A1A1A" strokeWidth="3" />
            <rect x="42" y="36" width="50" height="50" stroke="#1A1A1A" strokeWidth="3" />
          </svg>

          {/* Wordmark */}
          <h1
            className="font-heading font-black text-6xl uppercase tracking-tighter text-foreground"
            style={{ animation: 'wordmarkIn 500ms ease-out 400ms both' }}
          >
            SPEC<span className="text-[#BFFF00]">/</span>TWIN
          </h1>

          {/* Tagline */}
          <p
            className="font-mono text-[11px] uppercase tracking-widest opacity-60 text-center"
            style={{ animation: 'fadeIn 400ms ease 600ms both' }}
          >
            ELIMINATE SIZING UNCERTAINTY — AUDIT BEFORE YOU BUY
          </p>

          {/* Protocol card */}
          <div
            className="mt-8 w-full max-w-sm rounded-2xl border-4 border-border bg-card p-6 flex flex-col gap-4"
            style={{
              boxShadow: '4px 4px 0px 0px var(--border)',
              animation: 'cardIn 500ms ease-out 900ms both',
            }}
          >
            <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              // AUDIT PROTOCOL
            </span>
            <div className="h-px w-full bg-border" />
            <ol className="flex flex-col gap-3">
              <li className="flex gap-3 items-start">
                <span className="font-heading font-black text-sm shrink-0">1.</span>
                <p className="text-sm leading-snug">
                  <span className="font-heading font-black uppercase tracking-wide">ANCHOR</span>
                  <span className="font-heading font-normal text-muted-foreground"> — Save a garment you already own as your fit baseline.</span>
                </p>
              </li>
              <li className="flex gap-3 items-start">
                <span className="font-heading font-black text-sm shrink-0">2.</span>
                <p className="text-sm leading-snug">
                  <span className="font-heading font-black uppercase tracking-wide">DIGITIZE</span>
                  <span className="font-heading font-normal text-muted-foreground"> — We extract the technical DNA from the new item's specs and materials.</span>
                </p>
              </li>
              <li className="flex gap-3 items-start">
                <span className="font-heading font-black text-sm shrink-0">3.</span>
                <p className="text-sm leading-snug">
                  <span className="font-heading font-black uppercase tracking-wide">ANALYZE</span>
                  <span className="font-heading font-normal text-muted-foreground"> — The engine calculates the Fit Delta to predict how it will actually feel.</span>
                </p>
              </li>
            </ol>
          </div>

          {/* CTA button */}
          <button
            className="bg-primary text-primary-foreground border-2 border-border font-black text-sm uppercase tracking-widest py-5 px-10 rounded-xl cursor-pointer"
            style={{
              boxShadow: '4px 4px 0px var(--border)',
              transition: 'transform 75ms, box-shadow 75ms',
              animation: 'ctaIn 300ms ease-out 1100ms both',
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
            onClick={() => navigate('/onboarding/1')}
          >
            [ INITIALIZE AUDIT ]
          </button>

        </div>
      </div>
    </>
  )
}
