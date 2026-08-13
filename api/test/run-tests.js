import assert from 'node:assert/strict'
import { pickUser } from '../src/utils/formatters'
import { OBJECT_ID_RULE } from '../src/utils/validator'

const run = (name, test) => {
  test()
  console.log(`PASS ${name}`)
}

run('pickUser returns only public profile fields', () => {
  const result = pickUser({
    _id: 'user-1',
    email: 'student@example.com',
    name: 'Student',
    password: 'must-not-leak',
    verifyToken: 'must-not-leak',
  })

  assert.deepEqual(result, {
    _id: 'user-1',
    email: 'student@example.com',
    name: 'Student',
  })
})

run('pickUser handles an empty user', () => {
  assert.equal(pickUser(null), null)
})

run('OBJECT_ID_RULE accepts a MongoDB ObjectId', () => {
  assert.equal(OBJECT_ID_RULE.test('507f1f77bcf86cd799439011'), true)
})

run('OBJECT_ID_RULE rejects malformed identifiers', () => {
  assert.equal(OBJECT_ID_RULE.test('not-an-object-id'), false)
})
