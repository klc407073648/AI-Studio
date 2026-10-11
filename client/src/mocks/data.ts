import type { InterfaceInfo } from '@/types/interface'
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

export const seedInterfaces: InterfaceInfo[] = [
  {
    id: '1',
    name: '获取随机名称',
    description: '返回一个随机中文名，用于演示在线调用',
    method: 'GET',
    url: 'https://api.example.com/name/random',
    requestParams: '{}',
    requestHeader: '{"Content-Type":"application/json"}',
    responseHeader: '{"Content-Type":"application/json"}',
    status: 1,
    userId: '1',
    createdAt: '2026-01-10T08:00:00.000Z',
    updatedAt: '2026-01-10T08:00:00.000Z',
    totalNum: 128,
  },
  {
    id: '2',
    name: '获取用户信息',
    description: '按 userId 查询用户公开信息',
    method: 'GET',
    url: 'https://api.example.com/user/get',
    requestParams: '{"userId":"1"}',
    requestHeader: '{"Content-Type":"application/json"}',
    responseHeader: '{"Content-Type":"application/json"}',
    status: 1,
    userId: '1',
    createdAt: '2026-01-12T08:00:00.000Z',
    updatedAt: '2026-02-01T08:00:00.000Z',
    totalNum: 86,
  },
  {
    id: '3',
    name: '创建短链接',
    description: '将长 URL 转换为短链',
    method: 'POST',
    url: 'https://api.example.com/shortlink/create',
    requestParams: '{"url":"https://example.com/path"}',
    requestHeader: '{"Content-Type":"application/json"}',
    responseHeader: '{"Content-Type":"application/json"}',
    status: 1,
    userId: '1',
    createdAt: '2026-02-01T08:00:00.000Z',
    updatedAt: '2026-02-15T08:00:00.000Z',
    totalNum: 54,
  },
  {
    id: '4',
    name: '文本情感分析',
    description: '分析文本情感倾向（草稿，未发布）',
    method: 'POST',
    url: 'https://api.example.com/nlp/sentiment',
    requestParams: '{"text":"今天天气不错"}',
    requestHeader: '{"Content-Type":"application/json"}',
    responseHeader: '{"Content-Type":"application/json"}',
    status: 0,
    userId: '1',
    createdAt: '2026-03-01T08:00:00.000Z',
    updatedAt: '2026-03-01T08:00:00.000Z',
    totalNum: 3,
  },
  {
    id: '5',
    name: '天气查询',
    description: '按城市查询今日天气',
    method: 'GET',
    url: 'https://api.example.com/weather/today',
    requestParams: '{"city":"上海"}',
    requestHeader: '{"Content-Type":"application/json"}',
    responseHeader: '{"Content-Type":"application/json"}',
    status: 1,
    userId: '1',
    createdAt: '2026-03-10T08:00:00.000Z',
    updatedAt: '2026-03-12T08:00:00.000Z',
    totalNum: 201,
  },
]

export let usersDb = structuredClone(seedUsers)
export let passwordsDb = { ...seedPasswords }
export let interfacesDb = structuredClone(seedInterfaces)

export function resetMockDb() {
  usersDb = structuredClone(seedUsers)
  passwordsDb = { ...seedPasswords }
  interfacesDb = structuredClone(seedInterfaces)
}

export function nextUserId() {
  const maxId = usersDb.reduce((max, user) => Math.max(max, Number(user.id)), 0)
  return String(maxId + 1)
}

export function nextInterfaceId() {
  const maxId = interfacesDb.reduce(
    (max, item) => Math.max(max, Number(item.id)),
    0,
  )
  return String(maxId + 1)
}
