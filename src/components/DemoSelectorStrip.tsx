import { useNavigate, useLocation } from 'react-router-dom'

const scenarios = [
  { label: 'Scenario 1', n: 1 },
  { label: 'Scenario 2', n: 2 },
  { label: 'Scenario 3', n: 3 },
]

export function DemoSelectorStrip() {
  const navigate = useNavigate()
  const location = useLocation()
  const isOnAudit = location.pathname === '/audit/new'
  const auditScenarioParam = new URLSearchParams(location.search).get('scenario')

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-background border-b-2 border-border px-6 py-3">
      <div className="flex items-center gap-2 justify-center">
        {scenarios.map((s) => {
          const verdictPath = `/verdict/${s.n}`
          const isActive = isOnAudit
            ? auditScenarioParam === String(s.n)
            : location.pathname === verdictPath
          const handleClick = () => {
            if (isOnAudit) {
              navigate(`/audit/new?scenario=${s.n}`)
            } else {
              navigate(verdictPath)
            }
          }
          return (
            <button
              key={s.n}
              onClick={handleClick}
              className={
                isActive
                  ? 'font-mono text-sm font-bold border-2 border-border rounded-full px-4 py-1.5 bg-foreground text-background shadow-[4px_4px_0px_0px_var(--border)] -translate-x-[2px] -translate-y-[2px] transition-all'
                  : 'font-mono text-sm font-bold border-2 border-border rounded-full px-4 py-1.5 bg-muted text-muted-foreground shadow-[2px_2px_0px_0px_var(--border)] hover:bg-muted/70 transition-all'
              }
            >
              {s.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
