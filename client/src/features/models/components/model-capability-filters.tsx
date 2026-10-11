import {
  CAPABILITY_FILTERS,
  CAPABILITY_LABEL_KEY,
} from '@/features/models/constants'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/hooks/use-i18n'
import { cn } from '@/lib/utils'
import type { ModelCapability, ModelModality } from '@/types/model-service'

export function ModelCapabilityFilters({
  modality,
  value,
  onChange,
}: {
  modality: ModelModality
  value: ModelCapability | null
  onChange: (next: ModelCapability | null) => void
}) {
  const { t } = useI18n()
  const filters = CAPABILITY_FILTERS[modality]

  return (
    <div className="bg-muted/50 inline-flex max-w-full flex-wrap gap-1 rounded-full p-1">
      {filters.map((cap) => {
        const labelKey = CAPABILITY_LABEL_KEY[cap]
        if (!labelKey) return null
        const active = value === cap
        return (
          <Button
            key={cap}
            type="button"
            variant="ghost"
            size="sm"
            className={cn(
              'rounded-full px-3 text-xs sm:text-sm',
              active &&
                'bg-background text-foreground shadow-sm hover:bg-background',
            )}
            onClick={() => onChange(active ? null : cap)}
          >
            {t(labelKey)}
          </Button>
        )
      })}
    </div>
  )
}
