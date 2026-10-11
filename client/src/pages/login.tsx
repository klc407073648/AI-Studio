import { LoginForm } from '@/features/auth/components/login-form'

export function LoginPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">登录</h1>
        <p className="text-muted-foreground text-sm">
          使用管理员账号 admin@example.com / admin123 体验
        </p>
      </div>
      <LoginForm />
    </div>
  )
}
