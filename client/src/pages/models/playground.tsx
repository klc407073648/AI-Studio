import { Link, useSearchParams } from 'react-router'
import { ArrowLeft } from 'lucide-react'

import { logoColorClass } from '@/features/models/constants'
import { useModelsByIdsQuery } from '@/features/models/hooks'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useI18n } from '@/hooks/use-i18n'
import { cn } from '@/lib/utils'

export function ModelPlaygroundPage() {
  const { t } = useI18n()
  const [searchParams] = useSearchParams()
  const ids = (searchParams.get('ids') ?? '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean)

  const { data, isLoading, isError, refetch } = useModelsByIdsQuery(ids)

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {t('models.playgroundTitle')}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {t('models.playgroundSubtitle')}
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link to="/models">
            <ArrowLeft className="size-4" />
            {t('models.backToSelect')}
          </Link>
        </Button>
      </div>

      {ids.length === 0 ? (
        <div className="text-muted-foreground rounded-xl border border-dashed p-10 text-center text-sm">
          {t('models.playgroundNoIds')}
        </div>
      ) : isError ? (
        <div className="text-destructive flex items-center gap-3 text-sm">
          <span>{t('common.loadFailed')}</span>
          <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
            {t('common.retry')}
          </Button>
        </div>
      ) : isLoading ? (
        <Skeleton className="h-24 rounded-xl" />
      ) : (
        <div className="flex flex-wrap gap-2">
          {(data ?? []).map((model) => (
            <Badge
              key={model.id}
              variant="secondary"
              className="gap-2 rounded-lg px-3 py-1.5 text-sm font-normal"
            >
              <span
                className={cn(
                  'flex size-5 items-center justify-center rounded text-[10px] font-bold text-white',
                  logoColorClass(model.logoKey),
                )}
              >
                {model.logoKey.slice(0, 2)}
              </span>
              {model.name}
            </Badge>
          ))}
        </div>
      )}

      <div className="bg-muted/40 flex min-h-[320px] flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center">
        <p className="text-muted-foreground text-sm">{t('models.playgroundPlaceholder')}</p>
      </div>
    </div>
  )
}
