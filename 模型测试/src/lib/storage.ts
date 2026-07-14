import type { Draft, Mode, ModelDefinition, PersistedState, Settings, Task } from '../types'

const STORAGE_KEY = 'ai-batch-studio:v1'

const defaultDraft = (mode: Mode): Draft => ({
  prompt: '',
  negativePrompt: '',
  references: [],
  ratio: mode === 'image' ? '1:1' : '16:9',
  resolution: mode === 'image' ? '1K' : '720p',
  duration: mode === 'image' ? 0 : 5,
  audio: false,
  count: 1,
  selectedModelIds: [],
})

export function createDefaultPersistedState(): PersistedState {
  return {
    settings: { runMode: 'offline', baseUrl: 'https://api.apimart.ai', apiKey: '', autoDownload: false },
    tasks: [],
    customModels: [],
    mode: 'image',
    drafts: { image: defaultDraft('image'), video: defaultDraft('video') },
  }
}

export function loadState(): PersistedState {
  if (typeof window === 'undefined') return createDefaultPersistedState()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return createDefaultPersistedState()
    const parsed = JSON.parse(raw) as Partial<PersistedState>
    const defaults = createDefaultPersistedState()
    return {
      ...defaults,
      ...parsed,
      settings: { ...defaults.settings, ...parsed.settings },
      drafts: { ...defaults.drafts, ...parsed.drafts },
      tasks: parsed.tasks ?? [],
      customModels: parsed.customModels ?? [],
    }
  } catch {
    return createDefaultPersistedState()
  }
}

export function saveState(state: PersistedState) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function saveTasks(tasks: Task[]) {
  const state = loadState()
  saveState({ ...state, tasks })
}

export function saveSettings(settings: Settings) {
  const state = loadState()
  saveState({ ...state, settings })
}

export function saveCustomModels(customModels: ModelDefinition[]) {
  const state = loadState()
  saveState({ ...state, customModels })
}
