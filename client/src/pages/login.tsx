import { LoginForm } from '@/features/auth/components/login-form'
import { useI18n } from '@/hooks/use-i18n'

export function LoginPage() {
  const { t } = useI18n()

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">{t('auth.login')}</h1>
        <p className="text-muted-foreground text-sm">{t('auth.loginHint')}</p>
      </div>
      <LoginForm />
    </div>
  )
}
