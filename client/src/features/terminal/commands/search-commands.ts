import type { CommandType } from '@/features/terminal/core/command'
import { registerCommands } from '@/features/terminal/core/registry'
import {
  displaySearchItem,
  isOpenCur,
  openSearchLink,
  searchContext,
} from '@/features/terminal/commands/shared-options'

function createSearchCommand(config: {
  func: string
  name: string
  desc?: string
  alias?: string[]
  buildUrl: (word: string, options: Record<string, unknown>) => string
  extraOptions?: CommandType['options']
}): CommandType {
  return {
    func: config.func,
    name: config.name,
    alias: config.alias ?? [],
    desc: config.desc ?? `使用 ${config.name}`,
    cmdSet: 'search',
    params: [searchContext],
    options: [isOpenCur, ...(config.extraOptions ?? [])],
    action(options, terminal) {
      const { _, self } = options
      const word = _.length > 0 ? _.join(' ') : ''
      if (!word) {
        terminal.writeTextErrorResult('请输入搜索内容')
        return
      }
      const targetLink = config.buildUrl(encodeURIComponent(word), options)
      openSearchLink(targetLink, self)
      terminal.writeTextSuccessResult(`已打开搜索：${config.name}`)
    },
  }
}

export const baiduCommand = createSearchCommand({
  func: 'baidu',
  name: '百度搜索',
  extraOptions: [
    {
      key: 'picture',
      desc: '是否搜索图片',
      alias: ['p'],
      type: 'boolean',
      defaultValue: false,
    },
  ],
  buildUrl: (word, options) =>
    options.picture
      ? `https://image.baidu.com/search/index?tn=baiduimage&word=${word}`
      : `https://www.baidu.com/s?wd=${word}`,
})

export const bingCommand = createSearchCommand({
  func: 'bing',
  name: '必应搜索',
  buildUrl: (word) => `https://www.bing.com/search?q=${word}`,
})

export const googleCommand = createSearchCommand({
  func: 'google',
  name: 'Google 搜索',
  buildUrl: (word) => `https://www.google.com/search?q=${word}`,
})

export const githubCommand = createSearchCommand({
  func: 'github',
  name: 'GitHub 搜索',
  buildUrl: (word) => `https://github.com/search?q=${word}`,
})

export const zhihuCommand = createSearchCommand({
  func: 'zhihu',
  name: '知乎搜索',
  buildUrl: (word) => `https://www.zhihu.com/search?q=${word}`,
})

export const csdnCommand = createSearchCommand({
  func: 'csdn',
  name: 'CSDN 搜索',
  buildUrl: (word) => `https://so.csdn.net/so/search?q=${word}`,
})

export const doubanCommand = createSearchCommand({
  func: 'douban',
  name: '豆瓣搜索',
  buildUrl: (word) => `https://www.douban.com/search?q=${word}`,
})

export const baidudevCommand = createSearchCommand({
  func: 'baidudev',
  name: '百度开发者搜索',
  alias: ['dev'],
  buildUrl: (word) => `https://kaifa.baidu.com/searchPage?wd=${word}`,
})

const fromdict: Record<string, CommandType> = {
  baidu: baiduCommand,
  baidudev: baidudevCommand,
  bing: bingCommand,
  github: githubCommand,
  google: googleCommand,
  zhihu: zhihuCommand,
  douban: doubanCommand,
  csdn: csdnCommand,
}

export const searchCommand: CommandType = {
  func: 'search',
  name: '网页搜索',
  alias: ['s', 'sousuo', 'sou', 'query'],
  desc: '支持从不同平台快捷搜索内容',
  cmdSet: 'search',
  params: [searchContext],
  options: [
    {
      key: 'from',
      alias: ['f'],
      type: 'string',
      defaultValue: 'baidu',
      desc: '搜索源',
    },
    isOpenCur,
    displaySearchItem,
  ],
  action(options, terminal) {
    const { from = 'baidu', item } = options
    if (item) {
      terminal.writeTextSuccessResult(
        `搜索源: ${Object.keys(fromdict).join(', ')}`,
      )
      return
    }
    const fromObj = fromdict[String(from)]
    if (!fromObj) {
      terminal.writeTextErrorResult('找不到搜索源')
      return
    }
    return fromObj.action(options, terminal)
  },
}

export const searchCommands: CommandType[] = [
  searchCommand,
  baiduCommand,
  bingCommand,
  googleCommand,
  githubCommand,
  zhihuCommand,
  csdnCommand,
  doubanCommand,
  baidudevCommand,
]

registerCommands(searchCommands)
