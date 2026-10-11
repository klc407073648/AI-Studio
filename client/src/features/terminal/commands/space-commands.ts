import type { CommandType } from '@/features/terminal/core/command'
import { registerCommands } from '@/features/terminal/core/registry'
import { isOpenCur, openSearchLink } from '@/features/terminal/commands/shared-options'
import { useSpaceStore } from '@/features/terminal/stores/space-store'

export const mkdirCommand: CommandType = {
  func: 'mkdir',
  name: '创建空间目录',
  cmdSet: 'space',
  params: [{ key: 'dir', desc: '新目录路径', required: true }],
  options: [],
  action(options, terminal) {
    const { _ } = options
    if (_.length < 1) {
      terminal.writeTextErrorResult('参数不足')
      return
    }
    const spaceStore = useSpaceStore.getState()
    const ok = spaceStore.addItem({
      dir: spaceStore.currentDir,
      name: String(_[0]),
      type: 'dir',
    })
    if (ok) terminal.writeTextResult('创建目录成功')
    else terminal.writeTextErrorResult('创建目录失败')
  },
}

export const cdCommand: CommandType = {
  func: 'cd',
  name: '切换空间目录',
  cmdSet: 'space',
  params: [{ key: 'dir', desc: '目标目录', required: true }],
  options: [],
  action(options, terminal) {
    const { _ } = options
    if (_.length < 1) {
      terminal.writeTextErrorResult('参数不足')
      return
    }
    const spaceStore = useSpaceStore.getState()
    const ok = spaceStore.updateCurrentDir(String(_[0]))
    if (ok) terminal.writeTextResult(`已切换至目录：${spaceStore.currentDir}`)
    else terminal.writeTextErrorResult('切换目录失败')
  },
}

export const addSpaceCommand: CommandType = {
  func: 'add',
  name: '新增空间条目',
  alias: ['touch', 'new'],
  cmdSet: 'space',
  options: [
    {
      key: 'name',
      desc: '条目名称',
      alias: ['n'],
      type: 'string',
      required: true,
    },
    {
      key: 'link',
      desc: '链接',
      alias: ['l'],
      type: 'string',
      required: true,
    },
    {
      key: 'dir',
      desc: '目标目录',
      alias: ['d'],
      type: 'string',
    },
  ],
  action(options, terminal) {
    let { name, link, dir } = options
    const spaceStore = useSpaceStore.getState()
    if (!dir) dir = spaceStore.currentDir
    if (!name) {
      terminal.writeTextResult('请输入名称')
      return
    }
    if (!link) {
      terminal.writeTextResult('请输入网址')
      return
    }
    let href = String(link)
    if (!href.startsWith('http://') && !href.startsWith('https://')) {
      href = `http://${href}`
    }
    const ok = spaceStore.addItem({
      dir: String(dir),
      link: href,
      name: String(name),
      type: 'link',
    })
    if (ok) terminal.writeTextResult('添加成功')
    else terminal.writeTextErrorResult('添加失败')
  },
}

export const removeCommand: CommandType = {
  func: 'remove',
  name: '删除空间条目',
  alias: ['rm', 'delete', 'del'],
  cmdSet: 'space',
  params: [{ key: 'item', desc: '要删除的条目路径', required: true }],
  options: [
    {
      key: 'recursive',
      desc: '是否递归删除',
      alias: ['r'],
      type: 'boolean',
      defaultValue: false,
    },
    {
      key: 'force',
      desc: '是否强制删除',
      alias: ['f'],
      type: 'boolean',
      defaultValue: false,
    },
  ],
  action(options, terminal) {
    const { _, recursive = false, force } = options
    if (_.length < 1) {
      terminal.writeTextErrorResult('参数不足')
      return
    }
    if (recursive && !force) {
      terminal.writeTextErrorResult('请确认要强制删除')
      return
    }
    const ok = useSpaceStore
      .getState()
      .deleteItem(String(_[0]), Boolean(recursive))
    if (ok) terminal.writeTextResult('操作成功')
    else terminal.writeTextErrorResult('操作失败')
  },
}

export const moveCommand: CommandType = {
  func: 'move',
  name: '移动空间条目',
  alias: ['mv'],
  cmdSet: 'space',
  params: [
    { key: 'source', desc: '来源路径', required: true },
    { key: 'target', desc: '目标路径', required: true },
  ],
  options: [
    {
      key: 'recursive',
      desc: '是否递归移动',
      alias: ['r'],
      type: 'boolean',
      defaultValue: false,
    },
  ],
  action(options, terminal) {
    const { _, recursive = false } = options
    if (_.length < 2) {
      terminal.writeTextErrorResult('参数不足')
      return
    }
    const ok = useSpaceStore
      .getState()
      .moveItem(String(_[0]), String(_[1]), Boolean(recursive))
    if (ok) terminal.writeTextResult('移动成功')
    else terminal.writeTextErrorResult('移动失败')
  },
}

export const copyCommand: CommandType = {
  func: 'copy',
  name: '复制空间条目',
  alias: ['cp'],
  cmdSet: 'space',
  params: [
    { key: 'source', desc: '来源路径', required: true },
    { key: 'target', desc: '目标路径', required: true },
  ],
  options: [
    {
      key: 'recursive',
      desc: '是否递归复制',
      alias: ['r'],
      type: 'boolean',
      defaultValue: false,
    },
  ],
  action(options, terminal) {
    const { _, recursive = false } = options
    if (_.length < 2) {
      terminal.writeTextErrorResult('参数不足')
      return
    }
    const ok = useSpaceStore
      .getState()
      .copyItem(String(_[0]), String(_[1]), Boolean(recursive))
    if (ok) terminal.writeTextResult('复制成功')
    else terminal.writeTextErrorResult('复制失败')
  },
}

export const listCommand: CommandType = {
  func: 'list',
  name: '列举空间条目',
  alias: ['ls'],
  cmdSet: 'space',
  params: [{ key: 'dir', desc: '目录' }],
  options: [
    {
      key: 'recursive',
      desc: '是否递归列举',
      alias: ['r'],
      type: 'boolean',
      defaultValue: false,
    },
  ],
  collapsible: true,
  action(options, terminal) {
    const { _, recursive } = options
    const { listItems, currentDir } = useSpaceStore.getState()
    const dir = _.length > 0 ? String(_[0]) : currentDir
    const resultList = listItems(dir, Boolean(recursive))
    terminal.writeTextResult(`目录 ${dir}：`)
    if (resultList.length === 0) {
      terminal.writeTextResult('(空)')
      return
    }
    resultList.forEach((item) => {
      if (item.type === 'dir') {
        terminal.writeTextResult(`[dir] ${item.name}`, 'success')
      } else {
        terminal.writeTextResult(`${item.name} ${item.link ?? ''}`)
      }
    })
  },
}

export const pwdCommand: CommandType = {
  func: 'pwd',
  name: '显示当前空间位置',
  cmdSet: 'space',
  options: [],
  action(_options, terminal) {
    terminal.writeTextResult(`当前目录：${useSpaceStore.getState().currentDir}`)
  },
}

export const gotoCommand: CommandType = {
  func: 'goto',
  name: '网页跳转',
  alias: ['to', 'open', 'visit', 'jump'],
  cmdSet: 'space',
  params: [{ key: 'link', desc: '目标链接', required: true }],
  options: [isOpenCur],
  action(options, terminal) {
    const { _, self } = options
    if (_.length < 1) {
      terminal.writeTextErrorResult('参数不足')
      return
    }
    let link = String(_[0])
    const item = useSpaceStore.getState().getItem(link)
    if (item?.link) link = item.link
    if (!link.startsWith('http://') && !link.startsWith('https://')) {
      link = `http://${link}`
    }
    openSearchLink(link, self)
    terminal.writeTextSuccessResult(`已打开：${link}`)
  },
}

export const spaceCommands: CommandType[] = [
  mkdirCommand,
  cdCommand,
  addSpaceCommand,
  removeCommand,
  moveCommand,
  copyCommand,
  listCommand,
  pwdCommand,
  gotoCommand,
]

registerCommands(spaceCommands)
