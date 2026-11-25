import test from 'node:test'
import assert from 'node:assert/strict'

import { fairnessCheck, hitRateGap } from './fairnessCheck.js'

test('classifies the offer-rate ratio with the 4/5 bands', () => {
  assert.deepEqual(fairnessCheck(12, 12), { level: 'green', ratio: 1 })
  assert.deepEqual(fairnessCheck(10, 8), { level: 'green', ratio: 0.8 })
  assert.deepEqual(fairnessCheck(10, 7), { level: 'yellow', ratio: 0.7 })
  assert.deepEqual(fairnessCheck(10, 6), { level: 'yellow', ratio: 0.6 })
  assert.deepEqual(fairnessCheck(10, 5), { level: 'red', ratio: 0.5 })
})

test('handles zero offers without claiming a green ratio', () => {
  assert.deepEqual(fairnessCheck(0, 0), { level: 'none', ratio: null })
  assert.deepEqual(fairnessCheck(0, 10), { level: 'red', ratio: 0 })
})

test('reports the absolute hit-rate difference in percentage points', () => {
  assert.equal(hitRateGap(23, 9), 14)
  assert.equal(hitRateGap(4, 12), 8)
  assert.equal(hitRateGap(12, 12), 0)
})
