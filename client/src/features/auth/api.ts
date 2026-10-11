import { apiRequest } from '@/lib/api-client'
import type { AuthSession, LoginPayload, RegisterPayload } from '@/types/auth'
import type { User } from '@/types/user'

export function login(payload: LoginPayload) {
  return apiRequest<AuthSession>('/auth/login', {
    method: 'POST',
    body: payload,
    auth: false,
  })
}

export function register(payload: RegisterPayload) {
  return apiRequest<AuthSession>('/auth/register', {
    method: 'POST',
    body: payload,
    auth: false,
  })
}

export function fetchMe() {
  return apiRequest<User>('/auth/me')
}
