import type { TerminalApi } from '@/features/terminal/types'

export type ShortcutType = {
  code: string
  desc?: string
  keyDesc?: string
  ctrlKey?: boolean
  metaKey?: boolean
  shiftKey?: boolean
}

/** 供 shortcut 命令展示（实际按键在 CmdTerminal 内处理） */
export const shortcutList: ShortcutType[] = [
  {
    desc: '清屏',
    code: 'KeyL',
    keyDesc: 'Ctrl + L',
    ctrlKey: true,
  },
  {
    desc: '折叠',
    code: 'KeyO',
    keyDesc: 'Ctrl + O',
    ctrlKey: true,
  },
  {
    desc: '查看上一条命令',
    code: 'ArrowUp',
    keyDesc: '↑',
  },
  {
    desc: '查看下一条命令',
    code: 'ArrowDown',
    keyDesc: '↓',
  },
  {
    desc: '命令补全',
    code: 'Tab',
    keyDesc: 'Tab',
  },
]

export function matchCommandHint(
  input: string,
  commandNames: string[],
): string {
  const text = input.trim().toLowerCase()
  if (!text) return ''
  const first = text.split(/\s+/)[0] ?? ''
  const matched = commandNames
    .filter((name) => name.startsWith(first))
    .sort((a, b) => a.length - b.length)
  if (matched.length === 0) return ''
  if (matched[0] === first && text.includes(' ')) return ''
  return matched[0] ?? ''
}

export function focusTerminalOnTyping(
  e: KeyboardEvent,
  terminal: TerminalApi,
) {
  const key = e.key
  if (
    key.length === 1 &&
    key >= 'a' &&
    key <= 'z' &&
    !e.metaKey &&
    !e.shiftKey &&
    !e.ctrlKey &&
    !terminal.isInputFocused()
  ) {
    terminal.focusInput()
  }
}
