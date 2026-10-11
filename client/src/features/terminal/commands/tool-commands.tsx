import type { CommandType } from '@/features/terminal/core/command'
import {
  getCurrentWeather,
  getFutureWeather,
  translate,
} from '@/features/terminal/api/terminal-api'
import { TimingBox } from '@/features/terminal/commands/timing-box'
import { TodoBox } from '@/features/terminal/commands/todo-box'
import { WeatherBox } from '@/features/terminal/commands/weather-box'
import { registerCommands } from '@/features/terminal/core/registry'
import { useTodoStore } from '@/features/terminal/stores/todo-store'

function formatNow() {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

const addTodoCommand: CommandType = {
  func: 'add',
  name: '添加任务',
  options: [
    {
      key: 'name',
      desc: '任务名称',
      alias: ['n'],
      type: 'string',
      required: true,
    },
  ],
  action(options, terminal) {
    const name = options.name ? String(options.name) : ''
    if (!name) {
      terminal.writeTextErrorResult('请输入任务名称，如：todo add -n 写周报')
      return
    }
    const ok = useTodoStore.getState().addTask(name)
    if (ok) terminal.writeTextSuccessResult('添加任务成功')
    else terminal.writeTextErrorResult('操作失败')
  },
}

export const todoCommand: CommandType = {
  func: 'todo',
  name: '待办事项',
  desc: '记录和管理任务',
  cmdSet: 'tool',
  params: [
    {
      key: 'subCommand',
      desc: '子命令',
      required: false,
    },
  ],
  options: [],
  subCommands: {
    add: addTodoCommand,
  },
  collapsible: true,
  action(options, terminal) {
    if ((options._?.length ?? 0) < 1) {
      terminal.writeResult({ type: 'component', node: <TodoBox /> })
    }
  },
}

export const dateCommand: CommandType = {
  func: 'date',
  name: '日期',
  desc: '显示当前时间',
  cmdSet: 'tool',
  options: [],
  action(_options, terminal) {
    terminal.writeTextResult(`当前时间：${formatNow()}`)
  },
}

export const timingCommand: CommandType = {
  func: 'timing',
  name: '定时器',
  desc: '倒计时秒数',
  cmdSet: 'tool',
  options: [
    {
      key: 'seconds',
      desc: '秒数',
      alias: ['s'],
      type: 'string',
      required: true,
    },
  ],
  action(options, terminal) {
    const seconds = options.seconds
    if (!seconds) {
      terminal.writeTextErrorResult('参数不足，如：timing -s 10')
      return
    }
    terminal.writeResult({
      type: 'component',
      node: <TimingBox seconds={String(seconds)} />,
    })
  },
}

export const pingCommand: CommandType = {
  func: 'ping',
  name: 'ping',
  desc: '检测某个地址是否存活',
  cmdSet: 'tool',
  params: [
    {
      key: 'dest',
      desc: '目标地址',
      required: true,
    },
  ],
  options: [
    {
      key: 'timeout',
      desc: '请求超时时间(单位:毫秒)',
      alias: ['t'],
      type: 'string',
      defaultValue: '3000',
    },
  ],
  async action(options, terminal) {
    const { _ } = options
    const timeout = Number(options.timeout ?? 3000)
    if (_.length < 1) {
      terminal.writeTextErrorResult('参数不足，如：ping github.com')
      return
    }
    let dest = String(_[0])
    if (
      !dest.toLowerCase().startsWith('http://') &&
      !dest.toLowerCase().startsWith('https://')
    ) {
      dest = `https://${dest}`
    }
    if (dest.toLowerCase().startsWith('http://')) {
      dest = dest.replace('http://', 'https://')
    }

    const startTime = Date.now()
    try {
      const resp = await Promise.race([
        fetch(dest, { mode: 'no-cors', cache: 'reload' }),
        new Promise<never>((_, reject) => {
          window.setTimeout(() => reject(new Error('timeout')), timeout)
        }),
      ])
      if (resp.ok || resp.status === 200 || resp.type === 'opaque') {
        terminal.writeTextSuccessResult('目标地址正常')
        terminal.writeTextResult(`延迟=${Date.now() - startTime}ms`)
      } else {
        terminal.writeTextErrorResult('ping 不通！')
      }
    } catch {
      terminal.writeTextErrorResult('ping 不通！')
    }
  },
}

export const weatherCommand: CommandType = {
  func: 'weather',
  name: '天气',
  desc: '查询城市天气',
  cmdSet: 'tool',
  params: [{ key: 'city', desc: '城市名称', required: true }],
  options: [
    {
      key: 'future',
      desc: '未来天气天数',
      alias: ['f'],
      type: 'string',
    },
  ],
  collapsible: true,
  async action(options, terminal) {
    const { _, future } = options
    if (_.length < 1) {
      terminal.writeTextErrorResult('参数不足，如：weather 北京')
      return
    }
    const city = _.join(' ')
    const wantFuture = future !== undefined && future !== false && future !== ''

    if (wantFuture) {
      const days = future === true ? '3' : String(future)
      const weather = await getFutureWeather(city, days)
      if (!weather || weather.code !== 0 || !weather.data) {
        terminal.writeTextErrorResult(
          `${weather?.message ?? '查询失败'}:${weather?.description ?? ''}`,
        )
        return
      }
      const parsed = JSON.parse(weather.data) as {
        forecasts?: unknown[]
      }
      terminal.writeResult({
        type: 'component',
        node: <WeatherBox weatherInfo={(parsed.forecasts ?? []) as never} />,
      })
      return
    }

    const weather = await getCurrentWeather(city)
    if (!weather || weather.code !== 0 || !weather.data) {
      terminal.writeTextErrorResult(
        `${weather?.message ?? '查询失败'}:${weather?.description ?? ''}`,
      )
      return
    }
    const parsed = JSON.parse(weather.data) as { lives?: unknown[] }
    terminal.writeResult({
      type: 'component',
      node: <WeatherBox weatherInfo={(parsed.lives ?? []) as never} />,
    })
  },
}

export const fanyiCommand: CommandType = {
  func: 'fanyi',
  name: '翻译',
  desc: '中英互译',
  cmdSet: 'tool',
  params: [{ key: 'word', desc: '要翻译的内容', required: true }],
  options: [
    {
      key: 'from',
      desc: '源语言',
      alias: ['f'],
      type: 'string',
      defaultValue: 'auto',
    },
    {
      key: 'to',
      desc: '目标语言',
      alias: ['t'],
      type: 'string',
      defaultValue: 'auto',
    },
  ],
  async action(options, terminal) {
    const { _, from, to } = options
    if (_.length < 1) {
      terminal.writeTextErrorResult('参数不足，如：fanyi hello')
      return
    }
    const keywords = _.join(' ')
    const res = await translate(keywords, {
      from: String(from ?? 'auto'),
      to: String(to ?? 'auto'),
    })
    if (res?.code === 0 && res.data) {
      const parsed = JSON.parse(res.data) as {
        trans_result: Array<{ dst: string }>
      }
      terminal.writeTextSuccessResult(
        `翻译结果：${parsed.trans_result[0]?.dst ?? ''}`,
      )
    } else {
      terminal.writeTextErrorResult(
        `${res?.message ?? '翻译失败'}:${res?.description ?? ''}`,
      )
    }
  },
}

export const toolCommands: CommandType[] = [
  todoCommand,
  dateCommand,
  timingCommand,
  weatherCommand,
  pingCommand,
  fanyiCommand,
]

registerCommands(toolCommands)
