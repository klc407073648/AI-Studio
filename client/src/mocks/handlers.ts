import { http, HttpResponse } from 'msw'

import {
  interfacesDb,
  modelsDb,
  nextInterfaceId,
  nextUserId,
  passwordsDb,
  usersDb,
} from '@/mocks/data'
import type {
  CreateInterfacePayload,
  HttpMethod,
  InterfaceStatus,
  InterfaceInfo,
  UpdateInterfacePayload,
} from '@/types/interface'
import type { ModelCapability, ModelModality } from '@/types/model-service'
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

  http.patch('/api/auth/profile', async ({ request }) => {
    const result = requireAuth(request)
    if ('error' in result) return result.error

    const body = (await request.json()) as { name?: string; email?: string }
    const name = body.name?.trim() ?? ''
    const email = body.email?.trim().toLowerCase() ?? ''

    if (!name || name.length < 2) {
      return HttpResponse.json({ message: '姓名至少 2 个字符' }, { status: 400 })
    }
    if (!email) {
      return HttpResponse.json({ message: '请输入有效邮箱' }, { status: 400 })
    }
    if (usersDb.some((user) => user.email === email && user.id !== result.user.id)) {
      return HttpResponse.json({ message: '邮箱已存在' }, { status: 409 })
    }

    const index = usersDb.findIndex((user) => user.id === result.user.id)
    if (index < 0) {
      return HttpResponse.json({ message: '用户不存在' }, { status: 404 })
    }

    const current = usersDb[index]
    const updated: User = {
      ...current,
      name,
      email,
    }
    usersDb[index] = updated

    if (current.email !== email) {
      passwordsDb[email] = passwordsDb[current.email]
      delete passwordsDb[current.email]
    }

    return HttpResponse.json(updated)
  }),

  http.patch('/api/auth/password', async ({ request }) => {
    const result = requireAuth(request)
    if ('error' in result) return result.error

    const body = (await request.json()) as {
      currentPassword?: string
      newPassword?: string
    }
    const currentPassword = body.currentPassword ?? ''
    const newPassword = body.newPassword ?? ''

    if (!currentPassword || !newPassword) {
      return HttpResponse.json({ message: '请填写完整密码信息' }, { status: 400 })
    }
    if (newPassword.length < 6) {
      return HttpResponse.json({ message: '密码至少 6 位' }, { status: 400 })
    }
    if (passwordsDb[result.user.email] !== currentPassword) {
      return HttpResponse.json({ message: '当前密码不正确' }, { status: 400 })
    }

    passwordsDb[result.user.email] = newPassword
    return HttpResponse.json({ ok: true })
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

  // --- Model services ---

  http.get('/api/models', ({ request }) => {
    const result = requireAuth(request)
    if ('error' in result) return result.error

    const url = new URL(request.url)
    const idsParam = url.searchParams.get('ids')
    if (idsParam) {
      const idSet = new Set(
        idsParam
          .split(',')
          .map((id) => id.trim())
          .filter(Boolean),
      )
      return HttpResponse.json(modelsDb.filter((item) => idSet.has(item.id)))
    }

    const modality = url.searchParams.get('modality') as ModelModality | null
    const capability = url.searchParams.get(
      'capability',
    ) as ModelCapability | null

    const filtered = modelsDb.filter((item) => {
      if (modality && item.modality !== modality) return false
      if (capability && !item.capabilities.includes(capability)) return false
      return true
    })

    return HttpResponse.json(filtered)
  }),

  // --- InterfaceInfo（对齐 openApi 业务能力，路径按本项目 REST 风格） ---

  http.get('/api/interfaces', ({ request }) => {
    const result = requireAuth(request)
    if ('error' in result) return result.error

    const url = new URL(request.url)
    const page = Math.max(1, Number(url.searchParams.get('page') ?? '1'))
    const pageSize = Math.max(1, Number(url.searchParams.get('pageSize') ?? '10'))
    const name = (url.searchParams.get('name') ?? '').trim().toLowerCase()
    const method = url.searchParams.get('method') as HttpMethod | null
    const statusParam = url.searchParams.get('status')
    const status =
      statusParam === null || statusParam === ''
        ? undefined
        : (Number(statusParam) as InterfaceStatus)

    const filtered = interfacesDb.filter((item) => {
      if (name && !item.name.toLowerCase().includes(name)) return false
      if (method && item.method !== method) return false
      if (status !== undefined && item.status !== status) return false
      return true
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

  http.get('/api/interfaces/:id', ({ params, request }) => {
    const result = requireAuth(request)
    if ('error' in result) return result.error

    const id = String(params.id)
    const item = interfacesDb.find((iface) => iface.id === id)
    if (!item) {
      return HttpResponse.json({ message: '接口不存在' }, { status: 404 })
    }
    return HttpResponse.json(item)
  }),

  http.post('/api/interfaces', async ({ request }) => {
    const result = requireAdmin(request)
    if ('error' in result) return result.error

    const body = (await request.json()) as CreateInterfacePayload
    const name = body.name?.trim() ?? ''
    const method = body.method
    const ifaceUrl = body.url?.trim() ?? ''

    if (!name || name.length < 2) {
      return HttpResponse.json({ message: '接口名称至少 2 个字符' }, { status: 400 })
    }
    if (!method) {
      return HttpResponse.json({ message: '请选择请求方法' }, { status: 400 })
    }
    if (!ifaceUrl) {
      return HttpResponse.json({ message: '请输入 URL' }, { status: 400 })
    }

    const now = new Date().toISOString()
    const item: InterfaceInfo = {
      id: nextInterfaceId(),
      name,
      description: body.description?.trim() ?? '',
      method,
      url: ifaceUrl,
      requestParams: body.requestParams ?? '',
      requestHeader: body.requestHeader ?? '',
      responseHeader: body.responseHeader ?? '',
      status: 0,
      userId: result.user.id,
      createdAt: now,
      updatedAt: now,
      totalNum: 0,
    }
    interfacesDb.push(item)
    return HttpResponse.json(item, { status: 201 })
  }),

  http.patch('/api/interfaces/:id', async ({ params, request }) => {
    const result = requireAdmin(request)
    if ('error' in result) return result.error

    const id = String(params.id)
    const index = interfacesDb.findIndex((item) => item.id === id)
    if (index < 0) {
      return HttpResponse.json({ message: '接口不存在' }, { status: 404 })
    }

    const body = (await request.json()) as UpdateInterfacePayload
    const name = body.name?.trim() ?? ''
    const ifaceUrl = body.url?.trim() ?? ''

    if (!name || name.length < 2) {
      return HttpResponse.json({ message: '接口名称至少 2 个字符' }, { status: 400 })
    }
    if (!body.method) {
      return HttpResponse.json({ message: '请选择请求方法' }, { status: 400 })
    }
    if (!ifaceUrl) {
      return HttpResponse.json({ message: '请输入 URL' }, { status: 400 })
    }

    const current = interfacesDb[index]
    const updated: InterfaceInfo = {
      ...current,
      name,
      description: body.description?.trim() ?? '',
      method: body.method,
      url: ifaceUrl,
      requestParams: body.requestParams ?? '',
      requestHeader: body.requestHeader ?? '',
      responseHeader: body.responseHeader ?? '',
      updatedAt: new Date().toISOString(),
    }
    interfacesDb[index] = updated
    return HttpResponse.json(updated)
  }),

  http.delete('/api/interfaces/:id', ({ params, request }) => {
    const result = requireAdmin(request)
    if ('error' in result) return result.error

    const id = String(params.id)
    const index = interfacesDb.findIndex((item) => item.id === id)
    if (index < 0) {
      return HttpResponse.json({ message: '接口不存在' }, { status: 404 })
    }

    interfacesDb.splice(index, 1)
    return new HttpResponse(null, { status: 204 })
  }),

  http.post('/api/interfaces/:id/online', ({ params, request }) => {
    const result = requireAdmin(request)
    if ('error' in result) return result.error

    const id = String(params.id)
    const index = interfacesDb.findIndex((item) => item.id === id)
    if (index < 0) {
      return HttpResponse.json({ message: '接口不存在' }, { status: 404 })
    }

    const current = interfacesDb[index]
    if (current.status === 1) {
      return HttpResponse.json({ message: '接口已是发布状态' }, { status: 400 })
    }

    const updated: InterfaceInfo = {
      ...current,
      status: 1,
      updatedAt: new Date().toISOString(),
    }
    interfacesDb[index] = updated
    return HttpResponse.json(updated)
  }),

  http.post('/api/interfaces/:id/offline', ({ params, request }) => {
    const result = requireAdmin(request)
    if ('error' in result) return result.error

    const id = String(params.id)
    const index = interfacesDb.findIndex((item) => item.id === id)
    if (index < 0) {
      return HttpResponse.json({ message: '接口不存在' }, { status: 404 })
    }

    const current = interfacesDb[index]
    if (current.status === 0) {
      return HttpResponse.json({ message: '接口已是下线状态' }, { status: 400 })
    }

    const updated: InterfaceInfo = {
      ...current,
      status: 0,
      updatedAt: new Date().toISOString(),
    }
    interfacesDb[index] = updated
    return HttpResponse.json(updated)
  }),

  http.post('/api/interfaces/:id/invoke', async ({ params, request }) => {
    const result = requireAuth(request)
    if ('error' in result) return result.error

    const id = String(params.id)
    const index = interfacesDb.findIndex((item) => item.id === id)
    if (index < 0) {
      return HttpResponse.json({ message: '接口不存在' }, { status: 404 })
    }

    const current = interfacesDb[index]
    if (current.status !== 1) {
      return HttpResponse.json({ message: '接口未发布，无法调用' }, { status: 400 })
    }

    const body = (await request.json()) as { userRequestParams?: string }
    const rawParams = body.userRequestParams?.trim() || current.requestParams || '{}'

    let parsedParams: unknown = rawParams
    try {
      parsedParams = JSON.parse(rawParams)
    } catch {
      // 保留原始字符串
    }

    const mockData = {
      interfaceId: current.id,
      name: current.name,
      method: current.method,
      url: current.url,
      requestParams: parsedParams,
      invokedBy: result.user.email,
      invokedAt: new Date().toISOString(),
      result: {
        ok: true,
        message: 'mock invoke success',
      },
    }

    interfacesDb[index] = {
      ...current,
      totalNum: (current.totalNum ?? 0) + 1,
      updatedAt: new Date().toISOString(),
    }

    return HttpResponse.json({
      statusCode: 200,
      data: mockData,
      raw: JSON.stringify(mockData, null, 2),
    })
  }),

  http.get('/api/analysis/interfaces/top', ({ request }) => {
    const result = requireAdmin(request)
    if ('error' in result) return result.error

    const url = new URL(request.url)
    const limit = Math.max(1, Math.min(50, Number(url.searchParams.get('limit') ?? '10')))

    const items = [...interfacesDb]
      .sort((a, b) => (b.totalNum ?? 0) - (a.totalNum ?? 0))
      .slice(0, limit)
      .map((item) => ({
        id: item.id,
        name: item.name,
        method: item.method,
        url: item.url,
        status: item.status,
        description: item.description,
        totalNum: item.totalNum ?? 0,
      }))

    return HttpResponse.json(items)
  }),

  // terminal mock APIs (weather / fanyi / music)
  http.post('/api/terminal/weather/now', async ({ request }) => {
    const body = (await request.json()) as { city?: string }
    const city = body.city?.trim() || '北京'
    return HttpResponse.json({
      code: 0,
      data: JSON.stringify({
        lives: [
          {
            province: '模拟省',
            city,
            weather: '晴',
            temperature: '26',
            winddirection: '东南',
            windpower: '≤3',
            humidity: '45',
            reporttime: new Date().toLocaleString(),
          },
        ],
      }),
    })
  }),

  http.post('/api/terminal/weather/future', async ({ request }) => {
    const body = (await request.json()) as { city?: string; days?: string }
    const city = body.city?.trim() || '北京'
    const days = Math.max(1, Math.min(7, Number(body.days ?? 3) || 3))
    const casts = Array.from({ length: days }, (_, index) => {
      const date = new Date()
      date.setDate(date.getDate() + index)
      return {
        date: date.toISOString().slice(0, 10),
        week: String(((date.getDay() + 6) % 7) + 1),
        dayweather: index % 2 === 0 ? '晴' : '多云',
        nightweather: '晴',
        daytemp_float: String(28 - index),
        nighttemp_float: String(18 - index),
      }
    })
    return HttpResponse.json({
      code: 0,
      data: JSON.stringify({
        forecasts: [{ province: '模拟省', city, casts }],
      }),
    })
  }),

  http.post('/api/terminal/fanyi/translate', async ({ request }) => {
    const body = (await request.json()) as {
      keywords?: string
      config?: { from?: string; to?: string }
    }
    const keywords = body.keywords?.trim() || ''
    const dst = /[\u4e00-\u9fff]/.test(keywords)
      ? `[EN] ${keywords}`
      : `[中] ${keywords}`
    return HttpResponse.json({
      code: 0,
      data: JSON.stringify({
        from: body.config?.from ?? 'auto',
        to: body.config?.to ?? 'auto',
        trans_result: [{ src: keywords, dst }],
      }),
    })
  }),

  http.post('/api/terminal/music/get', async ({ request }) => {
    const body = (await request.json()) as { keywords?: string }
    const keywords = body.keywords?.trim() || 'demo'
    return HttpResponse.json({
      code: 0,
      data: {
        id: 1824020593,
        name: keywords,
      },
    })
  }),

  http.post('/api/terminal/music/list/hot', () => {
    return HttpResponse.json({
      code: 0,
      data: [
        {
          id: 1824020593,
          al: {
            name: '模拟热歌 1',
            picUrl: 'https://p2.music.126.net/6y-UleORITEGaxINCqhQ1Q==/109951165671567156.jpg',
          },
        },
        {
          id: 1473765949,
          al: {
            name: '模拟热歌 2',
            picUrl: 'https://p2.music.126.net/6y-UleORITEGaxINCqhQ1Q==/109951165671567156.jpg',
          },
        },
        {
          id: 1397345903,
          al: {
            name: '模拟热歌 3',
            picUrl: 'https://p2.music.126.net/6y-UleORITEGaxINCqhQ1Q==/109951165671567156.jpg',
          },
        },
      ],
    })
  }),

  http.post('/api/terminal/background/get/random', async ({ request }) => {
    const body = (await request.json()) as { lx?: string }
    const lx = body.lx || 'fengjing'
    const palette: Record<string, string> = {
      meizi: 'linear-gradient(135deg, #be185d, #9d174d)',
      dongman: 'linear-gradient(135deg, #7c3aed, #4c1d95)',
      fengjing: 'linear-gradient(135deg, #0c4a6e, #111827)',
      suiji: 'linear-gradient(135deg, #0f172a, #1e293b)',
    }
    return HttpResponse.json({
      code: 0,
      data: palette[lx] ?? palette.fengjing,
    })
  }),

  http.post('/api/terminal/log/user/:id', async ({ params, request }) => {
    const body = (await request.json()) as { content?: string }
    if (!body.content?.trim()) {
      return HttpResponse.json({
        code: -1,
        message: '内容为空',
        description: '请输入日志内容',
      })
    }
    return HttpResponse.json({
      code: 0,
      data: {
        id: params.id,
        content: body.content,
        createdAt: new Date().toISOString(),
      },
    })
  }),
]

