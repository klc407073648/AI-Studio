import { useCallback } from 'react'

import { translate, type MessageKey } from '@/i18n'
import { useLocaleStore } from '@/stores/locale-store'

export function useI18n() {
  const locale = useLocaleStore((state) => state.locale)
  const setLocale = useLocaleStore((state) => state.setLocale)

  const t = useCallback(
    (key: MessageKey, vars?: Record<string, string | number>) =>
      translate(locale, key, vars),
    [locale],
  )

  return { t, locale, setLocale }
}
