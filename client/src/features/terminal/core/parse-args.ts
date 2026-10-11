import type { CommandOptionType } from '@/features/terminal/core/command'

export type ParsedOptions = {
  _: string[]
  [key: string]: unknown
}

/**
 * 轻量参数解析（覆盖 getopts 本阶段所需能力）
 */
export function parseCommandArgs(
  text: string,
  commandOptions: CommandOptionType[],
): ParsedOptions {
  const tokens = text.trim().split(/\s+/).slice(1)
  const result: ParsedOptions = { _: [] }

  const aliasToKey = new Map<string, string>()
  const optionMeta = new Map<string, CommandOptionType>()

  // 全局 --help / -h
  aliasToKey.set('h', 'help')
  aliasToKey.set('help', 'help')
  optionMeta.set('help', {
    key: 'help',
    alias: ['h'],
    type: 'boolean',
    defaultValue: false,
  })

  commandOptions.forEach((option) => {
    optionMeta.set(option.key, option)
    aliasToKey.set(option.key, option.key)
    option.alias?.forEach((a) => aliasToKey.set(a, option.key))
    if (option.defaultValue !== undefined) {
      result[option.key] = option.defaultValue
    }
  })

  result.help = false

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]!
    if (token.startsWith('--')) {
      const key = token.slice(2)
      const mapped = aliasToKey.get(key) ?? key
      const meta = optionMeta.get(mapped)
      if (meta?.type === 'boolean') {
        result[mapped] = true
      } else {
        const value = tokens[i + 1]
        if (value && !value.startsWith('-')) {
          result[mapped] = value
          i++
        } else {
          result[mapped] = true
        }
      }
      continue
    }
    if (token.startsWith('-') && token.length > 1) {
      const key = token.slice(1)
      const mapped = aliasToKey.get(key) ?? key
      const meta = optionMeta.get(mapped)
      if (meta?.type === 'boolean' || mapped === 'help') {
        result[mapped] = true
      } else {
        const value = tokens[i + 1]
        if (value && !value.startsWith('-')) {
          result[mapped] = value
          i++
        } else {
          result[mapped] = true
        }
      }
      continue
    }
    result._.push(token)
  }

  return result
}
