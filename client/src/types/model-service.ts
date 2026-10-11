export type ModelModality = 'text' | 'image' | 'video' | 'audio'

/** 筛选 / 能力标签（含展示用 tag 键） */
export type ModelCapability =
  | 'popular'
  | 'webSearch'
  | 'persona'
  | 'chineseEnhance'
  | 'textGen'
  | 'functionCall'
  | 'json'
  | 'prefix'
  | 'fim'
  | 'longContext'
  | 'zh'
  | 'en'
  | 'text2img'
  | 'img2img'
  | 'vision'
  | 'text2video'
  | 'img2video'
  | 'asr'
  | 'tts'
  | 'music'

export type ModelService = {
  id: string
  name: string
  modality: ModelModality
  provider: string
  description: string
  /** 用于能力筛选 chips */
  capabilities: ModelCapability[]
  /** 卡片上展示的短标签文案 */
  tags: string[]
  updatedAt: string
  /** 本地映射首字/色块 */
  logoKey: string
}

export type ModelsQuery = {
  modality?: ModelModality
  capability?: ModelCapability
}
