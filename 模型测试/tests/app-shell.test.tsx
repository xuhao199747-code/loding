import { render, screen } from '@testing-library/react'
import { it, expect } from 'vitest'
import App from '../src/App'

it('renders the desktop workbench shell', () => {
  render(<App />)
  expect(screen.getByText('Canvas AI')).toBeInTheDocument()
  expect(screen.getByRole('tab', { name: /生图/ })).toBeInTheDocument()
  expect(screen.getByText('任务队列')).toBeInTheDocument()
})
