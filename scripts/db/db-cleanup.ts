import pool from 'pg-pool'
import { cleanUpTestData } from '../../libs/db-testing/src/data-inserter'
import client from './client'

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
