import { Link } from 'react-router'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useI18n } from '@/hooks/use-i18n'
import { useAuthStore } from '@/stores/auth-store'

export function DashboardPage() {
  const user = useAuthStore((state) => state.user)
  const { t } = useI18n()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {t('dashboard.title')}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {t('dashboard.welcome', { name: user?.name ?? '' })}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.account')}</CardTitle>
            <CardDescription>{t('dashboard.accountDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              {t('dashboard.email')}：{user?.email}
            </p>
            <p>
              {t('dashboard.role')}：
              {user?.role === 'admin' ? t('role.admin') : t('role.user')}
            </p>
            <p>
              {t('dashboard.status')}：
              {user?.status === 'active'
                ? t('status.active')
                : t('status.disabled')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.quickLinks')}</CardTitle>
            <CardDescription>{t('dashboard.quickLinksDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button asChild>
              <Link to="/interfaces">{t('nav.interfaces')}</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to="/terminal">{t('nav.terminal')}</Link>
            </Button>
            {user?.role === 'admin' ? (
              <>
                <Button asChild variant="secondary">
                  <Link to="/admin/apis">{t('nav.openApi')}</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/users">{t('nav.users')}</Link>
                </Button>
              </>
            ) : null}
            <Button asChild variant="outline">
              <Link to="/settings">{t('nav.settings')}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
