// apps/website/tests/public-access.spec.ts
import fs from 'fs'
import path from 'path'
import { describe } from 'vitest'
import { createTestRunner, generateTestsFromPermissions } from '@ib/db-testing'
import { useSelectData, useInsertData, useUpdateData, useDeleteData } from '#imports'

console.log('Setting up public access test file')

// Read and parse the permissions JSON
const permissionsJsonPath = path.resolve(__dirname, '../../generated/role-permissions.json')
const permissionsJson = JSON.parse(fs.readFileSync(permissionsJsonPath, 'utf-8'))

const crudOperations = {
  useSelect: useSelectData,
  useInsert: useInsertData,
  useUpdate: useUpdateData,
  useDelete: useDeleteData,
}

// Generate tests using the test generator from db-testing
const allTests = generateTestsFromPermissions(permissionsJson)

// Filter tests for the 'guest' role
const guestTests = allTests.filter((test) => test.tests.some((t) => t.role === 'guest'))

describe('Website Public Access', () => {
  const { runTests } = createTestRunner(crudOperations)
  runTests(guestTests)
})
