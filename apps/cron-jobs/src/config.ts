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
  supabase: z.object({
    url: z.string(),
    serviceKey: z.string(),
  }),
  environment: z.enum(['development', 'staging', 'production']).default('development'),
  app: z.object({
    name: z.string().default('cron-jobs'),
    port: z.number().default(3000),
    environment: z.enum(['development', 'test', 'production']).default('development'),
    logLevel: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  }),
  database: z.object({
    url: z.string(),
    maxConnections: z.number().default(20),
    idleTimeout: z.number().default(60000),
  }),
  queue: z.object({
    retryLimit: z.number().default(3),
    retryDelay: z.number().default(60000),
    monitorInterval: z.number().default(30000),
  }),
  jobs: z.object({
    maxConcurrent: z.number().default(5),
    defaultTimeout: z.number().default(300000),
    healthCheckInterval: z.number().default(60000),
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
      port: parseInt(process.env.APP_PORT || '3000', 10),
      environment: process.env.NODE_ENV,
      logLevel: process.env.LOG_LEVEL,
    },
    database: {
      url: process.env.DATABASE_URL,
      maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '20', 10),
      idleTimeout: parseInt(process.env.DB_IDLE_TIMEOUT || '60000', 10),
    },
    queue: {
      retryLimit: parseInt(process.env.QUEUE_RETRY_LIMIT || '3', 10),
      retryDelay: parseInt(process.env.QUEUE_RETRY_DELAY || '60000', 10),
      monitorInterval: parseInt(process.env.QUEUE_MONITOR_INTERVAL || '30000', 10),
    },
    jobs: {
      maxConcurrent: parseInt(process.env.JOBS_MAX_CONCURRENT || '5', 10),
      defaultTimeout: parseInt(process.env.JOBS_DEFAULT_TIMEOUT || '300000', 10),
      healthCheckInterval: parseInt(process.env.JOBS_HEALTH_CHECK_INTERVAL || '60000', 10),
    },
    metrics: {
      enabled: process.env.METRICS_ENABLED !== 'false',
      interval: parseInt(process.env.METRICS_INTERVAL || '60000', 10),
    },
  }

  return configSchema.parse(config)
}

export const config = loadConfig()
