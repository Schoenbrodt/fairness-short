import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import Papa from 'papaparse'

import { calculateMetrics } from './calculateMetrics.js'
import { classify, countClasses, sortByClass } from './classify.js'

const here = path.dirname(fileURLToPath(import.meta.url))
const csv = fs.readFileSync(path.join(here, '../../public/data/distribution.csv'), 'utf8')
const data = Papa.parse(csv, {
  header: true,
  dynamicTyping: true,
  skipEmptyLines: true,
}).data

const rowsOf = (group) => data.filter((row) => row.group === group)

test('classifies each application against the threshold', () => {
  assert.equal(classify(70, 'suitable', 70), 'tp')
  assert.equal(classify(70, 'unsuitable', 70), 'fp')
  assert.equal(classify(69.9, 'suitable', 70), 'fn')
  assert.equal(classify(69.9, 'unsuitable', 70), 'tn')
})

test('class counts agree with the confusion matrix', () => {
  for (const group of ['pinkville', 'greenfield']) {
    const rows = rowsOf(group)
    for (const threshold of [10, 50, 70, 100]) {
      const counts = countClasses(rows, threshold)
      const metrics = calculateMetrics(data, group, threshold)
      assert.deepEqual(counts, {
        tp: metrics.tp,
        fp: metrics.fp,
        fn: metrics.fn,
        tn: metrics.tn,
      })
    }
  }
})

test('groups figures by class: TP, FP, FN, TN', () => {
  const rows = [
    { score: 90, outcome: 'suitable', id: 'tp1' },
    { score: 30, outcome: 'suitable', id: 'fn1' },
    { score: 80, outcome: 'unsuitable', id: 'fp1' },
    { score: 20, outcome: 'unsuitable', id: 'tn1' },
    { score: 95, outcome: 'suitable', id: 'tp2' },
  ]

  assert.deepEqual(
    sortByClass(rows, 70).map((row) => row.id),
    ['tp1', 'tp2', 'fp1', 'fn1', 'tn1']
  )
  assert.deepEqual(
    rows.map((row) => row.id),
    ['tp1', 'fn1', 'fp1', 'tn1', 'tp2'],
    'must not mutate the input'
  )
})

test('keeps the input order within a class', () => {
  const rows = [
    { score: 20, outcome: 'unsuitable', id: 'tn1' },
    { score: 90, outcome: 'suitable', id: 'tp1' },
    { score: 10, outcome: 'unsuitable', id: 'tn2' },
  ]

  assert.deepEqual(
    sortByClass(rows, 70).map((row) => row.id),
    ['tp1', 'tn1', 'tn2']
  )
})
