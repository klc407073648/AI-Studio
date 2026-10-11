import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type TerminalConfigState = {
  background: string
  showHint: boolean
  welcomeTexts: string[]
  setBackground: (url: string) => void
  setOrToggleShowHint: (hint?: 'on' | 'off') => boolean
  setWelcomeTexts: (texts: string[]) => void
  reset: () => void
}

const initialState = {
  background: 'black',
  showHint: true,
  welcomeTexts: [] as string[],
}

export const useTerminalConfigStore = create<TerminalConfigState>()(
  persist(
    (set, get) => ({
      ...initialState,
      setBackground: (url) => {
        if (!url) return
        set({ background: url })
      },
      setOrToggleShowHint: (hint) => {
        if (!hint) {
          const next = !get().showHint
          set({ showHint: next })
          return next
        }
        const next = hint === 'on'
        set({ showHint: next })
        return next
      },
      setWelcomeTexts: (welcomeTexts) => set({ welcomeTexts }),
      reset: () => set({ ...initialState }),
    }),
    {
      name: 'terminal-config-store',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
