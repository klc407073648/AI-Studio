import type { InterfaceInfo } from '@/types/interface'
import type { ModelService } from '@/types/model-service'
import type { User } from '@/types/user'

export const seedUsers: User[] = [
  {
    id: '1',
    name: '系统管理员',
    email: 'admin@example.com',
    role: 'admin',
    status: 'active',
    createdAt: '2026-01-01T08:00:00.000Z',
  },
  {
    id: '2',
    name: '普通用户',
    email: 'user@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2026-01-02T08:00:00.000Z',
  },
  {
    id: '3',
    name: '张三',
    email: 'zhangsan@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2026-02-10T08:00:00.000Z',
  },
  {
    id: '4',
    name: '李四',
    email: 'lisi@example.com',
    role: 'user',
    status: 'disabled',
    createdAt: '2026-03-05T08:00:00.000Z',
  },
]

export const seedPasswords: Record<string, string> = {
  'admin@example.com': 'admin123',
  'user@example.com': 'user1234',
  'zhangsan@example.com': 'pass1234',
  'lisi@example.com': 'pass1234',
}

export const seedInterfaces: InterfaceInfo[] = [
  {
    id: '1',
    name: '获取随机名称',
    description: '返回一个随机中文名，用于演示在线调用',
    method: 'GET',
    url: 'https://api.example.com/name/random',
    requestParams: '{}',
    requestHeader: '{"Content-Type":"application/json"}',
    responseHeader: '{"Content-Type":"application/json"}',
    status: 1,
    userId: '1',
    createdAt: '2026-01-10T08:00:00.000Z',
    updatedAt: '2026-01-10T08:00:00.000Z',
    totalNum: 128,
  },
  {
    id: '2',
    name: '获取用户信息',
    description: '按 userId 查询用户公开信息',
    method: 'GET',
    url: 'https://api.example.com/user/get',
    requestParams: '{"userId":"1"}',
    requestHeader: '{"Content-Type":"application/json"}',
    responseHeader: '{"Content-Type":"application/json"}',
    status: 1,
    userId: '1',
    createdAt: '2026-01-12T08:00:00.000Z',
    updatedAt: '2026-02-01T08:00:00.000Z',
    totalNum: 86,
  },
  {
    id: '3',
    name: '创建短链接',
    description: '将长 URL 转换为短链',
    method: 'POST',
    url: 'https://api.example.com/shortlink/create',
    requestParams: '{"url":"https://example.com/path"}',
    requestHeader: '{"Content-Type":"application/json"}',
    responseHeader: '{"Content-Type":"application/json"}',
    status: 1,
    userId: '1',
    createdAt: '2026-02-01T08:00:00.000Z',
    updatedAt: '2026-02-15T08:00:00.000Z',
    totalNum: 54,
  },
  {
    id: '4',
    name: '文本情感分析',
    description: '分析文本情感倾向（草稿，未发布）',
    method: 'POST',
    url: 'https://api.example.com/nlp/sentiment',
    requestParams: '{"text":"今天天气不错"}',
    requestHeader: '{"Content-Type":"application/json"}',
    responseHeader: '{"Content-Type":"application/json"}',
    status: 0,
    userId: '1',
    createdAt: '2026-03-01T08:00:00.000Z',
    updatedAt: '2026-03-01T08:00:00.000Z',
    totalNum: 3,
  },
  {
    id: '5',
    name: '天气查询',
    description: '按城市查询今日天气',
    method: 'GET',
    url: 'https://api.example.com/weather/today',
    requestParams: '{"city":"上海"}',
    requestHeader: '{"Content-Type":"application/json"}',
    responseHeader: '{"Content-Type":"application/json"}',
    status: 1,
    userId: '1',
    createdAt: '2026-03-10T08:00:00.000Z',
    updatedAt: '2026-03-12T08:00:00.000Z',
    totalNum: 201,
  },
]

export const seedModels: ModelService[] = [
  {
    id: 'text-ds-flash',
    name: 'DeepSeek-V4.1-Flash',
    modality: 'text',
    provider: '深度求索',
    description:
      '轻量极速文本模型，适合对话、摘要与日常助手场景，延迟低、性价比高。',
    capabilities: [
      'popular',
      'textGen',
      'functionCall',
      'json',
      'longContext',
      'zh',
      'en',
      'webSearch',
    ],
    tags: ['文本生成', 'Function Call', 'JSON', '>128k', '中文', '英文'],
    updatedAt: '2026-03-25 15:41:23',
    logoKey: 'DS',
  },
  {
    id: 'text-ds-pro',
    name: 'DeepSeek-V4-Pro',
    modality: 'text',
    provider: '深度求索',
    description:
      '旗舰推理模型，强化复杂推理、代码与长文档理解，适合高质量生成任务。',
    capabilities: [
      'popular',
      'textGen',
      'functionCall',
      'json',
      'prefix',
      'fim',
      'longContext',
      'zh',
      'en',
      'persona',
    ],
    tags: ['文本生成', 'Function Call', 'Prefix', 'FIM', '>128k', '中文', '英文'],
    updatedAt: '2026-03-25 15:41:23',
    logoKey: 'DS',
  },
  {
    id: 'text-ernie',
    name: 'ERNIE-5.1',
    modality: 'text',
    provider: '百度',
    description:
      '中文增强大模型，擅长中文创作、知识问答与企业助手，支持人设与千帆能力。',
    capabilities: [
      'popular',
      'textGen',
      'functionCall',
      'json',
      'zh',
      'en',
      'persona',
      'chineseEnhance',
      'webSearch',
    ],
    tags: ['文本生成', 'Function Call', 'JSON', '中文', '英文'],
    updatedAt: '2026-03-25 15:41:23',
    logoKey: 'ER',
  },
  {
    id: 'text-qwen',
    name: 'Qwen3-Max',
    modality: 'text',
    provider: '通义',
    description: '通用多语言文本模型，兼顾工具调用与长上下文，适合业务编排。',
    capabilities: [
      'textGen',
      'functionCall',
      'json',
      'longContext',
      'zh',
      'en',
      'webSearch',
    ],
    tags: ['文本生成', 'Function Call', 'JSON', '>128k', '中文', '英文'],
    updatedAt: '2026-03-20 10:12:00',
    logoKey: 'QW',
  },
  {
    id: 'img-sdxl',
    name: 'Image-Studio XL',
    modality: 'image',
    provider: 'AI Studio',
    description: '高清文生图模型，支持风格控制与批量出图，适合设计草稿。',
    capabilities: ['popular', 'text2img', 'zh', 'en'],
    tags: ['文生图', '高清', '中文', '英文'],
    updatedAt: '2026-03-18 09:00:00',
    logoKey: 'IX',
  },
  {
    id: 'img-edit',
    name: 'Image-Edit Pro',
    modality: 'image',
    provider: 'AI Studio',
    description: '图生图与局部重绘，适合产品图修图与风格迁移。',
    capabilities: ['img2img', 'vision', 'zh'],
    tags: ['图生图', '局部重绘', '中文'],
    updatedAt: '2026-03-15 14:22:00',
    logoKey: 'IE',
  },
  {
    id: 'img-vision',
    name: 'Vision-Understand',
    modality: 'image',
    provider: '通义',
    description: '图像理解与描述，可结合文本指令做多模态问答。',
    capabilities: ['popular', 'vision', 'zh', 'en'],
    tags: ['图像理解', '多模态', '中文', '英文'],
    updatedAt: '2026-03-12 11:30:00',
    logoKey: 'VU',
  },
  {
    id: 'vid-gen',
    name: 'Video-Gen 2.0',
    modality: 'video',
    provider: 'AI Studio',
    description: '文生短视频，支持镜头脚本与基础运镜控制。',
    capabilities: ['popular', 'text2video', 'zh', 'en'],
    tags: ['文生视频', '短视频', '中文', '英文'],
    updatedAt: '2026-03-10 16:00:00',
    logoKey: 'VG',
  },
  {
    id: 'vid-img2vid',
    name: 'Image-to-Video',
    modality: 'video',
    provider: '深度求索',
    description: '静态图驱动生成短视频，适合产品动效演示。',
    capabilities: ['img2video', 'zh'],
    tags: ['图生视频', '动效', '中文'],
    updatedAt: '2026-03-08 08:45:00',
    logoKey: 'IV',
  },
  {
    id: 'vid-story',
    name: 'Storyboard Video',
    modality: 'video',
    provider: '百度',
    description: '分镜式视频生成，强调叙事连贯与角色一致性。',
    capabilities: ['popular', 'text2video', 'zh'],
    tags: ['文生视频', '分镜', '中文'],
    updatedAt: '2026-03-05 19:20:00',
    logoKey: 'SV',
  },
  {
    id: 'aud-asr',
    name: 'Speech-ASR Ultra',
    modality: 'audio',
    provider: 'AI Studio',
    description: '高准确率语音转写，支持中英混合与标点恢复。',
    capabilities: ['popular', 'asr', 'zh', 'en'],
    tags: ['语音识别', '中英混合', '标点'],
    updatedAt: '2026-03-22 12:00:00',
    logoKey: 'ASR',
  },
  {
    id: 'aud-tts',
    name: 'Speech-TTS Natural',
    modality: 'audio',
    provider: '百度',
    description: '自然语音合成，多音色与情感风格可选。',
    capabilities: ['popular', 'tts', 'zh', 'en'],
    tags: ['语音合成', '多音色', '中文', '英文'],
    updatedAt: '2026-03-19 10:10:00',
    logoKey: 'TTS',
  },
  {
    id: 'aud-music',
    name: 'Music-Compose Lite',
    modality: 'audio',
    provider: '通义',
    description: '文本驱动短音乐生成，适合片头与氛围音轨。',
    capabilities: ['music', 'zh', 'en'],
    tags: ['音乐生成', '短曲', '中文', '英文'],
    updatedAt: '2026-03-11 17:55:00',
    logoKey: 'MC',
  },
]

export let usersDb = structuredClone(seedUsers)
export let passwordsDb = { ...seedPasswords }
export let interfacesDb = structuredClone(seedInterfaces)
export let modelsDb = structuredClone(seedModels)

export function resetMockDb() {
  usersDb = structuredClone(seedUsers)
  passwordsDb = { ...seedPasswords }
  interfacesDb = structuredClone(seedInterfaces)
  modelsDb = structuredClone(seedModels)
}

export function nextUserId() {
  const maxId = usersDb.reduce((max, user) => Math.max(max, Number(user.id)), 0)
  return String(maxId + 1)
}

export function nextInterfaceId() {
  const maxId = interfacesDb.reduce(
    (max, item) => Math.max(max, Number(item.id)),
    0,
  )
  return String(maxId + 1)
}
