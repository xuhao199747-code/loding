import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, expect, it, vi } from 'vitest'
import { getModels } from '../../src/data/models'
import { PromptPanel } from '../../src/components/PromptPanel'
import { createDefaultPersistedState } from '../../src/lib/storage'

const defaults = createDefaultPersistedState().drafts.image

afterEach(() => cleanup())

it('updates prompt count and creates one line per prompt', async () => {
  const user = userEvent.setup()
  const onGenerate = vi.fn()
  const view = render(<PromptPanel mode="image" draft={{ ...defaults, selectedModelIds: [getModels('image')[0].id] }} models={getModels('image')} onDraftChange={vi.fn()} onGenerate={onGenerate} onOpenSettings={vi.fn()} />)
  fireEvent.change(screen.getByLabelText('提示词'), { target: { value: '猫\n城市' } })
  view.rerender(<PromptPanel mode="image" draft={{ ...defaults, prompt: '猫\n城市', selectedModelIds: [getModels('image')[0].id] }} models={getModels('image')} onDraftChange={vi.fn()} onGenerate={onGenerate} onOpenSettings={vi.fn()} />)
  expect(screen.getByText('2 条')).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: /开始生成/ }))
  expect(onGenerate).toHaveBeenCalledWith(expect.objectContaining({ prompts: ['猫', '城市'] }))
})

it('selects a model and adds a demo reference', async () => {
  const user = userEvent.setup()
  const onDraftChange = vi.fn()
  render(<PromptPanel mode="image" draft={defaults} models={getModels('image')} onDraftChange={onDraftChange} onGenerate={vi.fn()} onOpenSettings={vi.fn()} />)
  await user.click(screen.getAllByRole('button', { name: /Nano Banana 2/ })[0])
  expect(onDraftChange).toHaveBeenCalledWith(expect.objectContaining({ selectedModelIds: ['nano-banana-2'] }))
  await user.click(screen.getByRole('button', { name: '示例图' }))
  expect(onDraftChange).toHaveBeenCalledWith(expect.objectContaining({ references: [expect.stringContaining('data:image/svg+xml')] }))
})
