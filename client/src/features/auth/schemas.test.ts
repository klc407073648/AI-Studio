import { describe, expect, it } from 'vitest'

import { loginSchema, registerSchema } from '@/features/auth/schemas'

describe('auth schemas', () => {
  it('rejects invalid login email', () => {
    const result = loginSchema.safeParse({
      email: 'bad',
      password: '123456',
    })
    expect(result.success).toBe(false)
  })

  it('requires matching passwords on register', () => {
    const result = registerSchema.safeParse({
      name: '张三',
      email: 'a@example.com',
      password: '123456',
      confirmPassword: '654321',
    })
    expect(result.success).toBe(false)
  })

  it('accepts valid register payload', () => {
    const result = registerSchema.safeParse({
      name: '张三',
      email: 'a@example.com',
      password: '123456',
      confirmPassword: '123456',
    })
    expect(result.success).toBe(true)
  })
})
