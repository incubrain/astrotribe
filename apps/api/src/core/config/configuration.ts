// config/configuration.ts
import { registerAs } from '@nestjs/config'

export default registerAs('app', () => ({
  debug: process.env.APP_DEBUG === 'true',
  supabase: {
    anon_key: process.env.SUPABASE_ANON_KEY,
    url: process.env.SUPABASE_URL,
    jwt_secret: process.env.SUPABASE_JWT_SECRET,
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD,
    username: process.env.REDIS_USER,
  },
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
  razorpay: {
    key_id: process.env.NUXT_RAZORPAY_KEY,
    key_secret: process.env.NUXT_RAZORPAY_SECRET,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
}))
