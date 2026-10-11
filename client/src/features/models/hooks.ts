import { useQuery } from '@tanstack/react-query'

import { fetchModels, fetchModelsByIds } from '@/features/models/api'
import type { ModelsQuery } from '@/types/model-service'

export const modelsQueryKey = (query: ModelsQuery) =>
  ['models', query] as const

export const modelsByIdsQueryKey = (ids: string[]) =>
  ['models', 'byIds', [...ids].sort().join(',')] as const

export function useModelsQuery(query: ModelsQuery) {
  return useQuery({
    queryKey: modelsQueryKey(query),
    queryFn: () => fetchModels(query),
  })
}

export function useModelsByIdsQuery(ids: string[]) {
  return useQuery({
    queryKey: modelsByIdsQueryKey(ids),
    queryFn: () => fetchModelsByIds(ids),
    enabled: ids.length > 0,
  })
}
