import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, expect, it, vi } from 'vitest'
import { getModels } from '../../src/data/models'
import { TaskWorkspace } from '../../src/components/TaskWorkspace'
import type { Task } from '../../src/types'

afterEach(() => document.body.innerHTML = '')
const base: Task = { id: 'failed-task', prompt: '失败演示', mode: 'image', model: getModels('image')[0], status: 'error', progress: 100, createdAt: Date.now(), elapsedMs: 1200, used: '1:1 · 1K', error: '模拟生成失败' }

it('filters failed tasks and retries them', async () => {
  const user = userEvent.setup()
  const onRetry = vi.fn()
  render(<TaskWorkspace tasks={[base]} filter="all" onFilterChange={vi.fn()} onRetry={onRetry} onRetryAll={vi.fn()} onClear={vi.fn()} onOpenTask={vi.fn()} onDelete={vi.fn()} onCopy={vi.fn()} onDownload={vi.fn()} onDownloadAll={vi.fn()} />)
  await user.click(screen.getByText('失败', { selector: 'button' }))
  expect(screen.getByText('失败演示')).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: '重试任务' }))
  expect(onRetry).toHaveBeenCalledWith(base)
})
