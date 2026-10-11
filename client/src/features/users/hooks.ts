import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { createUser, fetchUsers, updateUser } from '@/features/users/api'
import type {
  CreateUserPayload,
  UpdateUserPayload,
  UsersQuery,
} from '@/types/user'

export const usersQueryKey = (query: UsersQuery) => ['users', query] as const

export function useUsersQuery(query: UsersQuery) {
  return useQuery({
    queryKey: usersQueryKey(query),
    queryFn: () => fetchUsers(query),
  })
}

export function useCreateUserMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateUserPayload) => createUser(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export function useUpdateUserMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserPayload }) =>
      updateUser(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
