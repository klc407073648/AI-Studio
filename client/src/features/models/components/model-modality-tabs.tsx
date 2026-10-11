import {
  MODEL_MODALITIES,
  MODALITY_LABEL_KEY,
} from '@/features/models/constants'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/hooks/use-i18n'
import { cn } from '@/lib/utils'
import type { ModelModality } from '@/types/model-service'

export function ModelModalityTabs({
  value,
  onChange,
}: {
  value: ModelModality
  onChange: (next: ModelModality) => void
}) {
  const { t } = useI18n()

  return (
    <div className="bg-muted/60 inline-flex flex-wrap gap-1 rounded-full p-1">
      {MODEL_MODALITIES.map((modality) => (
        <Button
          key={modality}
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            'rounded-full px-4',
            value === modality &&
              'bg-background text-foreground shadow-sm hover:bg-background',
          )}
          onClick={() => onChange(modality)}
        >
          {t(MODALITY_LABEL_KEY[modality])}
        </Button>
      ))}
    </div>
  )
}
