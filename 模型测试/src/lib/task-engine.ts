import type { Draft, ModelDefinition, Mode, RunMode, Settings, Task } from '../types'

export interface CreateTaskInput {
  prompts: string[]
  models: ModelDefinition[]
  count: number
  mode: Mode
  draft: Draft
}

export interface ApiClient {
  createTask(input: CreateTaskInput): Promise<Task[]>
  getTask(taskId: string): Promise<Pick<Task, 'status' | 'progress' | 'outputUrl' | 'error'>>
}

export type TaskUpdate = (task: Task) => void

const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`

function createPreview(prompt: string, model: ModelDefinition, mode: Mode) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="760" viewBox="0 0 1200 760"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${model.color}"/><stop offset="1" stop-color="#101a38"/></linearGradient><filter id="blur"><feGaussianBlur stdDeviation="32"/></filter></defs><rect width="1200" height="760" fill="#0b1020"/><circle cx="240" cy="220" r="220" fill="${model.color}" opacity=".32" filter="url(#blur)"/><circle cx="920" cy="500" r="300" fill="#2e7edb" opacity=".2" filter="url(#blur)"/><rect x="40" y="40" width="1120" height="680" rx="36" fill="url(#g)" opacity=".72"/><text x="80" y="575" fill="white" font-family="Arial, sans-serif" font-size="28" font-weight="700">${mode === 'image' ? 'IMAGE PREVIEW' : 'VIDEO PREVIEW'}</text><text x="80" y="625" fill="white" opacity=".78" font-family="Arial, sans-serif" font-size="20">${prompt.replace(/[&<>]/g, '')}</text><text x="80" y="665" fill="white" opacity=".5" font-family="Arial, sans-serif" font-size="16">${model.name} · Canvas AI</text></svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

export function createOfflineTasks(input: CreateTaskInput): Task[] {
  return input.prompts.flatMap(prompt => input.models.flatMap(model => Array.from({ length: input.count }, (_, index) => ({
    id: uid(),
    prompt,
    mode: input.mode,
    model,
    status: 'queued' as const,
    progress: 0,
    createdAt: Date.now() + index,
    elapsedMs: 0,
    used: `${input.draft.ratio} · ${input.draft.resolution}${input.mode === 'video' ? ` · ${input.draft.duration}s` : ''}`,
  }))))
}

export function runOfflineTask(task: Task, onUpdate: (task: Task) => void) {
  const startedAt = Date.now()
  const timer = window.setInterval(() => {
    const elapsed = Date.now() - startedAt
    if (elapsed < 450) {
      onUpdate({ ...task, status: 'queued', progress: Math.round(elapsed / 4.5), elapsedMs: elapsed })
      return
    }
    if (elapsed < 1450) {
      onUpdate({ ...task, status: 'running', progress: Math.min(92, 10 + Math.round((elapsed - 450) / 10)), elapsedMs: elapsed })
      return
    }
    window.clearInterval(timer)
    if (task.prompt.includes('失败演示')) {
      onUpdate({ ...task, status: 'error', progress: 100, elapsedMs: elapsed, error: '模拟生成失败：提示词包含失败演示' })
    } else {
      onUpdate({ ...task, status: 'success', progress: 100, elapsedMs: elapsed, outputUrl: createPreview(task.prompt, task.model, task.mode), outputKind: task.mode })
    }
  }, 180)
  return () => window.clearInterval(timer)
}

export function runApiTask(task: Task, client: ApiClient, onUpdate: TaskUpdate, intervalMs = 1200) {
  const startedAt = Date.now()
  let stopped = false
  let timer: number | undefined

  const poll = async () => {
    if (stopped) return
    try {
      const result = await client.getTask(task.id)
      const elapsedMs = Date.now() - startedAt
      const nextTask: Task = {
        ...task,
        status: result.status,
        progress: result.status === 'success' || result.status === 'error' ? 100 : Math.max(task.progress, result.progress),
        elapsedMs,
        outputUrl: result.outputUrl,
        outputKind: result.outputUrl ? task.mode : undefined,
        error: result.error,
      }
      onUpdate(nextTask)
      if (result.status === 'success' || result.status === 'error') {
        stopped = true
        return
      }
      timer = window.setTimeout(poll, intervalMs)
    } catch (error) {
      stopped = true
      onUpdate({ ...task, status: 'error', progress: 100, elapsedMs: Date.now() - startedAt, error: error instanceof Error ? error.message : '轮询任务失败' })
    }
  }

  void poll()
  return () => {
    stopped = true
    if (timer) window.clearTimeout(timer)
  }
}

export function normalizeApiError(response: Response) {
  if (response.status === 401) return new Error('API Key 无效，请检查 API 设置')
  if (response.status === 402) return new Error('账户余额不足，请前往 APImart 充值')
  return new Error(`API 请求失败（${response.status}）`)
}

async function requestJson(url: string, init: RequestInit) {
  const response = await fetch(url, init)
  if (!response.ok) throw normalizeApiError(response)
  return response.json() as Promise<Record<string, any>>
}

export function createApiClient(settings: Settings): ApiClient {
  const baseUrl = settings.baseUrl.replace(/\/+$/, '')
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${settings.apiKey}` }
  return {
    async createTask(input) {
      const endpoint = input.mode === 'image' ? '/v1/images/generations' : '/v1/videos/generations'
      const results: Task[] = []
      for (const prompt of input.prompts) {
        for (const model of input.models) {
          for (let index = 0; index < input.count; index += 1) {
            const payload = { model: model.id, prompt, size: input.draft.ratio, resolution: input.draft.resolution, duration: input.draft.duration, audio: input.draft.audio, image_urls: input.draft.references }
            const data = await requestJson(`${baseUrl}${endpoint}`, { method: 'POST', headers, body: JSON.stringify(payload) })
            results.push({ id: String(data.task_id ?? data.id ?? uid()), prompt, mode: input.mode, model, status: 'running', progress: 8, createdAt: Date.now(), elapsedMs: 0, used: `${input.draft.ratio} · ${input.draft.resolution}` })
          }
        }
      }
      return results
    },
    async getTask(taskId) {
      const data = await requestJson(`${baseUrl}/v1/tasks/${taskId}`, { headers })
      const status = String(data.status ?? 'running')
      return { status: status === 'succeeded' ? 'success' : status === 'failed' ? 'error' : 'running', progress: Number(data.progress ?? 50), outputUrl: data.result?.images?.[0]?.url ?? data.result?.videos?.[0]?.url, error: data.error?.message }
    },
  }
}

export function isApiMode(mode: RunMode) {
  return mode === 'api'
}
