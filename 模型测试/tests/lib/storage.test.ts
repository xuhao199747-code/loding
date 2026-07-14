import { beforeEach, expect, it } from 'vitest'
import { createDefaultPersistedState, loadState, saveState } from '../../src/lib/storage'
import { countPrompts } from '../../src/lib/format'

beforeEach(() => localStorage.clear())

it('counts only non-empty prompt lines', () => {
  expect(countPrompts('猫\n\n城市夜景\n  ')).toBe(2)
})

it('round-trips persisted settings and tasks', () => {
  const state = createDefaultPersistedState()
  saveState({ ...state, settings: { ...state.settings, runMode: 'api' } })
  expect(loadState().settings.runMode).toBe('api')
})
