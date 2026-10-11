import { Link } from 'react-router'

import { Button } from '@/components/ui/button'
import { useI18n } from '@/hooks/use-i18n'

export function ForbiddenPage() {
  const { t } = useI18n()

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-2xl font-semibold">{t('forbidden.title')}</h1>
      <p className="text-muted-foreground text-sm">{t('forbidden.desc')}</p>
      <Button asChild>
        <Link to="/">{t('forbidden.back')}</Link>
      </Button>
    </div>
  )
}
