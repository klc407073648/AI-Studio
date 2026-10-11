import type {
  CommandOptionType,
  CommandParamsType,
} from '@/features/terminal/core/command'

export const searchContext: CommandParamsType = {
  key: 'word',
  desc: '搜索内容',
  required: true,
}

export const isOpenCur: CommandOptionType = {
  key: 'self',
  desc: '是否当前页面打开',
  alias: ['s'],
  type: 'boolean',
  defaultValue: false,
}

export const displaySearchItem: CommandOptionType = {
  key: 'item',
  desc: '显示搜索源',
  alias: ['i'],
  type: 'boolean',
  defaultValue: false,
}

export function openSearchLink(url: string, self?: unknown) {
  if (self) {
    window.location.href = url
  } else {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}
