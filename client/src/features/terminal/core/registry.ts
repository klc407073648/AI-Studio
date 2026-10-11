import type { CommandType } from '@/features/terminal/core/command'

export const commandList: CommandType[] = []
export const commandMap: Record<string, CommandType> = {}

export function registerCommands(commands: CommandType[]) {
  commands.forEach((command) => {
    if (!commandList.some((item) => item.func === command.func)) {
      commandList.push(command)
    }
    commandMap[command.func] = command
    command.alias?.forEach((name) => {
      commandMap[name] = command
    })
  })
}

export function getCommandMap() {
  return commandMap
}

export function getCommandNames() {
  return Object.keys(commandMap).sort()
}
