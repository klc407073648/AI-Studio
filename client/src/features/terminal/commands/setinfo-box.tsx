import type { CommandType } from '@/features/terminal/core/command'

export function SetInfoBox({
  name,
  commands,
}: {
  name: string
  commands: CommandType[]
}) {
  return (
    <div className="my-2 space-y-2 text-white">
      <div>命令集 {name}</div>
      <div>命令列表：</div>
      {commands.map((command) => (
        <div key={command.func} className="space-y-1">
          <div className="grid grid-cols-[100px_140px_1fr] gap-3">
            <span>{command.func}</span>
            <span>{command.name}</span>
            <span className="text-white/70">{command.desc ?? ''}</span>
          </div>
          {command.subCommands ? (
            <div className="ml-6 space-y-1 text-white/80">
              <div>子命令列表：</div>
              {Object.values(command.subCommands).map((sub) => (
                <div
                  key={sub.func}
                  className="grid grid-cols-[100px_140px] gap-3"
                >
                  <span>{sub.func}</span>
                  <span>{sub.name}</span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  )
}
