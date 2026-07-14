import { expect, it, vi } from 'vitest'
import { getModels } from '../../src/data/models'
import { createDefaultPersistedState } from '../../src/lib/storage'
import { createApiClient, createOfflineTasks, normalizeApiError, runApiTask } from '../../src/lib/task-engine'

const draft = createDefaultPersistedState().drafts.image

it('expands prompts, models, and count into independent tasks', () => {
  const tasks = createOfflineTasks({ prompts: ['猫', '城市'], models: getModels('image').slice(0, 2), count: 2, mode: 'image', draft })
  expect(tasks).toHaveLength(8)
  expect(tasks.every(task => task.status === 'queued')).toBe(true)
})

it('normalizes API auth and balance errors', () => {
  expect(normalizeApiError(new Response('', { status: 401 })).message).toMatch(/API Key/)
  expect(normalizeApiError(new Response('', { status: 402 })).message).toMatch(/余额/)
})

it('uses APImart image endpoint for API tasks', async () => {
  const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({ task_id: 'task-1' }), { status: 200, headers: { 'Content-Type': 'application/json' } }))
  const client = createApiClient({ runMode: 'api', baseUrl: 'https://api.example.com', apiKey: 'sk-demo', autoDownload: false })
  const tasks = await client.createTask({ prompts: ['猫'], models: getModels('image').slice(0, 1), count: 1, mode: 'image', draft })
  expect(fetchMock).toHaveBeenCalledWith('https://api.example.com/v1/images/generations', expect.objectContaining({ method: 'POST' }))
  expect(tasks[0].id).toBe('task-1')
  fetchMock.mockRestore()
})

it('polls API tasks until they succeed and can be cancelled', async () => {
  vi.useFakeTimers()
  const updates: string[] = []
  const client = { createTask: vi.fn(), getTask: vi.fn()
    .mockResolvedValueOnce({ status: 'running', progress: 42 })
    .mockResolvedValueOnce({ status: 'success', progress: 100, outputUrl: 'https://cdn.example.com/result.png' }) }
  const task = createOfflineTasks({ prompts: ['猫'], models: getModels('image').slice(0, 1), count: 1, mode: 'image', draft })[0]
  const stop = runApiTask(task, client, next => updates.push(next.status), 100)
  await vi.runOnlyPendingTimersAsync()
  expect(client.getTask).toHaveBeenCalledTimes(2)
  expect(updates).toEqual(['running', 'success'])
  stop()
  vi.useRealTimers()
})
