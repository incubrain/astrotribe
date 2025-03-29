import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import Pool from 'pg-pool'

const __dirname = path.resolve(fileURLToPath(import.meta.url), '..')

dotenv.config({
  path: path.resolve(__dirname, '../../.env'),
  override: true,
})

export default new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})
