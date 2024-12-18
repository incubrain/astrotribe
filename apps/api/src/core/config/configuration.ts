// config/configuration.ts
import { registerAs } from '@nestjs/config'
import * as path from 'path'
import { fileURLToPath } from 'url'

export default registerAs('app', () => ({
  environment: process.env.NODE_ENV || 'development',
  api_cors_origins: process.env.API_CORS_ORIGINS || '*',
  api_port: parseInt(process.env.API_PORT, 10) || 3030,
  database: {
    url: process.env.DATABASE_URL,
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
}))
