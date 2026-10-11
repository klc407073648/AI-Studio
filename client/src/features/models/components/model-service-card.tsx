import { Check } from 'lucide-react'

import { logoColorClass } from '@/features/models/constants'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { ModelService } from '@/types/model-service'

export function ModelServiceCard({
  model,
  selected,
  disabled,
  onToggle,
}: {
  model: ModelService
  selected: boolean
  disabled?: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      disabled={disabled && !selected}
      onClick={onToggle}
      className={cn(
        'relative flex h-full w-full flex-col rounded-xl border bg-card p-4 text-left transition-colors',
        selected
          ? 'border-primary bg-primary/5 shadow-sm'
          : 'border-border hover:border-primary/40',
        disabled && !selected && 'cursor-not-allowed opacity-50',
      )}
    >
      <div
        className={cn(
          'absolute top-3 right-3 flex size-5 items-center justify-center rounded-sm border',
          selected
            ? 'border-primary bg-primary text-primary-foreground'
            : 'border-muted-foreground/30',
        )}
      >
        {selected ? <Check className="size-3.5" /> : null}
      </div>

      <div className="flex items-start gap-3 pr-8">
        <div
          className={cn(
            'flex size-10 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white',
            logoColorClass(model.logoKey),
          )}
        >
          {model.logoKey.slice(0, 2)}
        </div>
        <div className="min-w-0">
          <div className="truncate text-base font-semibold">{model.name}</div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {model.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="rounded-full px-2 py-0 text-[11px] font-normal"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <p className="text-muted-foreground mt-3 line-clamp-3 flex-1 text-sm leading-relaxed">
        {model.description}
      </p>

      <div className="text-muted-foreground mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
        <span>@{model.provider}</span>
        <span>更新于 {model.updatedAt}</span>
      </div>
    </button>
  )
}
