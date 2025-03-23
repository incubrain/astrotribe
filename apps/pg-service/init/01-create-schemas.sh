#!/bin/bash
set -e

# Create the nuxt_content schema and tables
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
  -- Create schema
  CREATE SCHEMA IF NOT EXISTS nuxt_content;
  
  -- Create documents table
  CREATE TABLE IF NOT EXISTS nuxt_content.documents (
    id SERIAL PRIMARY KEY,
    source TEXT NOT NULL,
    path TEXT NOT NULL,
    title TEXT,
    description TEXT,
    body TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
  );
  
  -- Create indexes
  CREATE INDEX IF NOT EXISTS idx_documents_path ON nuxt_content.documents(path);
  CREATE INDEX IF NOT EXISTS idx_documents_source ON nuxt_content.documents(source);
  CREATE INDEX IF NOT EXISTS idx_documents_metadata ON nuxt_content.documents USING gin(metadata);
  
  -- Create collections table
  CREATE TABLE IF NOT EXISTS nuxt_content.collections (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    schema JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
  );
  
  -- Create relation table
  CREATE TABLE IF NOT EXISTS nuxt_content.document_collections (
    document_id INTEGER NOT NULL REFERENCES nuxt_content.documents(id) ON DELETE CASCADE,
    collection_id INTEGER NOT NULL REFERENCES nuxt_content.collections(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    PRIMARY KEY (document_id, collection_id)
  );
  
  -- Set up permissions
  -- Create a dedicated user for Nuxt Content
  DO \$\$
  BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'nuxt_content_user') THEN
      CREATE USER nuxt_content_user WITH PASSWORD 'nuxt_password';
    END IF;
  END
  \$\$;
  
  -- Grant necessary permissions
  GRANT USAGE ON SCHEMA nuxt_content TO nuxt_content_user;
  GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA nuxt_content TO nuxt_content_user;
  GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA nuxt_content TO nuxt_content_user;
  
  -- Set default privileges for future objects
  ALTER DEFAULT PRIVILEGES IN SCHEMA nuxt_content
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO nuxt_content_user;
  
  ALTER DEFAULT PRIVILEGES IN SCHEMA nuxt_content
  GRANT USAGE, SELECT ON SEQUENCES TO nuxt_content_user;
EOSQL
