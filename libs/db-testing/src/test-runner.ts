// db-testing/src/test-runner.ts
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import fs from 'fs/promises'
import { setupServer } from 'msw/node'
import pool from 'pg-pool'
import dotenv from 'dotenv'
import { it, describe, beforeAll, afterAll, afterEach, expect } from 'vitest'
import { createRLSHandlers } from './msw-handlers'
import type { RLSTest, CrudOperations } from './types'
import { executeTest } from './test-helpers'
import { insertTestData, cleanUpTestData } from './data-inserter'

const __filename = fileURLToPath(import.meta.url)

dotenv.config({
  path: path.resolve(process.cwd(), '.env'),
  override: true,
})

const client = new pool({
  connectionString: process.env.DATABASE_URL,
})

export const createTestRunner = (crudOperations: CrudOperations) => {
  console.log('Creating test runner with operations:', Object.keys(crudOperations))
  const server = setupServer()

  beforeAll(async () => {
    console.log('Setting up MSW server and inserting initial data')
    server.listen({ onUnhandledRequest: 'error' })
    await insertTestData(client)
  })

  afterEach(() => {
    console.log('Resetting MSW handlers')
    server.resetHandlers()
  })

  afterAll(async () => {
    console.log('Closing MSW server and cleaning up test data')
    server.close()
    await cleanUpTestData(client)
  })

  const runTests = (tests: RLSTest[]) => {
    console.log(`Starting test run with ${tests.length} test configurations`)
    const runTest = executeTest(crudOperations)

    tests.forEach((testConfig) => {
      console.log(`Setting up tests for table: ${testConfig.table}`)
      describe(`${testConfig.table} RLS policies`, () => {
        testConfig.tests.forEach((test) => {
          console.log(`Setting up test: ${test.description}`)
          it(`${test.role} - ${test.description}`, async () => {
            console.log('Creating handlers for test')
            const handlers = createRLSHandlers(testConfig.policies, test.role, test.context?.userId)

            console.log('Setting up MSW handlers')
            server.use(handlers[test.operation.toLowerCase()](testConfig.table, test.setup?.data))

            try {
              console.log(`Executing test operation: ${test.operation}`)
              const result = await runTest(test.operation, testConfig.table, test)

              if (test.expectedResult === 'success') {
                expect(result.success).toBe(true)
              } else {
                throw new Error('Expected operation to fail but it succeeded')
              }
            } catch (error) {
              console.error('Test error:', error)
              if (test.expectedResult === 'success') {
                throw error
              } else {
                expect(error).toBeDefined()
              }
            }
          })
        })
      })
    })
  }

  return { runTests }
}
