// packages/pg-service/migrations/1676000000000_nuxt_content_setup.ts
import type { MigrationBuilder } from 'node-pg-migrate'

export async function up(pgm: MigrationBuilder): Promise<void> {
  // Create a dedicated schema for Nuxt Content
  pgm.createSchema('nuxt_content', { ifNotExists: true })

  // Create the documents table
  pgm.createTable('nuxt_content.documents', {
    id: { type: 'serial', primaryKey: true },
    source: { type: 'text', notNull: true },
    path: { type: 'text', notNull: true },
    title: { type: 'text' },
    description: { type: 'text' },
    body: { type: 'text' },
    metadata: { type: 'jsonb', default: '{}' },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  })

  // Create indexes for faster queries
  pgm.createIndex('nuxt_content.documents', 'path')
  pgm.createIndex('nuxt_content.documents', 'source')
  pgm.createIndex('nuxt_content.documents', 'metadata', { method: 'gin' })

  // Collection table for organizing content
  pgm.createTable('nuxt_content.collections', {
    id: { type: 'serial', primaryKey: true },
    name: { type: 'text', notNull: true, unique: true },
    schema: { type: 'jsonb' },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  })

  // Create a relation table for documents and collections
  pgm.createTable('nuxt_content.document_collections', {
    document_id: {
      type: 'integer',
      notNull: true,
      references: 'nuxt_content.documents',
      onDelete: 'CASCADE',
    },
    collection_id: {
      type: 'integer',
      notNull: true,
      references: 'nuxt_content.collections',
      onDelete: 'CASCADE',
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  })

  // Add primary key to the relation table
  pgm.addConstraint('nuxt_content.document_collections', 'document_collections_pkey', {
    primaryKey: ['document_id', 'collection_id'],
  })
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('nuxt_content.document_collections')
  pgm.dropTable('nuxt_content.collections')
  pgm.dropTable('nuxt_content.documents')
  pgm.dropSchema('nuxt_content')
}
