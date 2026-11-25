import test from 'node:test'
import assert from 'node:assert/strict'

import { formatPercent } from './format.js'

test('formats percentages per locale without decimals', () => {
  const de = formatPercent(62, 'de')
  assert.ok(de.includes('62'))
  assert.ok(de.includes('%'))

  const en = formatPercent(62, 'en')
  assert.ok(en.includes('62'))
  assert.ok(en.includes('%'))
})
