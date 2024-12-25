import pool from 'pg-pool'
import { cleanUpTestData } from '../../libs/db-testing/src/data-cleaner'
import client from './client'

async function runCleanup() {
  try {
    await cleanUpTestData(client)
    process.exit(0)
  } catch (error: any) {
    console.error('Cleanup failed:', error)
    process.exit(1)
  }
}

runCleanup()
