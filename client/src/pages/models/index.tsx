import { useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { toast } from 'sonner'

import { ModelCapabilityFilters } from '@/features/models/components/model-capability-filters'
import { ModelModalityTabs } from '@/features/models/components/model-modality-tabs'
import { ModelSelectionBar } from '@/features/models/components/model-selection-bar'
import { ModelServiceCard } from '@/features/models/components/model-service-card'
import { MAX_MODEL_SELECTION } from '@/features/models/constants'
import { useModelsQuery } from '@/features/models/hooks'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useI18n } from '@/hooks/use-i18n'
import type {
  ModelCapability,
  ModelModality,
  ModelService,
} from '@/types/model-service'

function parseModality(value: string | null): ModelModality {
  if (
    value === 'text' ||
    value === 'image' ||
    value === 'video' ||
    value === 'audio'
  ) {
    return value
  }
  return 'text'
}

export function ModelsPage() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const modality = parseModality(searchParams.get('type'))
  const [capability, setCapability] = useState<ModelCapability | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const gridRef = useRef<HTMLDivElement>(null)

  const { data, isLoading, isError, refetch, isFetching } = useModelsQuery({
    modality,
  })

  const models = useMemo(() => {
    const list = data ?? []
    if (!capability) return list
    return list.filter((item) => item.capabilities.includes(capability))
  }, [capability, data])

  // 跨模态已选：拉全量列表用于底部条展示
  const { data: allForSelection } = useModelsQuery({})
  const selectedModelsFull = useMemo(() => {
    const map = new Map((allForSelection ?? []).map((item) => [item.id, item]))
    return selectedIds
      .map((id) => map.get(id))
      .filter((item): item is ModelService => Boolean(item))
  }, [allForSelection, selectedIds])

  function setModality(next: ModelModality) {
    const params = new URLSearchParams(searchParams)
    if (next === 'text') params.delete('type')
    else params.set('type', next)
    setSearchParams(params)
    setCapability(null)
  }

  function toggleModel(id: string) {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id)
      if (prev.length >= MAX_MODEL_SELECTION) {
        toast.message(t('models.maxReached', { count: String(MAX_MODEL_SELECTION) }))
        return prev
      }
      return [...prev, id]
    })
  }

  function startExperience() {
    if (selectedIds.length === 0) return
    navigate(`/models/playground?ids=${selectedIds.join(',')}`)
  }

  function showMore() {
    setCapability(null)
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 pb-4">
      <div className="space-y-4 text-center">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {t('models.titlePrefix')}
          <span className="text-primary">{t('models.titleAccent')}</span>
        </h1>
        <div className="flex justify-center">
          <ModelModalityTabs value={modality} onChange={setModality} />
        </div>
        <div className="flex justify-center">
          <ModelCapabilityFilters
            modality={modality}
            value={capability}
            onChange={setCapability}
          />
        </div>
      </div>

      {isError ? (
        <div className="text-destructive flex items-center gap-3 text-sm">
          <span>{t('common.loadFailed')}</span>
          <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
            {t('common.retry')}
          </Button>
        </div>
      ) : null}

      <div ref={gridRef} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading || (isFetching && !data) ? (
          Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-56 rounded-xl" />
          ))
        ) : models.length === 0 ? (
          <div className="text-muted-foreground col-span-full py-16 text-center text-sm">
            {t('models.empty')}
          </div>
        ) : (
          models.map((model) => {
            const selected = selectedIds.includes(model.id)
            const atLimit = selectedIds.length >= MAX_MODEL_SELECTION
            return (
              <ModelServiceCard
                key={model.id}
                model={model}
                selected={selected}
                disabled={atLimit && !selected}
                onToggle={() => toggleModel(model.id)}
              />
            )
          })
        )}
      </div>

      <ModelSelectionBar
        selectedModels={selectedModelsFull}
        onRemove={(id) =>
          setSelectedIds((prev) => prev.filter((item) => item !== id))
        }
        onStart={startExperience}
        onShowMore={showMore}
      />
    </div>
  )
}
