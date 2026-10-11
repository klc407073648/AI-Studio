/** 0=关闭/下线，1=开启/上线（对齐 openApi InterfaceInfo.status） */
export type InterfaceStatus = 0 | 1

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

export type InterfaceInfo = {
  id: string
  name: string
  description: string
  method: HttpMethod
  url: string
  requestParams: string
  requestHeader: string
  responseHeader: string
  status: InterfaceStatus
  userId: string
  createdAt: string
  updatedAt: string
  /** 累计调用次数（分析用，列表可选返回） */
  totalNum?: number
}

export type PaginatedInterfaces = {
  items: InterfaceInfo[]
  total: number
  page: number
  pageSize: number
}

export type InterfacesQuery = {
  page?: number
  pageSize?: number
  /** 按名称模糊搜索 */
  name?: string
  status?: InterfaceStatus
  method?: HttpMethod
}

export type CreateInterfacePayload = {
  name: string
  description?: string
  method: HttpMethod
  url: string
  requestParams?: string
  requestHeader?: string
  responseHeader?: string
}

export type UpdateInterfacePayload = {
  name: string
  description?: string
  method: HttpMethod
  url: string
  requestParams?: string
  requestHeader?: string
  responseHeader?: string
}

export type InvokeInterfacePayload = {
  userRequestParams?: string
}

export type InvokeInterfaceResult = {
  statusCode: number
  data: unknown
  raw: string
}

export type InterfaceAnalysisItem = Pick<
  InterfaceInfo,
  'id' | 'name' | 'method' | 'url' | 'status' | 'description'
> & {
  totalNum: number
}
