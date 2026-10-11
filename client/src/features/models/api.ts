import { apiRequest } from '@/lib/api-client'
import type { ModelService, ModelsQuery } from '@/types/model-service'

function buildQuery(query: ModelsQuery = {}) {
  const params = new URLSearchParams()
  if (query.modality) params.set('modality', query.modality)
  if (query.capability) params.set('capability', query.capability)
  const qs = params.toString()
  return qs ? `?${qs}` : ''
}

export function fetchModels(query: ModelsQuery = {}) {
  return apiRequest<ModelService[]>(`/models${buildQuery(query)}`)
}

export function fetchModelsByIds(ids: string[]) {
  if (ids.length === 0) return Promise.resolve([] as ModelService[])
  const params = new URLSearchParams()
  params.set('ids', ids.join(','))
  return apiRequest<ModelService[]>(`/models?${params.toString()}`)
}
