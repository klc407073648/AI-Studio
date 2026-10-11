import { apiRequest } from '@/lib/api-client'
import type {
  CreateUserPayload,
  PaginatedUsers,
  UpdateUserPayload,
  User,
  UsersQuery,
} from '@/types/user'

export function fetchUsers(query: UsersQuery = {}) {
  const params = new URLSearchParams()
  if (query.page) params.set('page', String(query.page))
  if (query.pageSize) params.set('pageSize', String(query.pageSize))
  if (query.q) params.set('q', query.q)
  const qs = params.toString()
  return apiRequest<PaginatedUsers>(`/users${qs ? `?${qs}` : ''}`)
}

export function createUser(payload: CreateUserPayload) {
  return apiRequest<User>('/users', {
    method: 'POST',
    body: payload,
  })
}

export function updateUser(id: string, payload: UpdateUserPayload) {
  return apiRequest<User>(`/users/${id}`, {
    method: 'PATCH',
    body: payload,
  })
}
