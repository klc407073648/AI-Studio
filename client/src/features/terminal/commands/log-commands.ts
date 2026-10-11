import type { CommandType } from '@/features/terminal/core/command'
import { searchContext } from '@/features/terminal/commands/shared-options'
import { registerCommands } from '@/features/terminal/core/registry'
import {
  LOCAL_USER,
  useTerminalUserStore,
} from '@/features/terminal/stores/terminal-user-store'

export const writeUserLogCommand: CommandType = {
  func: 'write_user_log',
  name: '写用户操作日志',
  desc: '写入一条用户操作日志',
  cmdSet: 'log',
  params: [searchContext],
  options: [
    {
      key: 'hide',
      desc: '静默模式（不输出结果）',
      alias: ['q'],
      type: 'boolean',
      defaultValue: false,
    },
  ],
  collapsible: true,
  async action(options, terminal) {
    const { _, hide } = options
    if (_.length < 1) {
      terminal.writeTextErrorResult('参数不足，如：write_user_log 打开了终端')
      return
    }

    const content = String(_[0]).replaceAll('%', ' ')
    const { loginUser } = useTerminalUserStore.getState()
    const userId =
      loginUser.userAccount === LOCAL_USER.userAccount
        ? 'local'
        : loginUser.userAccount

    try {
      const res = await fetch(`/api/terminal/log/user/${encodeURIComponent(userId)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })
      const data = (await res.json()) as {
        code: number
        message?: string
        description?: string
      }

      if (data.code !== 0) {
        if (!hide) {
          terminal.writeTextErrorResult(
            `${data.message ?? '写入失败'}:${data.description ?? ''}`,
          )
        }
        return
      }

      if (!hide) terminal.writeTextSuccessResult('写入成功')
    } catch (error) {
      if (!hide) {
        terminal.writeTextErrorResult(
          error instanceof Error ? error.message : '写入失败',
        )
      }
    }
  },
}

export const logCommands: CommandType[] = [writeUserLogCommand]

registerCommands(logCommands)
