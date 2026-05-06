import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from './ui/magic/Button'
import { Plus, Check, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'

interface Anchor {
  id: string
  brand: string
  styleName: string
  silhouette: string
  size: string
  fitType: string
  fitTypeColor: 'teal' | 'lime' | 'amber'
}

const ANCHORS: Anchor[] = [
  {
    id: 'madewell-perfect-vintage',
    brand: 'Madewell',
    styleName: 'Perfect Vintage Straight',
    silhouette: 'High Rise Straight',
    size: '27x29',
    fitType: 'Comfort Stretch',
    fitTypeColor: 'amber',
  },
  {
    id: 'levis-501',
    brand: "Levi's",
    styleName: '501 Original',
    silhouette: 'High Rise Straight',
    size: '28x30',
    fitType: 'Rigid',
    fitTypeColor: 'teal',
  },
  {
    id: 'agolde-90s',
    brand: 'AGOLDE',
    styleName: "90's Jean",
    silhouette: 'High Rise Relaxed Straight',
    size: '27x28',
    fitType: 'High Stretch',
    fitTypeColor: 'lime',
  },
]

const badgeStyles: Record<Anchor['fitTypeColor'], string> = {
  teal: 'bg-[var(--accent-teal)] text-[var(--accent-teal-foreground)]',
  lime: 'bg-secondary text-secondary-foreground',
  amber: 'bg-primary text-primary-foreground',
}

export function FitVault() {
  const navigate = useNavigate()
  const [activeId, setActiveId] = useState<string>('madewell-perfect-vintage')
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const activeAnchor = ANCHORS.find((a) => a.id === activeId)

  useEffect(() => {
    if (!openMenuId) return
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null)
      }
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenMenuId(null)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [openMenuId])

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl">
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="font-heading font-black text-4xl sm:text-5xl tracking-tight text-foreground">
          Your Fit Vault
        </h1>
        <p className="font-mono text-sm text-muted-foreground">
          Select a benchmark garment to start an audit.
        </p>
      </div>

      {/* Anchor Grid */}
      <div className="grid grid-cols-1 gap-4">
        {ANCHORS.map((anchor) => {
          const isActive = anchor.id === activeId
          const isMenuOpen = openMenuId === anchor.id
          return (
            <div
              key={anchor.id}
              className={`relative rounded-2xl bg-card transition-all ${isActive ? 'border-4 border-border shadow-[8px_8px_0px_0px_var(--border)] translate-x-[-2px] translate-y-[-2px]' : 'border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] hover:shadow-[4px_4px_0px_0px_var(--border)] hover:translate-x-[-1px] hover:translate-y-[-1px]'}`}
            >
              {/* ACTIVE sticker */}
              {isActive && (
                <div className="absolute top-0 right-0 bg-secondary text-secondary-foreground text-xs font-black tracking-[0.15em] px-3 py-1.5 rounded-bl-xl border-l-2 border-b-2 border-border z-10">
                  ACTIVE
                </div>
              )}

              {/* Three-dot menu */}
              <div
                ref={isMenuOpen ? menuRef : undefined}
                className={`absolute ${isActive ? 'top-10' : 'top-3'} right-3 z-20`}
              >
                <button
                  type="button"
                  aria-label={`Edit or delete ${anchor.brand} ${anchor.styleName}`}
                  aria-haspopup="menu"
                  aria-expanded={isMenuOpen}
                  onClick={(e) => {
                    e.stopPropagation()
                    setOpenMenuId(isMenuOpen ? null : anchor.id)
                  }}
                  className="w-8 h-8 rounded-full border-2 border-border bg-card flex items-center justify-center hover:bg-muted transition-colors shadow-[2px_2px_0px_0px_var(--border)]"
                >
                  <MoreHorizontal className="w-4 h-4 text-foreground" strokeWidth={2.5} />
                </button>

                {isMenuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 top-10 w-44 bg-background border-2 border-border rounded-xl shadow-[4px_4px_0px_0px_var(--border)] overflow-hidden z-30 animate-in fade-in slide-in-from-top-1 duration-150"
                  >
                    <button
                      role="menuitem"
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setOpenMenuId(null) }}
                      className="w-full flex items-center gap-2 px-3 py-2.5 font-mono text-sm font-bold text-foreground hover:bg-muted transition-colors text-left"
                    >
                      <Pencil className="w-4 h-4" strokeWidth={2.5} />
                      Edit anchor
                    </button>
                    <button
                      role="menuitem"
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setOpenMenuId(null) }}
                      className="w-full flex items-center gap-2 px-3 py-2.5 font-mono text-sm font-bold text-foreground hover:bg-muted transition-colors text-left border-t-2 border-border"
                    >
                      <Trash2 className="w-4 h-4" strokeWidth={2.5} />
                      Delete anchor
                    </button>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setActiveId(anchor.id)}
                className="w-full text-left p-5 sm:p-6"
              >
                <div className="flex items-start justify-between gap-4 pr-16">
                  <div className="space-y-2 min-w-0">
                    <div className="space-y-0.5">
                      <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                        {anchor.brand}
                      </p>
                      <h3 className="font-heading font-black text-2xl sm:text-3xl tracking-tight text-foreground leading-tight">
                        {anchor.styleName}
                      </h3>
                      <p className="font-mono text-sm text-muted-foreground pt-0.5">{anchor.silhouette}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap pt-1">
                      <div className="flex items-center gap-1.5 font-mono text-sm">
                        <span className="text-muted-foreground">Size</span>
                        <span className="font-bold text-foreground">{anchor.size}</span>
                      </div>
                      <span className={`inline-block border-2 border-border rounded-lg px-2.5 py-1 text-xs font-bold shadow-[2px_2px_0px_0px_var(--border)] ${badgeStyles[anchor.fitTypeColor]}`}>
                        {anchor.fitType}
                      </span>
                    </div>
                  </div>
                  <div className={`shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${isActive ? 'border-border bg-background text-foreground shadow-[2px_2px_0px_0px_var(--border)]' : 'border-border/30 bg-transparent text-transparent'}`}>
                    <Check strokeWidth={3} className="w-5 h-5" />
                  </div>
                </div>
              </button>
            </div>
          )
        })}

        {/* Add New Anchor */}
        <button
          onClick={() => navigate('/anchor/new')}
          className="rounded-2xl bg-card border-2 border-dashed border-border/60 p-6 flex items-center justify-center gap-3 hover:border-border hover:bg-muted/40 transition-colors group"
        >
          <div className="w-8 h-8 rounded-full border-2 border-border bg-card flex items-center justify-center shadow-[2px_2px_0px_0px_var(--border)] group-hover:shadow-[4px_4px_0px_0px_var(--border)] transition-all">
            <Plus strokeWidth={3} className="w-4 h-4 text-foreground" />
          </div>
          <span className="font-mono text-sm font-bold text-foreground">Add New Anchor</span>
        </button>
      </div>

      {/* Primary CTA */}
      <Button
        onClick={() =>
          navigate('/audit/new', {
            state: {
              anchorLabel: activeAnchor
                ? `${activeAnchor.brand} ${activeAnchor.styleName}, Size ${activeAnchor.size}`
                : '',
            },
          })
        }
        className="w-full border-2 font-black text-xl py-8 transition-all bg-primary text-primary-foreground border-border shadow-hard shadow-hard-hover shadow-hard-active cursor-pointer uppercase tracking-wide"
      >
        Start Audit
      </Button>
    </div>
      </div>
    </div>
  )
}
