import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import type { Locale } from '@/i18n'

type LocaleState = {
  locale: Locale
  setLocale: (locale: Locale) => void
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: 'zh',
      setLocale: (locale) => set({ locale }),
    }),
    {
      name: 'admin-locale',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
