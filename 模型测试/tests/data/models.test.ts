import { expect, it } from 'vitest'
import { getModels } from '../../src/data/models'

it('returns image and video catalogs with capability metadata', () => {
  expect(getModels('image').some(model => model.id === 'nano-banana-2')).toBe(true)
  expect(getModels('video').some(model => model.id === 'sora-2')).toBe(true)
  expect(getModels('image').every(model => typeof model.maxReferences === 'number')).toBe(true)
})
