import path from 'path'

export default ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      host: env('DATABASE_HOST', 'localhost'),
      port: env.int('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME', 'strapi'),
      user: env('DATABASE_USERNAME', 'strapi'),
      password: env('DATABASE_PASSWORD', 'strapi'),
      ssl: env.bool('DATABASE_SSL', false),
      schema: env('DATABASE_SCHEMA', 'public'),
      pool: {
        min: 0,
        max: 5,
        acquireTimeoutMillis: 60000,
        createTimeoutMillis: 30000,
        idleTimeoutMillis: 30000,
        reapIntervalMillis: 1000,
        createRetryIntervalMillis: 2000,
        // Add these additional configurations
      },
    },
    debug: false,
    acquireConnectionTimeout: 60000,
  },
  // Add explicit settings for migrations
  settings: {
    forceMigration: true,
    runMigrations: true,
    migrationRetryAttempts: 3,
    migrationRetryDelay: 5000,
  },
})
