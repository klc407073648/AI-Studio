import { describe, expect, it } from 'vitest'

import { matchByPinyin, toPinyinTokens } from '@/lib/pinyin-match'

describe('toPinyinTokens', () => {
  it('builds full pinyin and initials for Chinese labels', () => {
    const tokens = toPinyinTokens('用户管理')
    expect(tokens.full).toContain('yonghu')
    expect(tokens.initials).toMatch(/^yh/)
  })
})

describe('matchByPinyin', () => {
  it('matches literal Chinese', () => {
    expect(matchByPinyin('用户管理 /users', '用户')).toBe(1)
  })

  it('matches full pinyin and initials', () => {
    expect(matchByPinyin('用户管理 /users', 'yonghu')).toBe(1)
    expect(matchByPinyin('用户管理 /users', 'yh')).toBe(1)
  })

  it('matches english path segments', () => {
    expect(matchByPinyin('用户管理 /users', 'users')).toBe(1)
  })

  it('returns 0 when nothing matches', () => {
    expect(matchByPinyin('仪表盘 /', 'xyz')).toBe(0)
  })

  it('returns 1 for empty query', () => {
    expect(matchByPinyin('仪表盘 /', '')).toBe(1)
  })
})
