// apps/main-app/tests/user-permissions.spec.ts
import fs from 'fs'
import path from 'path'
import { describe } from 'vitest'
import { createTestRunner, generateTestsFromPermissions } from '@ib/db-testing'
import { useSelectData, useInsertData, useUpdateData, useDeleteData } from '#imports'

console.log('Setting up test file')

// Read and parse the permissions JSON
const permissionsJsonPath = path.resolve(__dirname, '../../../generated/role-permissions.json')
const permissionsJson = JSON.parse(fs.readFileSync(permissionsJsonPath, 'utf-8'))

const allTests = generateTestsFromPermissions(permissionsJson)

const userTests = allTests.filter((test) => test.tests.some((t) => t.role === 'user'))

// Rest of your test file stays the same
const crudOperations = {
  useSelect: useSelectData,
  useInsert: useInsertData,
  useUpdate: useUpdateData,
  useDelete: useDeleteData,
}

describe('Main App User Permissions', () => {
  const { runTests } = createTestRunner(crudOperations)
  runTests(userTests)
})
