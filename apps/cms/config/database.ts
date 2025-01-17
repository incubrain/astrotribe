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
        propagateCreateError: false,
        afterCreate: (conn, done) => {
          conn.query('SET session_replication_role = REPLICA;', (err) => {
            if (err) {
              console.error('Error setting session_replication_role:', err)
            }
            done(err, conn)
          })
        },
      },
      acquireConnectionTimeout: 60000,
      // Add retry strategy
      connectionRetryAttempts: 5,
      connectionRetryDelay: 2000,
    },
    debug: false,
    // Add explicit settings for migrations
    settings: {
      forceMigration: true,
      runMigrations: true,
      migrationRetryAttempts: 3,
      migrationRetryDelay: 5000,
    },
  },
})
