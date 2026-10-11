/**
 * 引入命令集以触发 registerCommands 副作用
 */
import '@/features/terminal/commands/terminal-commands'
import '@/features/terminal/commands/search-commands'
import '@/features/terminal/commands/tool-commands'
import '@/features/terminal/commands/space-commands'
import '@/features/terminal/commands/relax-commands'
import '@/features/terminal/commands/manage-commands'
import '@/features/terminal/commands/log-commands'
import '@/features/terminal/commands/setinfo-command'

export {
  commandList,
  commandMap,
  getCommandMap,
  getCommandNames,
} from '@/features/terminal/core/registry'
