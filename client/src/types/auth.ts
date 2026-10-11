import type { User } from '@/types/user'

export type AuthSession = {
  accessToken: string
  user: User
}

export type LoginPayload = {
  email: string
  password: string
}

export type RegisterPayload = {
  email: string
  password: string
  name: string
}
