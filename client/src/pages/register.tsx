import { RegisterForm } from '@/features/auth/components/register-form'

export function RegisterPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">注册</h1>
        <p className="text-muted-foreground text-sm">
          创建账号后将自动登录进入系统
        </p>
      </div>
      <RegisterForm />
    </div>
  )
}
