import type { User } from '@/types/user'

export const seedUsers: User[] = [
  {
    id: '1',
    name: '系统管理员',
    email: 'admin@example.com',
    role: 'admin',
    status: 'active',
    createdAt: '2026-01-01T08:00:00.000Z',
  },
  {
    id: '2',
    name: '普通用户',
    email: 'user@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2026-01-02T08:00:00.000Z',
  },
  {
    id: '3',
    name: '张三',
    email: 'zhangsan@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2026-02-10T08:00:00.000Z',
  },
  {
    id: '4',
    name: '李四',
    email: 'lisi@example.com',
    role: 'user',
    status: 'disabled',
    createdAt: '2026-03-05T08:00:00.000Z',
  },
]

export const seedPasswords: Record<string, string> = {
  'admin@example.com': 'admin123',
  'user@example.com': 'user1234',
  'zhangsan@example.com': 'pass1234',
  'lisi@example.com': 'pass1234',
}

export let usersDb = structuredClone(seedUsers)
export let passwordsDb = { ...seedPasswords }

export function resetMockDb() {
  usersDb = structuredClone(seedUsers)
  passwordsDb = { ...seedPasswords }
}

export function nextUserId() {
  const maxId = usersDb.reduce((max, user) => Math.max(max, Number(user.id)), 0)
  return String(maxId + 1)
}
