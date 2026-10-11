import { z } from 'zod'

export const userFormSchema = z.object({
  name: z.string().trim().min(2, '姓名至少 2 个字符'),
  email: z.string().trim().email('请输入有效邮箱'),
  password: z.string().optional(),
  role: z.enum(['admin', 'user']),
  status: z.enum(['active', 'disabled']),
})

export type UserFormValues = z.infer<typeof userFormSchema>

export function createUserFormSchema(isEdit: boolean) {
  return userFormSchema.superRefine((data, ctx) => {
    if (!isEdit && (!data.password || data.password.length < 6)) {
      ctx.addIssue({
        code: 'custom',
        message: '密码至少 6 位',
        path: ['password'],
      })
    }
    if (isEdit && data.password && data.password.length < 6) {
      ctx.addIssue({
        code: 'custom',
        message: '密码至少 6 位',
        path: ['password'],
      })
    }
  })
}
