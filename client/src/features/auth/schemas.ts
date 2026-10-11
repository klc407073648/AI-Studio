import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().trim().email('请输入有效邮箱'),
  password: z.string().min(6, '密码至少 6 位'),
})

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, '姓名至少 2 个字符'),
    email: z.string().trim().email('请输入有效邮箱'),
    password: z.string().min(6, '密码至少 6 位'),
    confirmPassword: z.string().min(6, '请确认密码'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '两次输入的密码不一致',
    path: ['confirmPassword'],
  })

export const profileSchema = z.object({
  name: z.string().trim().min(2, '姓名至少 2 个字符'),
  email: z.string().trim().email('请输入有效邮箱'),
})

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(6, '密码至少 6 位'),
    newPassword: z.string().min(6, '密码至少 6 位'),
    confirmPassword: z.string().min(6, '请确认密码'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: '两次输入的密码不一致',
    path: ['confirmPassword'],
  })

export type LoginFormValues = z.infer<typeof loginSchema>
export type RegisterFormValues = z.infer<typeof registerSchema>
export type ProfileFormValues = z.infer<typeof profileSchema>
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>
