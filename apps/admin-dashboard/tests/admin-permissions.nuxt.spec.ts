// apps/admin-dashboard/tests/admin-permissions.spec.ts
import fs from 'fs'
import path from 'path'
import { describe } from 'vitest'
import { createTestRunner, generateTestsFromPermissions } from '@ib/db-testing'
import { useSelectData, useInsertData, useUpdateData, useDeleteData } from '#imports'

console.log('Setting up admin permissions test file')

// Read and parse the permissions JSON
const permissionsJsonPath = path.resolve(__dirname, '../../../generated/role-permissions.json')
const permissionsJson = JSON.parse(fs.readFileSync(permissionsJsonPath, 'utf-8'))

const crudOperations = {
  useSelect: useSelectData,
  useInsert: useInsertData,
  useUpdate: useUpdateData,
  useDelete: useDeleteData,
}

// Generate tests using the test generator from db-testing
const allTests = generateTestsFromPermissions(permissionsJson)

// Filter tests for the 'admin' role
const adminTests = allTests.filter((test) => test.tests.some((t) => t.role === 'admin'))

describe('Admin Dashboard Permissions', () => {
  const { runTests } = createTestRunner(crudOperations)
  runTests(adminTests)
})
