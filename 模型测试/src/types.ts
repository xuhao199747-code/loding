export type Mode = 'image' | 'video'
export type RunMode = 'offline' | 'api'
export type TaskStatus = 'queued' | 'running' | 'success' | 'error'

export interface ModelDefinition {
  id: string
  name: string
  vendor: string
  mode: Mode
  badges: string[]
  supportsReference: boolean
  maxReferences: number
  color: string
}

export interface Draft {
  prompt: string
  negativePrompt: string
  references: string[]
  ratio: string
  resolution: string
  duration: number
  audio: boolean
  count: number
  selectedModelIds: string[]
}

export interface Task {
  id: string
  prompt: string
  mode: Mode
  model: ModelDefinition
  status: TaskStatus
  progress: number
  createdAt: number
  elapsedMs: number
  outputUrl?: string
  outputKind?: 'image' | 'video'
  error?: string
  used: string
}

export interface Settings {
  runMode: RunMode
  baseUrl: string
  apiKey: string
  autoDownload: boolean
}

export interface PersistedState {
  settings: Settings
  tasks: Task[]
  customModels: ModelDefinition[]
  mode: Mode
  drafts: Record<Mode, Draft>
}
