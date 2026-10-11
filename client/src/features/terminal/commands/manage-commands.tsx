import type { CommandType } from '@/features/terminal/core/command'
import { VersionBox } from '@/features/terminal/commands/version-box'
import { registerCommands } from '@/features/terminal/core/registry'
import {
  LOCAL_USER,
  useTerminalUserStore,
} from '@/features/terminal/stores/terminal-user-store'

const loginCommand: CommandType = {
  func: 'login',
  name: '用户登录',
  options: [
    {
      key: 'userAccount',
      desc: '用户名',
      alias: ['u'],
      type: 'string',
      required: true,
    },
    {
      key: 'userPassword',
      desc: '密码',
      alias: ['p'],
      type: 'string',
      required: true,
    },
  ],
  action(options, terminal) {
    const { userAccount, userPassword } = options
    if (!userAccount) {
      terminal.writeTextErrorResult('请输入用户名')
      return
    }
    if (!userPassword) {
      terminal.writeTextErrorResult('请输入密码')
      return
    }
    const result = useTerminalUserStore
      .getState()
      .login(String(userAccount), String(userPassword))
    if (result.ok) terminal.writeTextSuccessResult(result.message)
    else terminal.writeTextErrorResult(result.message)
  },
}

const registerCommand: CommandType = {
  func: 'register',
  name: '用户注册',
  options: [
    {
      key: 'userAccount',
      desc: '用户名',
      alias: ['u'],
      type: 'string',
      required: true,
    },
    {
      key: 'userPassword',
      desc: '密码',
      alias: ['p'],
      type: 'string',
      required: true,
    },
    {
      key: 'checkPassword',
      desc: '校验密码',
      alias: ['c'],
      type: 'string',
      required: true,
    },
  ],
  action(options, terminal) {
    const { userAccount, userPassword, checkPassword } = options
    if (!userAccount) {
      terminal.writeTextErrorResult('请输入用户名')
      return
    }
    if (!userPassword) {
      terminal.writeTextErrorResult('请输入密码')
      return
    }
    if (!checkPassword) {
      terminal.writeTextErrorResult('请输入校验密码')
      return
    }
    const result = useTerminalUserStore
      .getState()
      .register(
        String(userAccount),
        String(userPassword),
        String(checkPassword),
      )
    if (result.ok) terminal.writeTextSuccessResult(result.message)
    else terminal.writeTextErrorResult(result.message)
  },
}

const logoutCommand: CommandType = {
  func: 'logout',
  name: '用户注销',
  options: [],
  action(_options, terminal) {
    useTerminalUserStore.getState().logout()
    terminal.writeTextSuccessResult('已退出登录')
  },
}

export const userCommand: CommandType = {
  func: 'user',
  name: '用户',
  desc: '终端用户登录注册',
  cmdSet: 'manage',
  params: [{ key: 'subCommand', desc: '子命令', required: true }],
  helpDetails: [
    '注册用户：user register -u testadmin -p 12345678 -c 12345678',
    '登录用户：user login -u testadmin -p 12345678',
    '注销用户：user logout',
  ],
  subCommands: {
    login: loginCommand,
    register: registerCommand,
    logout: logoutCommand,
  },
  options: [],
  action(_options, terminal) {
    const { loginUser } = useTerminalUserStore.getState()
    if (loginUser.userAccount !== LOCAL_USER.userAccount) {
      let text = `当前用户：${loginUser.userAccount}`
      if (loginUser.email) text += ` ${loginUser.email}`
      terminal.writeTextResult(text)
    } else {
      terminal.writeTextErrorResult('未登录，请执行 user login 命令登录')
    }
  },
}

export const versionCommand: CommandType = {
  func: 'version',
  name: '版本',
  desc: '查看版本',
  cmdSet: 'manage',
  options: [],
  collapsible: true,
  action(_options, terminal) {
    terminal.writeResult({
      type: 'component',
      node: <VersionBox />,
    })
  },
}

export const manageCommands: CommandType[] = [userCommand, versionCommand]

registerCommands(manageCommands)
