import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from '@/stores/auth-store'

describe('auth-store', () => {
  beforeEach(() => {
    sessionStorage.clear()
    useAuthStore.getState().clearSession()
  })

  it('stores and clears session', () => {
    useAuthStore.getState().setSession({
      accessToken: 'token-1',
      user: {
        id: '1',
        name: 'Admin',
        email: 'admin@example.com',
        role: 'admin',
        status: 'active',
        createdAt: '2026-01-01T00:00:00.000Z',
      },
    })

    expect(useAuthStore.getState().accessToken).toBe('token-1')
    expect(useAuthStore.getState().user?.email).toBe('admin@example.com')

    useAuthStore.getState().clearSession()
    expect(useAuthStore.getState().accessToken).toBeNull()
    expect(useAuthStore.getState().user).toBeNull()
  })
})
