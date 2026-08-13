import test from 'node:test'
import assert from 'node:assert/strict'
import { evaluateMathExpression } from '../src/utils/mathCalculator.js'
import {
  LIMIT_COMMON_FILE_SIZE_BYTES,
  singleFileValidator,
} from '../src/utils/validators.js'

test('evaluateMathExpression calculates supported expressions', () => {
  assert.equal(evaluateMathExpression('50k + 15k'), 65000)
  assert.equal(evaluateMathExpression('(100 + 50) * 2'), 300)
})

test('evaluateMathExpression rejects unsafe or invalid input', () => {
  assert.equal(evaluateMathExpression('process.exit()'), null)
  assert.equal(evaluateMathExpression('100 / 0'), null)
  assert.equal(evaluateMathExpression(''), null)
})

test('singleFileValidator accepts a supported image', () => {
  const file = { name: 'receipt.png', size: 1024, type: 'image/png' }
  assert.equal(singleFileValidator(file), null)
})

test('singleFileValidator rejects oversized and unsupported files', () => {
  const oversized = {
    name: 'receipt.png',
    size: LIMIT_COMMON_FILE_SIZE_BYTES + 1,
    type: 'image/png',
  }
  const unsupported = { name: 'receipt.pdf', size: 1024, type: 'application/pdf' }

  assert.match(singleFileValidator(oversized), /10 MB/)
  assert.equal(singleFileValidator(unsupported), 'Unsupported file type.')
})
