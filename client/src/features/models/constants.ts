import type { ModelCapability, ModelModality } from '@/types/model-service'
import type { MessageKey } from '@/i18n/types'

export const MAX_MODEL_SELECTION = 3

export const MODEL_MODALITIES: ModelModality[] = [
  'text',
  'image',
  'video',
  'audio',
]

export const MODALITY_LABEL_KEY: Record<ModelModality, MessageKey> = {
  text: 'models.modality.text',
  image: 'models.modality.image',
  video: 'models.modality.video',
  audio: 'models.modality.audio',
}

/** 各模态可用的能力筛选 chips */
export const CAPABILITY_FILTERS: Record<ModelModality, ModelCapability[]> = {
  text: ['popular', 'webSearch', 'persona', 'chineseEnhance'],
  image: ['popular', 'text2img', 'img2img', 'vision'],
  video: ['popular', 'text2video', 'img2video'],
  audio: ['popular', 'asr', 'tts', 'music'],
}

export const CAPABILITY_LABEL_KEY: Partial<Record<ModelCapability, MessageKey>> =
  {
    popular: 'models.cap.popular',
    webSearch: 'models.cap.webSearch',
    persona: 'models.cap.persona',
    chineseEnhance: 'models.cap.chineseEnhance',
    text2img: 'models.cap.text2img',
    img2img: 'models.cap.img2img',
    vision: 'models.cap.vision',
    text2video: 'models.cap.text2video',
    img2video: 'models.cap.img2video',
    asr: 'models.cap.asr',
    tts: 'models.cap.tts',
    music: 'models.cap.music',
  }

const LOGO_COLORS = [
  'bg-violet-500',
  'bg-sky-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-indigo-500',
]

export function logoColorClass(logoKey: string) {
  let hash = 0
  for (let i = 0; i < logoKey.length; i++) {
    hash = (hash + logoKey.charCodeAt(i) * (i + 1)) % LOGO_COLORS.length
  }
  return LOGO_COLORS[hash]!
}
