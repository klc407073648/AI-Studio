import { apiRequest } from '@/lib/api-client'
import type {
  CreateInterfacePayload,
  InterfaceAnalysisItem,
  InterfaceInfo,
  InterfacesQuery,
  InvokeInterfacePayload,
  InvokeInterfaceResult,
  PaginatedInterfaces,
  UpdateInterfacePayload,
} from '@/types/interface'

function buildQuery(query: InterfacesQuery = {}) {
  const params = new URLSearchParams()
  if (query.page) params.set('page', String(query.page))
  if (query.pageSize) params.set('pageSize', String(query.pageSize))
  if (query.name) params.set('name', query.name)
  if (query.status !== undefined) params.set('status', String(query.status))
  if (query.method) params.set('method', query.method)
  const qs = params.toString()
  return qs ? `?${qs}` : ''
}

/** 对应 openApi GET /api/interfaceInfo/list/page */
export function fetchInterfaces(query: InterfacesQuery = {}) {
  return apiRequest<PaginatedInterfaces>(`/interfaces${buildQuery(query)}`)
}

/** 对应 openApi GET /api/interfaceInfo/get */
export function fetchInterface(id: string) {
  return apiRequest<InterfaceInfo>(`/interfaces/${id}`)
}

/** 对应 openApi POST /api/interfaceInfo/add */
export function createInterface(payload: CreateInterfacePayload) {
  return apiRequest<InterfaceInfo>('/interfaces', {
    method: 'POST',
    body: payload,
  })
}

/** 对应 openApi POST /api/interfaceInfo/update */
export function updateInterface(id: string, payload: UpdateInterfacePayload) {
  return apiRequest<InterfaceInfo>(`/interfaces/${id}`, {
    method: 'PATCH',
    body: payload,
  })
}

/** 对应 openApi POST /api/interfaceInfo/delete */
export function deleteInterface(id: string) {
  return apiRequest<void>(`/interfaces/${id}`, {
    method: 'DELETE',
  })
}

/** 对应 openApi POST /api/interfaceInfo/online */
export function onlineInterface(id: string) {
  return apiRequest<InterfaceInfo>(`/interfaces/${id}/online`, {
    method: 'POST',
  })
}

/** 对应 openApi POST /api/interfaceInfo/offline */
export function offlineInterface(id: string) {
  return apiRequest<InterfaceInfo>(`/interfaces/${id}/offline`, {
    method: 'POST',
  })
}

/** 对应 openApi POST /api/interfaceInfo/invoke */
export function invokeInterface(id: string, payload: InvokeInterfacePayload) {
  return apiRequest<InvokeInterfaceResult>(`/interfaces/${id}/invoke`, {
    method: 'POST',
    body: payload,
  })
}

/** 对应 openApi GET /api/analysis/top/interface/invoke */
export function fetchTopInterfaces(limit = 10) {
  const params = new URLSearchParams({ limit: String(limit) })
  return apiRequest<InterfaceAnalysisItem[]>(
    `/analysis/interfaces/top?${params.toString()}`,
  )
}
