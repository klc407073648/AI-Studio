import { describe, expect, it } from 'vitest'

import {
  interfaceFormSchema,
  invokeInterfaceSchema,
} from '@/features/interfaces/schemas'

describe('interface schemas', () => {
  it('rejects short interface name', () => {
    const result = interfaceFormSchema.safeParse({
      name: 'a',
      method: 'GET',
      url: 'https://example.com',
    })
    expect(result.success).toBe(false)
  })

  it('accepts valid create payload', () => {
    const result = interfaceFormSchema.safeParse({
      name: '获取天气',
      description: '查询城市天气',
      method: 'GET',
      url: 'https://api.example.com/weather',
      requestParams: '{"city":"上海"}',
      requestHeader: '{}',
      responseHeader: '{}',
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid http method', () => {
    const result = interfaceFormSchema.safeParse({
      name: '测试接口',
      method: 'HEAD',
      url: 'https://example.com',
    })
    expect(result.success).toBe(false)
  })

  it('accepts invoke payload with empty params', () => {
    const result = invokeInterfaceSchema.safeParse({
      userRequestParams: '',
    })
    expect(result.success).toBe(true)
  })
})
