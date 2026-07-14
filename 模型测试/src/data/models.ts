import type { Mode, ModelDefinition } from '../types'

const imageModels: ModelDefinition[] = [
  { id: 'nano-banana-2', name: 'Nano Banana 2', vendor: 'Google', mode: 'image', badges: ['参考图 ×14', '最高 4K'], supportsReference: true, maxReferences: 14, color: '#8b7dff' },
  { id: 'gpt-image-2', name: 'GPT-Image 2', vendor: 'OpenAI', mode: 'image', badges: ['参考图 ×16', '官方渠道'], supportsReference: true, maxReferences: 16, color: '#77d7c0' },
  { id: 'seedream-5-pro', name: 'Seedream 5.0 Pro', vendor: '字节 · 即梦', mode: 'image', badges: ['参考图 ×10', '质量优先'], supportsReference: true, maxReferences: 10, color: '#ff9b70' },
  { id: 'qwen-image-2-pro', name: 'Qwen Image 2.0 Pro', vendor: '阿里 · 千问', mode: 'image', badges: ['支持负向词', '参考图'], supportsReference: true, maxReferences: 5, color: '#6db3ff' },
  { id: 'imagen-4', name: 'Imagen 4.0', vendor: 'Google', mode: 'image', badges: ['仅文生图', '画面稳定'], supportsReference: false, maxReferences: 0, color: '#f2c56c' },
]

const videoModels: ModelDefinition[] = [
  { id: 'sora-2', name: 'Sora 2', vendor: 'OpenAI', mode: 'video', badges: ['720p', '4–20s', '自带音效'], supportsReference: true, maxReferences: 1, color: '#77d7c0' },
  { id: 'veo-3-1', name: 'Veo 3.1 Quality', vendor: 'Google', mode: 'video', badges: ['最高 4K', '首尾帧', '自带音效'], supportsReference: true, maxReferences: 3, color: '#8b7dff' },
  { id: 'kling-v3', name: '可灵 V3', vendor: '快手 · 可灵', mode: 'video', badges: ['3–15s', '音频', '首尾帧'], supportsReference: true, maxReferences: 2, color: '#ff9b70' },
  { id: 'seedance-2', name: 'Seedance 2.0', vendor: '字节 · 即梦', mode: 'video', badges: ['4–15s', '音频', '最高 4K'], supportsReference: true, maxReferences: 2, color: '#f2c56c' },
  { id: 'wan-2-6', name: 'Wan 2.6', vendor: '阿里 · 万相', mode: 'video', badges: ['5/10/15s', '本地直传'], supportsReference: true, maxReferences: 1, color: '#6db3ff' },
  { id: 'pixverse-v6', name: 'Pixverse V6', vendor: '爱诗科技', mode: 'video', badges: ['1–15s', '多图融合'], supportsReference: true, maxReferences: 7, color: '#d991ff' },
]

export function getModels(mode: Mode, customModels: ModelDefinition[] = []) {
  return [...(mode === 'image' ? imageModels : videoModels), ...customModels.filter(model => model.mode === mode)]
}

export const allBuiltInModels = [...imageModels, ...videoModels]
