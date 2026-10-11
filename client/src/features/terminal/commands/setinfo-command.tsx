import type { CommandType } from '@/features/terminal/core/command'
import { SetInfoBox } from '@/features/terminal/commands/setinfo-box'
import {
  displaySearchItem,
  searchContext,
} from '@/features/terminal/commands/shared-options'
import { commandList, registerCommands } from '@/features/terminal/core/registry'
import {
  LOCAL_USER,
  useTerminalUserStore,
} from '@/features/terminal/stores/terminal-user-store'

const CMD_SETS = [
  'manage',
  'relax',
  'search',
  'space',
  'tool',
  'terminal',
  'log',
] as const

function isAdminUser() {
  const { loginUser } = useTerminalUserStore.getState()
  return (
    loginUser.userAccount !== LOCAL_USER.userAccount &&
    loginUser.userRole === 1
  )
}

export const setinfoCommand: CommandType = {
  func: 'setinfo',
  name: '查看命令集',
  alias: ['set'],
  desc: '按命令集名称查看命令（需 admin）',
  cmdSet: 'manage',
  params: [searchContext],
  options: [displaySearchItem],
  collapsible: true,
  action(options, terminal) {
    if (!isAdminUser()) {
      terminal.writeTextErrorResult('非 admin 用户，无命令执行权限')
      return
    }

    const { _, item } = options
    if (item) {
      terminal.writeTextSuccessResult(`命令集: ${CMD_SETS.join(', ')}`)
      return
    }

    const word = _.length > 0 ? _.join(' ').trim() : ''
    if (!word) {
      terminal.writeTextErrorResult(
        `查询命令集必须输入：${CMD_SETS.join(', ')}`,
      )
      return
    }

    if (!CMD_SETS.includes(word as (typeof CMD_SETS)[number])) {
      terminal.writeTextErrorResult(`找不到命令集：${word}`)
      return
    }

    const commands = commandList.filter((command) => command.cmdSet === word)
    terminal.writeResult({
      type: 'component',
      node: <SetInfoBox name={word} commands={commands} />,
    })
  },
}

registerCommands([setinfoCommand])
