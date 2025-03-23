// packages/pg-service/migrations/1676000000001_nuxt_content_permissions.ts
import type { MigrationBuilder } from 'node-pg-migrate'

export async function up(pgm: MigrationBuilder): Promise<void> {
  // Create a dedicated user for Nuxt Content with limited permissions
  pgm.sql(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'nuxt_content_user') THEN
        CREATE USER nuxt_content_user WITH PASSWORD 'your_secure_password';
      END IF;
    END
    $$;
  `)

  // Grant appropriate permissions
  pgm.sql(`
    GRANT USAGE ON SCHEMA nuxt_content TO nuxt_content_user;
    GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA nuxt_content TO nuxt_content_user;
    GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA nuxt_content TO nuxt_content_user;
    
    -- Make sure future tables and sequences also get the right permissions
    ALTER DEFAULT PRIVILEGES IN SCHEMA nuxt_content
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO nuxt_content_user;
    
    ALTER DEFAULT PRIVILEGES IN SCHEMA nuxt_content
    GRANT USAGE, SELECT ON SEQUENCES TO nuxt_content_user;
  `)
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA nuxt_content FROM nuxt_content_user;
    REVOKE ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA nuxt_content FROM nuxt_content_user;
    REVOKE USAGE ON SCHEMA nuxt_content FROM nuxt_content_user;
    
    -- Drop user
    DROP USER IF EXISTS nuxt_content_user;
  `)
}
