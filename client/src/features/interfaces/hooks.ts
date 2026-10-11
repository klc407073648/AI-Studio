import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  createInterface,
  deleteInterface,
  fetchInterface,
  fetchInterfaces,
  fetchTopInterfaces,
  invokeInterface,
  offlineInterface,
  onlineInterface,
  updateInterface,
} from '@/features/interfaces/api'
import type {
  CreateInterfacePayload,
  InterfacesQuery,
  InvokeInterfacePayload,
  UpdateInterfacePayload,
} from '@/types/interface'

export const interfacesQueryKey = (query: InterfacesQuery) =>
  ['interfaces', query] as const

export const interfaceQueryKey = (id: string) =>
  ['interfaces', 'detail', id] as const

export const topInterfacesQueryKey = (limit: number) =>
  ['analysis', 'interfaces', 'top', limit] as const

export function useInterfacesQuery(query: InterfacesQuery) {
  return useQuery({
    queryKey: interfacesQueryKey(query),
    queryFn: () => fetchInterfaces(query),
  })
}

export function useInterfaceQuery(id: string, enabled = true) {
  return useQuery({
    queryKey: interfaceQueryKey(id),
    queryFn: () => fetchInterface(id),
    enabled: Boolean(id) && enabled,
  })
}

export function useTopInterfacesQuery(limit = 10) {
  return useQuery({
    queryKey: topInterfacesQueryKey(limit),
    queryFn: () => fetchTopInterfaces(limit),
  })
}

function invalidateInterfaceLists(queryClient: ReturnType<typeof useQueryClient>) {
  return queryClient.invalidateQueries({ queryKey: ['interfaces'] })
}

export function useCreateInterfaceMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateInterfacePayload) => createInterface(payload),
    onSuccess: async () => {
      await invalidateInterfaceLists(queryClient)
      await queryClient.invalidateQueries({ queryKey: ['analysis'] })
    },
  })
}

export function useUpdateInterfaceMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateInterfacePayload
    }) => updateInterface(id, payload),
    onSuccess: async (_data, variables) => {
      await invalidateInterfaceLists(queryClient)
      await queryClient.invalidateQueries({
        queryKey: interfaceQueryKey(variables.id),
      })
    },
  })
}

export function useDeleteInterfaceMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteInterface(id),
    onSuccess: async () => {
      await invalidateInterfaceLists(queryClient)
      await queryClient.invalidateQueries({ queryKey: ['analysis'] })
    },
  })
}

export function useOnlineInterfaceMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => onlineInterface(id),
    onSuccess: async (data) => {
      await invalidateInterfaceLists(queryClient)
      await queryClient.invalidateQueries({
        queryKey: interfaceQueryKey(data.id),
      })
    },
  })
}

export function useOfflineInterfaceMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => offlineInterface(id),
    onSuccess: async (data) => {
      await invalidateInterfaceLists(queryClient)
      await queryClient.invalidateQueries({
        queryKey: interfaceQueryKey(data.id),
      })
    },
  })
}

export function useInvokeInterfaceMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: InvokeInterfacePayload
    }) => invokeInterface(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['analysis'] })
    },
  })
}
