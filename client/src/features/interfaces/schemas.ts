import { z } from 'zod'

export const httpMethodSchema = z.enum([
  'GET',
  'POST',
  'PUT',
  'DELETE',
  'PATCH',
])

export const interfaceStatusSchema = z.union([z.literal(0), z.literal(1)])

export const interfaceFormSchema = z.object({
  name: z.string().trim().min(2, '接口名称至少 2 个字符'),
  description: z.string().trim(),
  method: httpMethodSchema,
  url: z.string().trim().min(1, '请输入 URL'),
  requestParams: z.string(),
  requestHeader: z.string(),
  responseHeader: z.string(),
})

export const invokeInterfaceSchema = z.object({
  userRequestParams: z.string(),
})

export type InterfaceFormValues = z.infer<typeof interfaceFormSchema>
export type InvokeInterfaceFormValues = z.infer<typeof invokeInterfaceSchema>
