import path from 'path'
import dotenv from 'dotenv'
import Pool from 'pg-pool'

dotenv.config({
  path: path.resolve(process.cwd(), '.env'),
  override: true,
})

export default new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})
