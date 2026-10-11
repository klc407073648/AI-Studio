import type { CommandType } from '@/features/terminal/core/command'
import { BilibiliBox } from '@/features/terminal/commands/bilibili-box'
import { BlogBox } from '@/features/terminal/commands/blog-box'
import { HotBox } from '@/features/terminal/commands/hot-box'
import { MusicBox } from '@/features/terminal/commands/music-box'
import {
  isOpenCur,
  openSearchLink,
  searchContext,
} from '@/features/terminal/commands/shared-options'
import { registerCommands } from '@/features/terminal/core/registry'

function createSiteCommand(config: {
  func: string
  name: string
  alias?: string[]
  url: string
}): CommandType {
  return {
    func: config.func,
    name: config.name,
    alias: config.alias ?? [],
    desc: `打开 ${config.name}`,
    cmdSet: 'relax',
    options: [isOpenCur],
    action(options, terminal) {
      openSearchLink(config.url, options.self)
      terminal.writeTextSuccessResult(`已打开：${config.name}`)
    },
  }
}

export const bilibiliCommand: CommandType = {
  func: 'bilibili',
  name: 'bilibili 搜索',
  alias: ['bzhan', 'bili', 'blibli'],
  cmdSet: 'relax',
  params: [searchContext],
  options: [
    isOpenCur,
    {
      key: 'bvid',
      desc: 'B站视频id',
      alias: ['b'],
      type: 'string',
    },
  ],
  collapsible: true,
  action(options, terminal) {
    const { _, self, bvid } = options
    if (bvid) {
      terminal.writeResult({
        type: 'component',
        node: <BilibiliBox bvid={String(bvid)} />,
      })
      return
    }
    const word = _.length > 0 ? _.join(' ') : ''
    const targetLink = `https://search.bilibili.com/all?keyword=${encodeURIComponent(word)}`
    openSearchLink(targetLink, self)
    terminal.writeTextSuccessResult('已打开 Bilibili 搜索')
  },
}

export const musicCommand: CommandType = {
  func: 'music',
  name: '音乐',
  desc: '在线听音乐',
  cmdSet: 'relax',
  params: [{ key: 'name', desc: '音乐名称', required: true }],
  options: [],
  collapsible: true,
  action(options, terminal) {
    const { _ } = options
    if (_.length < 1) {
      terminal.writeTextErrorResult('参数不足，如：music 晴天')
      return
    }
    terminal.writeResult({
      type: 'component',
      node: <MusicBox name={String(_[0])} />,
    })
  },
}

export const hotCommand: CommandType = {
  func: 'hot',
  name: '热榜',
  desc: '音乐热榜',
  cmdSet: 'relax',
  options: [],
  collapsible: true,
  action(_options, terminal) {
    terminal.writeResult({
      type: 'component',
      node: <HotBox />,
    })
  },
}

export const blogCommand: CommandType = {
  func: 'blog',
  name: '博客',
  desc: '博客列表',
  cmdSet: 'relax',
  options: [],
  collapsible: true,
  action(_options, terminal) {
    terminal.writeResult({
      type: 'component',
      node: <BlogBox />,
    })
  },
}

export const stibelCommand = createSiteCommand({
  func: 'stibel',
  name: 'C++全栈知识体系',
  alias: ['sti'],
  url: 'https://www.stibel.icu/',
})

export const coolshellCommand = createSiteCommand({
  func: 'coolshell',
  name: '酷壳',
  alias: ['cool'],
  url: 'https://www.coolshell.cn/',
})

export const pdaiCommand = createSiteCommand({
  func: 'pdai',
  name: 'Java全栈知识体系',
  url: 'https://www.pdai.tech/',
})

export const relaxCommands: CommandType[] = [
  bilibiliCommand,
  hotCommand,
  musicCommand,
  stibelCommand,
  pdaiCommand,
  coolshellCommand,
  blogCommand,
]

registerCommands(relaxCommands)
