import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, expect, it } from 'vitest'
import App from '../../src/App'

beforeEach(() => localStorage.clear())

it('runs the offline desktop creation path', async () => {
  const user = userEvent.setup()
  render(<App />)
  await user.type(screen.getByLabelText('提示词'), '一座漂浮在云海中的未来城市')
  await user.click(screen.getByRole('button', { name: /Nano Banana 2/ }))
  await user.click(screen.getByRole('button', { name: /开始生成/ }))
  await waitFor(() => expect(screen.getByText('已完成')).toBeInTheDocument(), { timeout: 3200 })
  await user.click(screen.getByRole('button', { name: /打开 Nano Banana 2 结果/ }))
  expect(screen.getByRole('dialog', { name: '任务详情' })).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: '作为参考图' }))
  expect(screen.getByAltText('参考素材 1')).toBeInTheDocument()
})
