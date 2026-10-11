import type { ReactNode } from 'react'

/** 输出状态 */
export type OutputStatus = 'info' | 'success' | 'warning' | 'error' | 'system'

export type OutputBase = {
  collapsible?: boolean
}

/** 文本输出 */
export type TextOutput = OutputBase & {
  type: 'text'
  text: string
  status?: OutputStatus
}

/** 命令输出（含结果列表） */
export type CommandOutput = OutputBase & {
  type: 'command'
  text: string
  resultList: TerminalOutput[]
}

/** 组件输出（后续命令集使用） */
export type ComponentOutput = OutputBase & {
  type: 'component'
  node: ReactNode
}

export type TerminalOutput = TextOutput | CommandOutput | ComponentOutput

export type CommandInputState = {
  text: string
  placeholder?: string
}

/**
 * 终端操作接口（对齐 cmd-terminal TerminalType）
 * 阶段 0～1 先实现壳能力，命令引擎后续接入。
 */
export type TerminalApi = {
  clear: () => void
  writeOutput: (output: TerminalOutput) => void
  writeTextOutput: (text: string, status?: OutputStatus) => void
  writeTextResult: (text: string, status?: OutputStatus) => void
  writeTextErrorResult: (text: string) => void
  writeTextSuccessResult: (text: string) => void
  writeResult: (output: TerminalOutput) => void
  focusInput: () => void
  isInputFocused: () => boolean
  setTabCompletion: () => void
  doSubmitCommand: () => void
  showNextCommand: () => void
  showPrevCommand: () => void
  listCommandHistory: () => CommandOutput[]
  toggleAllCollapse: () => void
  setCommandCollapsible: (collapsible: boolean) => void
}
