import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it, vi } from 'vitest'
import { SettingsDialog } from '../../src/components/SettingsDialog'

it('saves API settings', async () => {
  const user = userEvent.setup()
  const onSave = vi.fn()
  render(<SettingsDialog open settings={{ runMode: 'offline', baseUrl: 'https://api.apimart.ai', apiKey: '', autoDownload: false }} customModels={[]} onClose={vi.fn()} onSave={onSave} />)
  await user.type(screen.getByLabelText('API Key'), 'sk-demo')
  await user.click(screen.getByRole('button', { name: /保存设置/ }))
  expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ apiKey: 'sk-demo' }), [])
})
