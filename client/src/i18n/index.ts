import { en } from '@/i18n/en'
import type { Locale, MessageKey } from '@/i18n/types'
import { zh } from '@/i18n/zh'

const dictionaries: Record<Locale, Record<MessageKey, string>> = {
  zh,
  en,
}

export function translate(
  locale: Locale,
  key: MessageKey,
  vars?: Record<string, string | number>,
) {
  const template = dictionaries[locale][key] ?? dictionaries.zh[key] ?? key
  if (!vars) return template
  return Object.entries(vars).reduce(
    (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
    template,
  )
}

export type { Locale, MessageKey }
