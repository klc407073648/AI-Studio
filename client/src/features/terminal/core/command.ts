import type { ParsedOptions } from '@/features/terminal/core/parse-args'
import type { TerminalApi } from '@/features/terminal/types'

export type CommandParamsType = {
  key: string
  desc?: string
  defaultValue?: string | boolean
  required?: boolean
}

export type CommandOptionType = {
  key: string
  alias?: string[]
  desc?: string
  type: 'string' | 'boolean'
  defaultValue?: string | boolean
  required?: boolean
}

export type CommandType = {
  func: string
  name: string
  desc?: string
  cmdSet?: string
  alias?: string[]
  params?: CommandParamsType[]
  options: CommandOptionType[]
  subCommands?: Record<string, CommandType>
  action: (
    options: ParsedOptions,
    terminal: TerminalApi,
    parentCommand?: CommandType,
  ) => void | Promise<void>
  collapsible?: boolean
  helpDetails?: string[]
}
