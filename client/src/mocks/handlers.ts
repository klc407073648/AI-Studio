import { http, HttpResponse } from 'msw'

import {
  nextUserId,
  passwordsDb,
  usersDb,
} from '@/mocks/data'
import type { CreateUserPayload, UpdateUserPayload, User } from '@/types/user'

function getToken(request: Request) {
  const header = request.headers.get('Authorization')
  if (!header?.startsWith('Bearer ')) return null
  return header.slice('Bearer '.length)
}

function getUserFromToken(token: string | null): User | null {
  if (!token?.startsWith('token-')) return null
  const userId = token.replace('token-', '')
  return usersDb.find((user) => user.id === userId) ?? null
}

function requireAuth(request: Request) {
  const user = getUserFromToken(getToken(request))
  if (!user) {
    return { error: HttpResponse.json({ message: '未授权' }, { status: 401 }) }
  }
  return { user }
}

function requireAdmin(request: Request) {
  const result = requireAuth(request)
  if ('error' in result) return result
  if (result.user.role !== 'admin') {
    return { error: HttpResponse.json({ message: '无权限' }, { status: 403 }) }
  }
  return result
}

export const handlers = [
  http.post('/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as { email?: string; password?: string }
    const email = body.email?.trim().toLowerCase()
    const password = body.password ?? ''

    if (!email || !password) {
      return HttpResponse.json({ message: '请输入邮箱和密码' }, { status: 400 })
    }

    const user = usersDb.find((item) => item.email === email)
    if (!user || passwordsDb[email] !== password) {
      return HttpResponse.json({ message: '邮箱或密码错误' }, { status: 401 })
    }
    if (user.status === 'disabled') {
      return HttpResponse.json({ message: '账号已禁用' }, { status: 403 })
    }

    return HttpResponse.json({
      accessToken: `token-${user.id}`,
      user,
    })
  }),

  http.post('/api/auth/register', async ({ request }) => {
    const body = (await request.json()) as {
      email?: string
      password?: string
      name?: string
    }
    const email = body.email?.trim().toLowerCase()
    const password = body.password ?? ''
    const name = body.name?.trim() ?? ''

    if (!email || !password || !name) {
      return HttpResponse.json({ message: '请填写完整注册信息' }, { status: 400 })
    }
    if (password.length < 6) {
      return HttpResponse.json({ message: '密码至少 6 位' }, { status: 400 })
    }
    if (usersDb.some((user) => user.email === email)) {
      return HttpResponse.json({ message: '邮箱已被注册' }, { status: 409 })
    }

    const user: User = {
      id: nextUserId(),
      name,
      email,
      role: 'user',
      status: 'active',
      createdAt: new Date().toISOString(),
    }
    usersDb.push(user)
    passwordsDb[email] = password

    return HttpResponse.json({
      accessToken: `token-${user.id}`,
      user,
    })
  }),

  http.get('/api/auth/me', ({ request }) => {
    const result = requireAuth(request)
    if ('error' in result) return result.error
    return HttpResponse.json(result.user)
  }),

  http.get('/api/users', ({ request }) => {
    const result = requireAdmin(request)
    if ('error' in result) return result.error

    const url = new URL(request.url)
    const page = Math.max(1, Number(url.searchParams.get('page') ?? '1'))
    const pageSize = Math.max(1, Number(url.searchParams.get('pageSize') ?? '10'))
    const q = (url.searchParams.get('q') ?? '').trim().toLowerCase()

    const filtered = usersDb.filter((user) => {
      if (!q) return true
      return (
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q)
      )
    })

    const start = (page - 1) * pageSize
    const items = filtered.slice(start, start + pageSize)

    return HttpResponse.json({
      items,
      total: filtered.length,
      page,
      pageSize,
    })
  }),

  http.post('/api/users', async ({ request }) => {
    const result = requireAdmin(request)
    if ('error' in result) return result.error

    const body = (await request.json()) as CreateUserPayload
    const email = body.email.trim().toLowerCase()

    if (usersDb.some((user) => user.email === email)) {
      return HttpResponse.json({ message: '邮箱已存在' }, { status: 409 })
    }

    const user: User = {
      id: nextUserId(),
      name: body.name.trim(),
      email,
      role: body.role,
      status: body.status,
      createdAt: new Date().toISOString(),
    }
    usersDb.push(user)
    passwordsDb[email] = body.password

    return HttpResponse.json(user, { status: 201 })
  }),

  http.patch('/api/users/:id', async ({ params, request }) => {
    const result = requireAdmin(request)
    if ('error' in result) return result.error

    const id = String(params.id)
    const index = usersDb.findIndex((user) => user.id === id)
    if (index < 0) {
      return HttpResponse.json({ message: '用户不存在' }, { status: 404 })
    }

    const body = (await request.json()) as UpdateUserPayload
    const email = body.email.trim().toLowerCase()
    if (usersDb.some((user) => user.email === email && user.id !== id)) {
      return HttpResponse.json({ message: '邮箱已存在' }, { status: 409 })
    }

    const current = usersDb[index]
    const updated: User = {
      ...current,
      name: body.name.trim(),
      email,
      role: body.role,
      status: body.status,
    }
    usersDb[index] = updated

    if (body.password) {
      passwordsDb[email] = body.password
      if (current.email !== email) {
        delete passwordsDb[current.email]
      }
    } else if (current.email !== email) {
      passwordsDb[email] = passwordsDb[current.email]
      delete passwordsDb[current.email]
    }

    return HttpResponse.json(updated)
  }),
]
