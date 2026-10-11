import { beforeEach, describe, expect, it, vi } from 'vitest'

import '@/features/terminal/core/command-register'
import { doCommandExecute } from '@/features/terminal/core/command-executor'
import type { TerminalApi } from '@/features/terminal/types'

function createMockTerminal(): TerminalApi & {
  results: string[]
  errors: string[]
} {
  const results: string[] = []
  const errors: string[] = []
  const api: TerminalApi & { results: string[]; errors: string[] } = {
    results,
    errors,
    clear: vi.fn(),
    writeOutput: vi.fn(),
    writeTextOutput: vi.fn(),
    writeTextResult: (text) => {
      results.push(text)
    },
    writeTextErrorResult: (text) => {
      errors.push(text)
    },
    writeTextSuccessResult: (text) => {
      results.push(text)
    },
    writeResult: vi.fn(),
    focusInput: vi.fn(),
    isInputFocused: () => true,
    setTabCompletion: vi.fn(),
    doSubmitCommand: vi.fn(),
    showNextCommand: vi.fn(),
    showPrevCommand: vi.fn(),
    listCommandHistory: () => [
      { type: 'command', text: 'help', resultList: [] },
      { type: 'command', text: 'clear', resultList: [] },
    ],
    toggleAllCollapse: vi.fn(),
    setCommandCollapsible: vi.fn(),
  }
  return api
}

describe('doCommandExecute', () => {
  let terminal: ReturnType<typeof createMockTerminal>

  beforeEach(() => {
    terminal = createMockTerminal()
  })

  it('rejects unknown command', async () => {
    await doCommandExecute('not-a-real-command', terminal)
    expect(terminal.errors[0]).toContain('找不到命令')
  })

  it('runs history command', async () => {
    await doCommandExecute('history', terminal)
    expect(terminal.results.some((item) => item.includes('help'))).toBe(true)
    expect(terminal.setCommandCollapsible).toHaveBeenCalledWith(true)
  })

  it('supports help alias man', async () => {
    await doCommandExecute('man clear', terminal)
    expect(terminal.writeResult).toHaveBeenCalled()
  })

  it('runs date command', async () => {
    await doCommandExecute('date', terminal)
    expect(terminal.results.some((item) => item.includes('当前时间'))).toBe(
      true,
    )
  })

  it('rejects empty search keyword', async () => {
    await doCommandExecute('baidu', terminal)
    expect(terminal.errors[0]).toContain('搜索内容')
  })

  it('runs pwd command', async () => {
    await doCommandExecute('pwd', terminal)
    expect(terminal.results.some((item) => item.includes('当前目录'))).toBe(
      true,
    )
  })

  it('shows user login hint when not logged in', async () => {
    await doCommandExecute('user', terminal)
    expect(terminal.errors[0]).toContain('未登录')
  })

  it('rejects setinfo for non-admin', async () => {
    await doCommandExecute('setinfo tool', terminal)
    expect(terminal.errors[0]).toContain('无命令执行权限')
  })
})
