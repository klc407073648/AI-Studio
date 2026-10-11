import { apiRequest } from '@/lib/api-client'
import type {
  AuthSession,
  ChangePasswordPayload,
  LoginPayload,
  RegisterPayload,
  UpdateProfilePayload,
} from '@/types/auth'
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

export function updateProfile(payload: UpdateProfilePayload) {
  return apiRequest<User>('/auth/profile', {
    method: 'PATCH',
    body: payload,
  })
}

export function changePassword(payload: ChangePasswordPayload) {
  return apiRequest<{ ok: true }>('/auth/password', {
    method: 'PATCH',
    body: payload,
  })
}
