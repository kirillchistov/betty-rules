import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { AppState } from './types'
import { load, persist } from './storage'

type Store = {
  state: AppState
  saveWarning: boolean
  update: (patch: (state: AppState) => AppState) => void
  replaceAll: (state: AppState) => void
}

const StoreContext = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => load())
  const [saveWarning, setSaveWarning] = useState(false)

  const api = useMemo<Store>(() => {
    const write = (next: AppState) => {
      setState(next)
      setSaveWarning(!persist(next))
    }
    return {
      state,
      saveWarning,
      update: (patch) => write(patch(state)),
      replaceAll: (next) => write(next),
    }
  }, [state, saveWarning])

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>
}

export function useStore(): Store {
  const store = useContext(StoreContext)
  if (!store) throw new Error('Хранилище ещё не готово')
  return store
}
