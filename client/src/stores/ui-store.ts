import { create } from 'zustand'

const STORAGE_KEY = 'admin-console.sidebar-collapsed'

function readCollapsed(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return window.localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

function writeCollapsed(collapsed: boolean) {
  try {
    window.localStorage.setItem(STORAGE_KEY, collapsed ? '1' : '0')
  } catch {
    // ignore quota / private mode
  }
}

type UiState = {
  sidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
  toggleSidebarCollapsed: () => void
}

export const useUiStore = create<UiState>((set) => ({
  sidebarCollapsed: readCollapsed(),
  setSidebarCollapsed: (collapsed) => {
    writeCollapsed(collapsed)
    set({ sidebarCollapsed: collapsed })
  },
  toggleSidebarCollapsed: () =>
    set((state) => {
      const sidebarCollapsed = !state.sidebarCollapsed
      writeCollapsed(sidebarCollapsed)
      return { sidebarCollapsed }
    }),
}))
