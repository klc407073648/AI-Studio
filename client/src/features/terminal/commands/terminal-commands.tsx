import type { CommandType } from '@/features/terminal/core/command'
import { CommandHelpBox } from '@/features/terminal/commands/command-help-box'
import { HelpBox } from '@/features/terminal/commands/help-box'
import { InfoBox } from '@/features/terminal/commands/info-box'
import { ShortcutBox } from '@/features/terminal/commands/shortcut-box'
import {
  commandList,
  getCommandMap,
  registerCommands,
} from '@/features/terminal/core/registry'
import { useTerminalConfigStore } from '@/features/terminal/stores/terminal-config-store'

const RANDOM_BACKGROUNDS = [
  'black',
  '#0b1020',
  '#111827',
  'linear-gradient(135deg, #0f172a, #1e293b)',
  'linear-gradient(135deg, #0c4a6e, #111827)',
]

export const helpCommand: CommandType = {
  func: 'help',
  name: '查看帮助',
  alias: ['man'],
  desc: '查看命令列表或某个命令的用法',
  cmdSet: 'terminal',
  params: [
    {
      key: 'commandName',
      desc: '命令英文名称',
    },
  ],
  options: [],
  collapsible: true,
  action(options, terminal, parentCommand) {
    const { _ } = options
    if (_.length < 1) {
      terminal.writeResult({
        type: 'component',
        node: <HelpBox commands={[...commandList]} />,
      })
      return
    }

    const commandName = String(_[0]).toLowerCase()
    let commands = getCommandMap()
    if (parentCommand?.subCommands) {
      commands = parentCommand.subCommands
    }
    const command = commands[commandName]
    if (!command) {
      terminal.writeTextErrorResult('找不到指定命令')
      return
    }
    terminal.writeResult({
      type: 'component',
      node: (
        <CommandHelpBox command={command} parentCommand={parentCommand} />
      ),
    })
  },
}

export const clearCommand: CommandType = {
  func: 'clear',
  name: '清屏',
  alias: ['cl'],
  desc: '清空终端输出',
  cmdSet: 'terminal',
  options: [],
  action(_options, terminal) {
    window.setTimeout(() => {
      terminal.clear()
    }, 80)
  },
}

export const historyCommand: CommandType = {
  func: 'history',
  name: '查看执行历史',
  alias: ['h'],
  desc: '列出历史命令，可用 ![序号] 快速执行',
  cmdSet: 'terminal',
  options: [],
  collapsible: true,
  action(_options, terminal) {
    const history = terminal.listCommandHistory()
    if (history.length === 0) {
      terminal.writeTextResult('暂无历史命令', 'info')
      return
    }
    history.forEach((command, index) => {
      terminal.writeTextResult(`${index + 1} ${command.text}`, 'warning')
    })
  },
}

export const resetCommand: CommandType = {
  func: 'reset',
  name: '重置终端配置',
  desc: '重置背景、提示与欢迎语配置',
  cmdSet: 'terminal',
  options: [],
  action(_options, terminal) {
    useTerminalConfigStore.getState().reset()
    terminal.writeTextSuccessResult('已重置终端配置（刷新后欢迎语生效）')
  },
}

export const hintCommand: CommandType = {
  func: 'hint',
  name: '开关提示',
  desc: '开启 / 关闭输入提示',
  cmdSet: 'terminal',
  params: [
    {
      key: 'switch',
      desc: '开关：on 开启, off 关闭',
      defaultValue: 'on',
    },
  ],
  options: [],
  action(options, terminal) {
    const { _ } = options
    let mode: 'on' | 'off' | undefined
    if (_.length >= 1) {
      const value = String(_[0])
      if (value !== 'on' && value !== 'off') {
        terminal.writeTextErrorResult('请输入 on 或 off')
        return
      }
      mode = value
    }
    const res = useTerminalConfigStore.getState().setOrToggleShowHint(mode)
    terminal.writeTextSuccessResult(`输入提示已${res ? '开启' : '关闭'}`)
  },
}

export const welcomeCommand: CommandType = {
  func: 'welcome',
  name: '自定义终端欢迎语',
  desc: '设置欢迎语（多词空格分隔；不填则清空）',
  cmdSet: 'terminal',
  params: [
    {
      key: 'texts',
      desc: '终端提示文本',
      required: false,
    },
  ],
  options: [],
  action(options, terminal) {
    const texts = (options._ as string[]) ?? []
    useTerminalConfigStore.getState().setWelcomeTexts(texts)
    if (texts.length === 0) {
      terminal.writeTextSuccessResult('已清空欢迎语（下次进入生效）')
    } else {
      terminal.writeTextSuccessResult(
        `已设置欢迎语：${texts.join(' ')}（下次进入生效）`,
      )
    }
  },
}

export const backgroundCommand: CommandType = {
  func: 'background',
  name: '切换终端背景',
  alias: ['bg'],
  desc: '设置背景色 / 图片 URL；不填则按分类随机',
  cmdSet: 'terminal',
  params: [
    {
      key: 'url',
      desc: '图片地址或颜色值',
      required: false,
    },
  ],
  options: [
    {
      key: 'lx',
      desc: '分类 meizi|dongman|fengjing|suiji',
      alias: ['l'],
      type: 'string',
      defaultValue: 'fengjing',
    },
  ],
  async action(options, terminal) {
    const { _, lx } = options
    const category = String(lx || 'fengjing')
    const allowed = ['meizi', 'dongman', 'fengjing', 'suiji']
    if (!allowed.includes(category)) {
      terminal.writeTextErrorResult(
        '选择输出分类[meizi|dongman|fengjing|suiji]',
      )
      return
    }

    const { setBackground } = useTerminalConfigStore.getState()
    const url = _[0] ? String(_[0]) : ''

    if (!url) {
      const { getRandomBackground } = await import(
        '@/features/terminal/api/terminal-api'
      )
      const res = await getRandomBackground(category)
      if (res?.code === 0 && res.data) {
        setBackground(res.data)
        terminal.writeTextSuccessResult(`已切换随机背景（${category}）`)
        return
      }
      const fallback =
        RANDOM_BACKGROUNDS[
          Math.floor(Math.random() * RANDOM_BACKGROUNDS.length)
        ]!
      setBackground(fallback)
      terminal.writeTextSuccessResult(`已切换本地随机背景：${fallback}`)
      return
    }

    setBackground(url)
    terminal.writeTextSuccessResult('已切换背景')
  },
}

export const shortcutCommand: CommandType = {
  func: 'shortcut',
  name: '快捷键',
  desc: '查看快捷键',
  cmdSet: 'terminal',
  options: [],
  collapsible: true,
  action(_options, terminal) {
    terminal.writeResult({ type: 'component', node: <ShortcutBox /> })
  },
}

export const infoCommand: CommandType = {
  func: 'info',
  name: '查看本站信息',
  alias: ['author', 'about'],
  desc: '关于 cmdTerminal',
  cmdSet: 'terminal',
  options: [],
  action(_options, terminal) {
    terminal.writeResult({ type: 'component', node: <InfoBox /> })
  },
}

export const terminalCommands: CommandType[] = [
  helpCommand,
  clearCommand,
  historyCommand,
  shortcutCommand,
  hintCommand,
  welcomeCommand,
  backgroundCommand,
  resetCommand,
  infoCommand,
]

registerCommands(terminalCommands)
