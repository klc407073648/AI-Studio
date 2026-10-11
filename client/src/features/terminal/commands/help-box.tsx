import type { CommandType } from '@/features/terminal/core/command'

const SET_LABEL: Record<string, string> = {
  manage: '管理',
  relax: '休闲',
  search: '搜索',
  space: '空间',
  tool: '工具',
  terminal: '终端',
  log: '日志',
}

const SET_ORDER = [
  'manage',
  'relax',
  'search',
  'space',
  'tool',
  'terminal',
  'log',
]

export function HelpBox({ commands }: { commands: CommandType[] }) {
  const groups = new Map<string, CommandType[]>()
  commands.forEach((command) => {
    const key = command.cmdSet ?? 'other'
    const list = groups.get(key) ?? []
    list.push(command)
    groups.set(key, list)
  })

  return (
    <div className="space-y-3 text-white">
      <div>
        ⭐️ 使用 [help 命令英文名] 可以查询某命令的具体用法，如：help clear
      </div>
      {[...groups.entries()]
        .sort(([a], [b]) => {
          const ai = SET_ORDER.indexOf(a)
          const bi = SET_ORDER.indexOf(b)
          return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi)
        })
        .map(([setKey, list]) => (
          <div key={setKey} className="space-y-1">
            <div className="text-white/60">{SET_LABEL[setKey] ?? setKey}</div>
            {list.map((command) => (
              <div
                key={command.func}
                className="grid grid-cols-[100px_140px_1fr] gap-3"
              >
                <span>{command.func}</span>
                <span>{command.name}</span>
                <span className="text-white/70">{command.desc ?? ''}</span>
              </div>
            ))}
          </div>
        ))}
    </div>
  )
}
