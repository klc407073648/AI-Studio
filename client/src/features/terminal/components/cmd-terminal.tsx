import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  forwardRef,
  type KeyboardEvent,
  type CSSProperties,
} from 'react'

import { ContentOutput } from '@/features/terminal/components/content-output'
import { getCommandNames } from '@/features/terminal/core/command-register'
import { matchCommandHint } from '@/features/terminal/core/shortcuts'
import { useTerminalConfigStore } from '@/features/terminal/stores/terminal-config-store'
import type {
  CommandOutput,
  TerminalApi,
  TerminalOutput,
  OutputStatus,
} from '@/features/terminal/types'
import { cn } from '@/lib/utils'

export type CmdTerminalHandle = {
  terminal: TerminalApi
}

type CmdTerminalProps = {
  userName?: string
  fullScreen?: boolean
  height?: string | number
  className?: string
  /** 阶段 0～1：提交后由外部处理；未接入命令引擎时给占位反馈 */
  onSubmitCommand?: (
    inputText: string,
    terminal: TerminalApi,
  ) => void | Promise<void>
}

export const CmdTerminal = forwardRef<CmdTerminalHandle, CmdTerminalProps>(
  function CmdTerminal(
    {
      userName = 'local',
      fullScreen = false,
      height = '400px',
      className,
      onSubmitCommand,
    },
    ref,
  ) {
    const background = useTerminalConfigStore((s) => s.background)
    const showHint = useTerminalConfigStore((s) => s.showHint)
    const welcomeTexts = useTerminalConfigStore((s) => s.welcomeTexts)

    const [outputList, setOutputList] = useState<TerminalOutput[]>([])
    const [commandList, setCommandList] = useState<CommandOutput[]>([])
    const [inputText, setInputText] = useState('')
    const [hint, setHint] = useState('')
    const [isRunning, setIsRunning] = useState(false)
    const [collapsed, setCollapsed] = useState<Record<number, boolean>>({})
    const [historyPos, setHistoryPos] = useState(0)

    const terminalScrollRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const currentCommandRef = useRef<CommandOutput | null>(null)
    const commandListRef = useRef<CommandOutput[]>([])
    const historyPosRef = useRef(0)
    const inputTextRef = useRef('')
    const hintRef = useRef('')

    useEffect(() => {
      commandListRef.current = commandList
    }, [commandList])
    useEffect(() => {
      historyPosRef.current = historyPos
    }, [historyPos])
    useEffect(() => {
      inputTextRef.current = inputText
    }, [inputText])
    useEffect(() => {
      hintRef.current = hint
    }, [hint])

    const prompt = `[${userName}]$`

    const scrollToBottom = useCallback(() => {
      window.setTimeout(() => {
        const el = terminalScrollRef.current
        if (el) el.scrollTop = el.scrollHeight
      }, 50)
    }, [])

    const writeOutput = useCallback(
      (output: TerminalOutput) => {
        setOutputList((prev) => [...prev, output])
        scrollToBottom()
      },
      [scrollToBottom],
    )

    const writeTextOutput = useCallback(
      (text: string, status?: OutputStatus) => {
        writeOutput({ type: 'text', text, status })
      },
      [writeOutput],
    )

    const writeResult = useCallback((output: TerminalOutput) => {
      const current = currentCommandRef.current
      if (!current) return
      current.resultList.push(output)
      setOutputList((prev) => [...prev])
      scrollToBottom()
    }, [scrollToBottom])

    const writeTextResult = useCallback(
      (text: string, status: OutputStatus = 'success') => {
        writeResult({ type: 'text', text, status })
      },
      [writeResult],
    )

    const focusInput = useCallback(() => {
      inputRef.current?.focus()
    }, [])

    const clear = useCallback(() => {
      setOutputList([])
      setCollapsed({})
      currentCommandRef.current = null
    }, [])

    const showPrevCommand = useCallback(() => {
      const list = commandListRef.current
      if (list.length === 0) return
      let pos = historyPosRef.current - 1
      if (pos < 0) pos = 0
      setHistoryPos(pos)
      setInputText(list[pos]?.text ?? '')
    }, [])

    const showNextCommand = useCallback(() => {
      const list = commandListRef.current
      if (list.length === 0) return
      let pos = historyPosRef.current + 1
      if (pos >= list.length) {
        setHistoryPos(list.length)
        setInputText('')
        return
      }
      setHistoryPos(pos)
      setInputText(list[pos]?.text ?? '')
    }, [])

    const listCommandHistory = useCallback(() => commandListRef.current, [])

    const setTabCompletion = useCallback(() => {
      const h = hintRef.current.trim()
      if (!h) return
      const first = h.split(/\s+/)[0] ?? ''
      setInputText(first + (h.includes(' ') ? ' ' : ''))
    }, [])

    const toggleAllCollapse = useCallback(() => {
      setCollapsed((prev) => {
        const collapsibleIndexes = outputList
          .map((item, index) => (item.type === 'command' && item.collapsible ? index : -1))
          .filter((index) => index >= 0)
        const anyOpen = collapsibleIndexes.some((index) => !prev[index])
        const next: Record<number, boolean> = { ...prev }
        for (const index of collapsibleIndexes) {
          next[index] = anyOpen
        }
        return next
      })
    }, [outputList])

    const setCommandCollapsible = useCallback((collapsible: boolean) => {
      if (currentCommandRef.current) {
        currentCommandRef.current.collapsible = collapsible
        setOutputList((prev) => [...prev])
      }
    }, [])

    const doSubmitCommand = useCallback(async () => {
      if (isRunning) return
      setIsRunning(true)
      setHint('')

      let text = inputTextRef.current
      if (text.startsWith('!')) {
        const index = Number(text.slice(1))
        const historyItem = commandListRef.current[index - 1]
        if (historyItem) text = historyItem.text
      }

      const newCommand: CommandOutput = {
        type: 'command',
        text,
        resultList: [],
      }
      currentCommandRef.current = newCommand

      const api = apiRef.current
      if (api && onSubmitCommand) {
        await onSubmitCommand(text, api)
      } else if (text.trim()) {
        newCommand.resultList.push({
          type: 'text',
          text: '未绑定命令执行器',
          status: 'error',
        })
      }

      setOutputList((prev) => [...prev, newCommand])
      if (text.trim()) {
        setCommandList((prev) => {
          const next = [...prev, newCommand]
          setHistoryPos(next.length)
          return next
        })
      } else {
        setHistoryPos(commandListRef.current.length)
      }
      setInputText('')
      scrollToBottom()
      setIsRunning(false)
      focusInput()
    }, [focusInput, isRunning, onSubmitCommand, scrollToBottom])

    const apiRef = useRef<TerminalApi | null>(null)

    const terminalApi = useMemo<TerminalApi>(
      () => ({
        clear,
        writeOutput,
        writeTextOutput,
        writeTextResult,
        writeTextErrorResult: (text) => writeTextResult(text, 'error'),
        writeTextSuccessResult: (text) => writeTextResult(text, 'success'),
        writeResult,
        focusInput,
        isInputFocused: () => document.activeElement === inputRef.current,
        setTabCompletion,
        doSubmitCommand: () => {
          void doSubmitCommand()
        },
        showNextCommand,
        showPrevCommand,
        listCommandHistory,
        toggleAllCollapse,
        setCommandCollapsible,
      }),
      [
        clear,
        doSubmitCommand,
        focusInput,
        listCommandHistory,
        setCommandCollapsible,
        setTabCompletion,
        showNextCommand,
        showPrevCommand,
        toggleAllCollapse,
        writeOutput,
        writeResult,
        writeTextOutput,
        writeTextResult,
      ],
    )

    apiRef.current = terminalApi

    useImperativeHandle(ref, () => ({ terminal: terminalApi }), [terminalApi])

    useEffect(() => {
      if (welcomeTexts.length > 0) {
        welcomeTexts.forEach((text) => writeTextOutput(text))
      } else {
        writeTextOutput(
          `Welcome to cmdTerminal, coolest browser index for geeks! <a href="https://github.com/klc407073648/cmd-terminal" target="_blank">GitHub</a>`,
        )
        writeTextOutput(
          `请输入 help 查看命令；示例：pwd · ls · add -n github -l github.com · weather 北京 · fanyi hello · music 晴天`,
        )
        writeTextOutput('<br/>')
      }
      focusInput()
      // 仅挂载时写入欢迎语
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
      function onKeyDown(e: globalThis.KeyboardEvent) {
        const key = e.key
        if (
          key.length === 1 &&
          key >= 'a' &&
          key <= 'z' &&
          !e.metaKey &&
          !e.shiftKey &&
          !e.ctrlKey &&
          document.activeElement !== inputRef.current
        ) {
          focusInput()
        }

        if (e.ctrlKey && e.code === 'KeyL') {
          e.preventDefault()
          clear()
        }
        if (e.ctrlKey && e.code === 'KeyO') {
          e.preventDefault()
          toggleAllCollapse()
        }
      }
      window.addEventListener('keydown', onKeyDown)
      return () => window.removeEventListener('keydown', onKeyDown)
    }, [clear, focusInput, toggleAllCollapse])

    useEffect(() => {
      if (!showHint) {
        setHint('')
        return
      }
      const text = inputText.trim()
      if (!text) {
        setHint('')
        return
      }
      const timer = window.setTimeout(() => {
        setHint(matchCommandHint(text, getCommandNames()))
      }, 400)
      return () => window.clearTimeout(timer)
    }, [inputText, showHint])

    function onInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
      if (event.key === 'Enter') {
        event.preventDefault()
        void doSubmitCommand()
        return
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault()
        showPrevCommand()
        return
      }
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        showNextCommand()
        return
      }
      if (event.key === 'Tab') {
        event.preventDefault()
        setTabCompletion()
      }
    }

    const mainStyle: CSSProperties = fullScreen
      ? { position: 'fixed', inset: 0 }
      : { height }

    const wrapperStyle: CSSProperties = {
      ...mainStyle,
      background: background.startsWith('http')
        ? `url(${background}) center / cover no-repeat`
        : background,
    }

    return (
      <div
        className={cn('bg-black', className)}
        style={wrapperStyle}
        onClick={(event) => {
          if ((event.target as HTMLElement).dataset.terminalMain === 'true') {
            focusInput()
          }
        }}
      >
        <div
          ref={terminalScrollRef}
          data-terminal-main="true"
          className="h-full overflow-auto bg-black/60 p-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={mainStyle}
        >
          <div className="space-y-1">
            {outputList.map((output, index) => {
              if (output.type === 'command') {
                const isCollapsed = Boolean(collapsed[index])
                return (
                  <div key={index} className="terminal-row text-white">
                    <div className="flex flex-wrap items-start gap-2 font-mono text-base">
                      <span className="select-none">{prompt}</span>
                      <span className="break-all">{output.text}</span>
                      {output.collapsible ? (
                        <button
                          type="button"
                          className="ml-auto text-xs text-white/50 hover:text-white/80"
                          onClick={() =>
                            setCollapsed((prev) => ({
                              ...prev,
                              [index]: !prev[index],
                            }))
                          }
                        >
                          {isCollapsed ? '展开' : '折叠'}
                        </button>
                      ) : null}
                    </div>
                    {!isCollapsed
                      ? output.resultList.map((result, idx) => (
                          <div
                            key={idx}
                            className="terminal-row font-mono text-base text-white"
                          >
                            <ContentOutput output={result} />
                          </div>
                        ))
                      : null}
                  </div>
                )
              }

              return (
                <div
                  key={index}
                  className="terminal-row font-mono text-base text-white"
                >
                  <ContentOutput output={output} />
                </div>
              )
            })}
          </div>

          <div className="terminal-row mt-1 flex items-center gap-2 font-mono text-base text-white">
            <span className="select-none shrink-0">{prompt}</span>
            <input
              ref={inputRef}
              value={inputText}
              disabled={isRunning}
              onChange={(event) => setInputText(event.target.value)}
              onKeyDown={onInputKeyDown}
              className="caret-white min-w-0 flex-1 bg-transparent text-base text-white outline-none placeholder:text-white/40"
              placeholder=""
              aria-label="terminal-input"
              autoFocus
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
            />
          </div>

          {showHint && hint && !isRunning ? (
            <div className="terminal-row mt-1 font-mono text-base text-[#bbb]">
              hint：{hint}
            </div>
          ) : null}
          <div className="mb-4" />
        </div>
      </div>
    )
  },
)
