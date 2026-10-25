import { pinyin } from 'pinyin-pro'

function normalize(text: string) {
  return text.trim().toLowerCase().replace(/\s+/g, '')
}

/** Build full pinyin and initials tokens for matching (tone-less, lowercased). */
export function toPinyinTokens(text: string): { full: string; initials: string } {
  const source = text.trim()
  if (!source) return { full: '', initials: '' }

  const full = normalize(
    pinyin(source, {
      toneType: 'none',
      type: 'array',
      nonZh: 'consecutive',
    }).join(''),
  )

  const initials = normalize(
    pinyin(source, {
      pattern: 'first',
      toneType: 'none',
      type: 'array',
      nonZh: 'consecutive',
    }).join(''),
  )

  return { full, initials }
}

/**
 * Match query against label using literal substring or pinyin / initials.
 * Returns a score for cmdk (higher is better); 0 means no match.
 */
export function matchByPinyin(value: string, search: string): number {
  const query = normalize(search)
  if (!query) return 1

  const haystack = normalize(value)
  if (haystack.includes(query)) return 1

  const { full, initials } = toPinyinTokens(value)
  if (full.includes(query) || initials.includes(query)) return 1

  return 0
}
