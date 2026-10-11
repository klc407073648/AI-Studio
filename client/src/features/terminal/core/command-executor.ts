import type {
  CommandType,
} from '@/features/terminal/core/command'
import { commandMap } from '@/features/terminal/core/command-register'
import { helpCommand } from '@/features/terminal/commands/terminal-commands'
import {
  parseCommandArgs,
  type ParsedOptions,
} from '@/features/terminal/core/parse-args'
import type { TerminalApi } from '@/features/terminal/types'

/**
 * 执行命令
 */
export async function doCommandExecute(
  text: string,
  terminal: TerminalApi,
  parentCommand?: CommandType,
) {
  text = text.trim()
  if (!text) return

  const command = getCommand(text, parentCommand)
  if (!command) {
    terminal.writeTextErrorResult('找不到命令')
    return
  }

  const parsedOptions = parseCommandArgs(text, command.options)
  const { _ } = parsedOptions

  if (
    _.length > 0 &&
    command.subCommands &&
    Object.keys(command.subCommands).length > 0
  ) {
    const subText = text.slice(text.indexOf(' ') + 1)
    await doCommandExecute(subText, terminal, command)
    return
  }

  await doAction(command, parsedOptions, terminal, parentCommand)
}

function getCommand(
  text: string,
  parentCommand?: CommandType,
): CommandType | undefined {
  let func = text.split(' ', 1)[0] ?? ''
  func = func.toLowerCase()
  let commands: Record<string, CommandType> = commandMap
  if (
    parentCommand?.subCommands &&
    Object.keys(parentCommand.subCommands).length > 0
  ) {
    commands = parentCommand.subCommands
  }
  return commands[func]
}

async function doAction(
  command: CommandType,
  options: ParsedOptions,
  terminal: TerminalApi,
  parentCommand?: CommandType,
) {
  const help = Boolean(options.help)
  if (command.collapsible || help) {
    terminal.setCommandCollapsible(true)
  }

  if (help) {
    const newOptions = { ...options, _: [command.func] }
    await helpCommand.action(newOptions, terminal, parentCommand)
    return
  }

  await command.action(options, terminal, parentCommand)
}
