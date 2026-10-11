import type {
  CommandOptionType,
  CommandType,
} from '@/features/terminal/core/command'

export function getOptionKey(option: CommandOptionType) {
  if (option.alias && option.alias.length > 0) {
    return `-${option.alias[0]}`
  }
  return `--${option.key}`
}

export function getUsageStr(
  command: CommandType,
  parentCommand?: CommandType,
) {
  if (!command) return ''
  let str = parentCommand ? `${parentCommand.func} ` : ''
  str += command.func

  if (command.params && command.params.length > 0) {
    const paramsStr = command.params
      .map((param) => {
        const word = param.desc || param.key
        return param.required ? `<${word}>` : `[${word}]`
      })
      .join(' ')
    str += ` ${paramsStr}`
  }

  if (command.options?.length > 0) {
    const optionStr = command.options
      .map((option) => {
        const optionKey = getOptionKey(option)
        if (option.type === 'boolean') {
          const word = option.desc ? `${optionKey} ${option.desc}` : optionKey
          return option.required ? `<${word}>` : `[${word}]`
        }
        const word = option.desc || option.key
        return option.required
          ? `<${optionKey} ${word}>`
          : `[${optionKey} ${word}]`
      })
      .join(' ')
    str += ` ${optionStr}`
  }

  return str
}
