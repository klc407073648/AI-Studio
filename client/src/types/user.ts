export type UserRole = 'admin' | 'user'
export type UserStatus = 'active' | 'disabled'

export type User = {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  createdAt: string
}

export type PaginatedUsers = {
  items: User[]
  total: number
  page: number
  pageSize: number
}

export type UsersQuery = {
  page?: number
  pageSize?: number
  q?: string
}

export type CreateUserPayload = {
  name: string
  email: string
  password: string
  role: UserRole
  status: UserStatus
}

export type UpdateUserPayload = {
  name: string
  email: string
  role: UserRole
  status: UserStatus
  password?: string
}
