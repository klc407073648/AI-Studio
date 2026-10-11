import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type TerminalUser = {
  userAccount: string
  email?: string
  /** 1 = admin，0 = 普通用户 */
  userRole?: number
}

export const LOCAL_USER: TerminalUser = {
  userAccount: 'local',
  userRole: 0,
}

type AccountRecord = {
  userAccount: string
  userPassword: string
  email?: string
  userRole?: number
}

type TerminalUserState = {
  loginUser: TerminalUser
  accounts: AccountRecord[]
  setLoginUser: (user: TerminalUser) => void
  register: (
    userAccount: string,
    userPassword: string,
    checkPassword: string,
  ) => { ok: boolean; message: string }
  login: (
    userAccount: string,
    userPassword: string,
  ) => { ok: boolean; message: string }
  logout: () => void
}

export const useTerminalUserStore = create<TerminalUserState>()(
  persist(
    (set, get) => ({
      loginUser: { ...LOCAL_USER },
      accounts: [
        {
          userAccount: 'testadmin',
          userPassword: '12345678',
          email: 'testadmin@example.com',
          userRole: 1,
        },
      ],
      setLoginUser: (user) => set({ loginUser: user }),
      register: (userAccount, userPassword, checkPassword) => {
        const account = userAccount.trim()
        if (!account || !userPassword || !checkPassword) {
          return { ok: false, message: '参数不足' }
        }
        if (userPassword !== checkPassword) {
          return { ok: false, message: '两次密码不一致' }
        }
        if (get().accounts.some((item) => item.userAccount === account)) {
          return { ok: false, message: '用户已存在' }
        }
        set({
          accounts: [
            ...get().accounts,
            { userAccount: account, userPassword, userRole: 0 },
          ],
        })
        return { ok: true, message: '注册成功' }
      },
      login: (userAccount, userPassword) => {
        const found = get().accounts.find(
          (item) =>
            item.userAccount === userAccount &&
            item.userPassword === userPassword,
        )
        if (!found) return { ok: false, message: '用户名或密码错误' }
        set({
          loginUser: {
            userAccount: found.userAccount,
            email: found.email,
            userRole: found.userRole ?? 0,
          },
        })
        return { ok: true, message: '登录成功' }
      },
      logout: () => set({ loginUser: { ...LOCAL_USER } }),
    }),
    {
      name: 'terminal-user-store',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
