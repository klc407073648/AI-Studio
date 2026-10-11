import { describe, expect, it } from 'vitest'

import {
  CAPABILITY_FILTERS,
  MAX_MODEL_SELECTION,
} from '@/features/models/constants'
import type { ModelCapability, ModelService } from '@/types/model-service'

function filterByCapability(
  models: ModelService[],
  capability: ModelCapability | null,
) {
  if (!capability) return models
  return models.filter((item) => item.capabilities.includes(capability))
}

function toggleSelection(prev: string[], id: string, max = MAX_MODEL_SELECTION) {
  if (prev.includes(id)) return prev.filter((item) => item !== id)
  if (prev.length >= max) return prev
  return [...prev, id]
}

const sample: ModelService[] = [
  {
    id: 'a',
    name: 'A',
    modality: 'text',
    provider: 'x',
    description: '',
    capabilities: ['popular', 'webSearch'],
    tags: [],
    updatedAt: '',
    logoKey: 'A',
  },
  {
    id: 'b',
    name: 'B',
    modality: 'text',
    provider: 'x',
    description: '',
    capabilities: ['persona'],
    tags: [],
    updatedAt: '',
    logoKey: 'B',
  },
]

describe('model selection helpers', () => {
  it('filters by capability chip', () => {
    expect(filterByCapability(sample, 'webSearch').map((m) => m.id)).toEqual([
      'a',
    ])
    expect(filterByCapability(sample, null)).toHaveLength(2)
  })

  it('enforces max selection of 3', () => {
    let ids: string[] = []
    ids = toggleSelection(ids, '1')
    ids = toggleSelection(ids, '2')
    ids = toggleSelection(ids, '3')
    ids = toggleSelection(ids, '4')
    expect(ids).toEqual(['1', '2', '3'])
    ids = toggleSelection(ids, '2')
    expect(ids).toEqual(['1', '3'])
  })

  it('provides capability filters per modality', () => {
    expect(CAPABILITY_FILTERS.text).toContain('popular')
    expect(CAPABILITY_FILTERS.image).toContain('text2img')
    expect(CAPABILITY_FILTERS.video).toContain('text2video')
    expect(CAPABILITY_FILTERS.audio).toContain('asr')
  })
})
