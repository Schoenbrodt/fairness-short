import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import Papa from 'papaparse'

import { calculateMetrics, findThresholdForMetric } from './calculateMetrics.js'
import { getDisplayData, getGroupLabel, getOutcomeLabel } from './translateData.js'

const here = path.dirname(fileURLToPath(import.meta.url))
const csv = fs.readFileSync(path.join(here, '../../public/data/distribution.csv'), 'utf8')
const data = Papa.parse(csv, {
  header: true,
  dynamicTyping: true,
  skipEmptyLines: true,
}).data

function countBy(rows, key) {
  return rows.reduce((counts, row) => {
    counts[row[key]] = (counts[row[key]] ?? 0) + 1
    return counts
  }, {})
}

function pick(metrics) {
  return {
    tp: metrics.tp,
    fp: metrics.fp,
    fn: metrics.fn,
    tn: metrics.tn,
    total: metrics.total,
    accuracy: metrics.accuracy,
    positiveRate: metrics.positiveRate,
    truePositiveRate: metrics.truePositiveRate,
    netValue: metrics.netValue,
  }
}

test('dataset has 400 applications, two equal groups and 100/100 outcomes per group', () => {
  assert.equal(data.length, 400)
  assert.deepEqual(countBy(data, 'group'), { pinkville: 200, greenfield: 200 })

  for (const group of ['pinkville', 'greenfield']) {
    const rows = data.filter((row) => row.group === group)
    assert.deepEqual(countBy(rows, 'outcome'), { suitable: 100, unsuitable: 100 })
  }

  assert.ok(data.every((row) => Number.isFinite(row.score) && row.score >= 0 && row.score <= 100))
  assert.deepEqual(new Set(data.map((row) => row.outcome)), new Set(['suitable', 'unsuitable']))
})

test('calculates the confusion matrix and metrics at threshold 70', () => {
  assert.deepEqual(pick(calculateMetrics(data, 'pinkville', 70)), {
    tp: 23,
    fp: 1,
    fn: 77,
    tn: 99,
    total: 200,
    accuracy: 61,
    positiveRate: 12,
    truePositiveRate: 23,
    netValue: 6200,
  })

  assert.deepEqual(pick(calculateMetrics(data, 'greenfield', 70)), {
    tp: 9,
    fp: 0,
    fn: 91,
    tn: 100,
    total: 200,
    accuracy: 54,
    positiveRate: 4,
    truePositiveRate: 9,
    netValue: 2700,
  })
})

test('net value follows the 300/700 rule and the full dataset has 400 rows', () => {
  const metrics = calculateMetrics(data, 'pinkville', 60)
  assert.equal(metrics.netValue, 300 * metrics.tp - 700 * metrics.fp)

  const all = calculateMetrics(data, null, 70)
  assert.equal(all.total, 400)
  assert.equal(all.tp + all.fp + all.fn + all.tn, 400)
})

test('an empty group returns zeroes rather than NaN', () => {
  assert.deepEqual(calculateMetrics(data, 'unknown', 70), {
    tp: 0,
    fp: 0,
    fn: 0,
    tn: 0,
    total: 0,
    accuracy: 0,
    positiveRate: 0,
    truePositiveRate: 0,
    netValue: 0,
  })
})

test('finds the closest threshold and reports that it is approximate', () => {
  const result = findThresholdForMetric(data, 'greenfield', 'positiveRate', 35, {
    reference: 60,
  })
  assert.deepEqual(result, { threshold: 53, exact: false, metricValue: 34 })
  assert.ok(result.threshold >= 10 && result.threshold <= 100)
})

test('breaks ties by the reference threshold, then by the higher threshold', () => {
  assert.equal(
    findThresholdForMetric(data, 'greenfield', 'positiveRate', 35, { reference: 52 }).threshold,
    52
  )
  assert.equal(
    findThresholdForMetric(data, 'greenfield', 'positiveRate', 35, { reference: 60 }).threshold,
    53
  )
  assert.equal(
    findThresholdForMetric(data, 'greenfield', 'positiveRate', 35, { reference: null }).threshold,
    53
  )
})

test('marks an achievable target as exact', () => {
  const target = calculateMetrics(data, 'greenfield', 53).positiveRate
  const result = findThresholdForMetric(data, 'greenfield', 'positiveRate', target, {
    reference: 60,
  })
  assert.equal(result.exact, true)
  assert.equal(result.metricValue, target)
  assert.equal(
    calculateMetrics(data, 'greenfield', result.threshold).positiveRate,
    target
  )
})

test('respects the requested threshold range', () => {
  const result = findThresholdForMetric(data, 'greenfield', 'positiveRate', 35, {
    min: 60,
    max: 80,
    reference: 60,
  })
  assert.ok(result.threshold >= 60 && result.threshold <= 80)

  const impossible = findThresholdForMetric(data, 'greenfield', 'positiveRate', -100, {
    reference: 60,
  })
  assert.ok(impossible.threshold >= 10 && impossible.threshold <= 100)
  assert.equal(impossible.exact, false)
})

test('adds display labels without changing the canonical keys', () => {
  const display = getDisplayData(
    [{ score: 50, group: 'pinkville', outcome: 'suitable' }],
    'en'
  )
  assert.equal(display[0].group, 'pinkville')
  assert.equal(display[0].outcome, 'suitable')
  assert.equal(display[0].groupLabel, 'Pinkville')
  assert.equal(display[0].outcomeLabel, 'Suitable')

  assert.equal(getOutcomeLabel('unsuitable', 'de'), 'Nicht geeignet')
  assert.equal(getGroupLabel('greenfield', 'de'), 'Grünhausen')
})
