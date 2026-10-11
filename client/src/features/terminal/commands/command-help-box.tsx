import type { CommandType } from '@/features/terminal/core/command'
import { getUsageStr } from '@/features/terminal/core/help-utils'

export function CommandHelpBox({
  command,
  parentCommand,
}: {
  command: CommandType
  parentCommand?: CommandType
}) {
  return (
    <div className="space-y-1 text-white">
      <div>
        命令：{command.name}（{command.func}）
      </div>
      {command.desc ? <div>描述：{command.desc}</div> : null}
      {command.alias && command.alias.length > 0 ? (
        <div>别名：{command.alias.join(', ')}</div>
      ) : null}
      <div>用法：{getUsageStr(command, parentCommand)}</div>
      {command.subCommands && Object.keys(command.subCommands).length > 0 ? (
        <div>
          子命令：{Object.keys(command.subCommands).join(', ')}
        </div>
      ) : null}
      {command.helpDetails?.map((line) => (
        <div key={line} className="font-mono text-sm text-white/80">
          {line}
        </div>
      ))}
    </div>
  )
}
