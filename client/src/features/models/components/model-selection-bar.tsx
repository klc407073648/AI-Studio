import { MAX_MODEL_SELECTION } from '@/features/models/constants'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/hooks/use-i18n'
import type { ModelService } from '@/types/model-service'

export function ModelSelectionBar({
  selectedModels,
  onRemove,
  onStart,
  onShowMore,
}: {
  selectedModels: ModelService[]
  onRemove: (id: string) => void
  onStart: () => void
  onShowMore: () => void
}) {
  const { t } = useI18n()
  const remain = Math.max(0, MAX_MODEL_SELECTION - selectedModels.length)

  return (
    <div className="bg-background/95 sticky bottom-0 z-10 border-t py-4 backdrop-blur">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          <span className="text-muted-foreground shrink-0 text-sm">
            {t('models.selectedLabel')}
          </span>
          {selectedModels.length === 0 ? (
            <span className="text-muted-foreground text-sm">
              {t('models.selectedEmpty')}
            </span>
          ) : (
            selectedModels.map((model) => (
              <Badge
                key={model.id}
                variant="outline"
                className="border-primary/40 text-foreground gap-1 rounded-md px-2 py-1"
              >
                {model.name}
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground ml-0.5"
                  aria-label={`remove ${model.name}`}
                  onClick={() => onRemove(model.id)}
                >
                  ×
                </button>
              </Badge>
            ))
          )}
          <span className="text-muted-foreground text-sm">
            {t('models.remainHint', { count: String(remain) })}
          </span>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          <Button type="button" onClick={onStart} disabled={selectedModels.length === 0}>
            {t('models.start')}
          </Button>
          <Button type="button" variant="outline" onClick={onShowMore}>
            {t('models.more')}
          </Button>
        </div>
      </div>
    </div>
  )
}
