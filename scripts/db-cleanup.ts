import pool from 'pg-pool'
import { cleanUpTestData } from '../libs/db-testing/src/data-inserter'

const client = new pool({
  connectionString: process.env.DATABASE_URL,
})

async function runCleanup() {
  try {
    await cleanUpTestData(client)
    process.exit(0)
  } catch (error) {
    console.error('Cleanup failed:', error)
    process.exit(1)
  }
}

runCleanup()
