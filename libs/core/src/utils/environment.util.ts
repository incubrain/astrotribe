// src/config/config.ts
import { z } from 'zod'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables
dotenv.config({
  path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV || 'development'}`),
})

// Configuration schema
const configSchema = z.object({
  environment: z.enum(['development', 'staging', 'production']).default('development'),
  port: z.number().default(3000),
  logLevel: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  database: z.object({
    url: z.string(),
    directUrl: z.string(),
    maxConnections: z.number().default(20),
    idleTimeout: z.number().default(60000),
  }),
  metrics: z.object({
    enabled: z.boolean().default(true),
    interval: z.number().default(60000),
  }),
})

// Configuration interface
export type ApplicationConfig = z.infer<typeof configSchema>

// Load and validate configuration
function loadConfig(): ApplicationConfig {
  const config = {
    environment: process.env.NODE_ENV,
    supabase: {
      url: process.env.SUPABASE_URL,
      serviceKey: process.env.SUPABASE_SERVICE_KEY,
    },
    app: {
      name: process.env.APP_NAME,
      port: parseInt(process.env.APP_PORT || '3050', 10),
      environment: process.env.NODE_ENV,
      logLevel: process.env.LOG_LEVEL || 'info',
    },
    database: {
      url: process.env.DATABASE_URL,
      directUrl: process.env.DATABASE_DIRECT_URL,
      maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '20', 10),
      idleTimeout: parseInt(process.env.DB_IDLE_TIMEOUT || '60000', 10),
    },
    metrics: {
      enabled: process.env.METRICS_ENABLED !== 'false',
      interval: parseInt(process.env.METRICS_INTERVAL || '60000', 10),
    },
  }

  return configSchema.parse(config)
}

export const config = loadConfig()
