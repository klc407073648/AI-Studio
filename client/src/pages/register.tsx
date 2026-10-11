import { RegisterForm } from '@/features/auth/components/register-form'
import { useI18n } from '@/hooks/use-i18n'

export function RegisterPage() {
  const { t } = useI18n()

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">{t('auth.register')}</h1>
        <p className="text-muted-foreground text-sm">{t('auth.registerHint')}</p>
      </div>
      <RegisterForm />
    </div>
  )
}
