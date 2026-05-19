import { createContext, useContext, useState } from 'react'

type AppMode = 'demo' | 'open'

const AppModeContext = createContext<{
  mode: AppMode
  setMode: (m: AppMode) => void
}>({ mode: 'open', setMode: () => {} })

export const useAppMode = () => useContext(AppModeContext)

export function AppModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<AppMode>('open')
  return (
    <AppModeContext.Provider value={{ mode, setMode }}>
      {children}
    </AppModeContext.Provider>
  )
}
