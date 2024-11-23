// src/generators/schema-analyzer.ts
import Pool from 'pg-pool'

interface TableSchema {
  name: string
  columns: ColumnDefinition[]
  relationships: Relationship[]
  securityLevel: 'public' | 'private' | 'protected'
  hasUserRelation: boolean
  hasCompanyRelation: boolean
  isAuditTable: boolean
  hasSensitiveData: boolean
}

interface ColumnDefinition {
  name: string
  type: string
  nullable: boolean
  isPrimary: boolean
  isForeign: boolean
  references?: {
    table: string
    column: string
  }
  hasDefault: boolean
}

interface Relationship {
  table: string
  type: 'oneToOne' | 'oneToMany' | 'manyToOne' | 'manyToMany'
  throughTable?: string
  foreignKey: string
  columnName: string
}

export class SchemaAnalyzer {
  constructor(private pool: Pool) {}

  async analyzeDatabase(): Promise<TableSchema[]> {
    const client = await this.pool.connect()
    try {
      const tables = await this.getTables(client)
      const schemas: TableSchema[] = []

      for (const table of tables) {
        const columns = await this.getColumns(client, table)
        const relationships = await this.analyzeRelationships(client, table)
        const hasUserRelation = this.checkUserRelation(columns, relationships)
        const hasCompanyRelation = this.checkCompanyRelation(columns, relationships)
        const isAuditTable = this.isAuditTable(table, columns)
        const hasSensitiveData = this.hasSensitiveData(table, columns)

        const securityLevel = this.determineSecurityLevel({
          table,
          columns,
          relationships,
          hasUserRelation,
          hasCompanyRelation,
          isAuditTable,
          hasSensitiveData,
        })

        schemas.push({
          name: table,
          columns,
          relationships,
          securityLevel,
          hasUserRelation,
          hasCompanyRelation,
          isAuditTable,
          hasSensitiveData,
        })
      }

      return schemas
    } finally {
      client.release()
    }
  }

  private async getTables(client: any): Promise<string[]> {
    const result = await client.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
      AND tablename NOT IN (
        'strapi_migrations',
        'strapi_migrations_internal',
        'table_maintenance_log',
        'table_query_performance',
        'table_sequence_usage',
        'table_statistics'
      )
    `)
    return result.rows.map((row: any) => row.tablename)
  }

  private async getColumns(client: any, table: string): Promise<ColumnDefinition[]> {
    const result = await client.query(
      `
      SELECT 
        c.column_name,
        c.data_type,
        c.is_nullable = 'YES' as nullable,
        c.column_default IS NOT NULL as hasDefault,
        pk.constraint_type = 'PRIMARY KEY' as isPrimary,
        fk.foreign_table,
        fk.foreign_column
      FROM information_schema.columns c
      LEFT JOIN (
        SELECT kcu.column_name, tc.constraint_type
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        WHERE tc.table_name = $1
          AND tc.constraint_type = 'PRIMARY KEY'
      ) pk ON c.column_name = pk.column_name
      LEFT JOIN (
        SELECT
          kcu.column_name,
          ccu.table_name AS foreign_table,
          ccu.column_name AS foreign_column
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage ccu
          ON tc.constraint_name = ccu.constraint_name
        WHERE tc.table_name = $1
          AND tc.constraint_type = 'FOREIGN KEY'
      ) fk ON c.column_name = fk.column_name
      WHERE c.table_name = $1
    `,
      [table],
    )

    return result.rows.map((row: any) => ({
      name: row.column_name,
      type: row.data_type,
      nullable: row.nullable,
      isPrimary: row.isprimary,
      isForeign: !!row.foreign_table,
      references: row.foreign_table
        ? {
            table: row.foreign_table,
            column: row.foreign_column,
          }
        : undefined,
      hasDefault: row.hasdefault,
    }))
  }

  private async analyzeRelationships(client: any, table: string): Promise<Relationship[]> {
    const result = await client.query(
      `
      WITH RECURSIVE relation_chain AS (
        -- Direct foreign keys
        SELECT
          kcu.table_name as source_table,
          kcu.column_name as source_column,
          ccu.table_name as target_table,
          ccu.column_name as target_column,
          tc.constraint_name,
          ARRAY[kcu.table_name] as path,
          1 as level
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage ccu
          ON tc.constraint_name = ccu.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY'
          AND (kcu.table_name = $1 OR ccu.table_name = $1)
        
        UNION ALL
        
        -- Recursive part for finding many-to-many relationships
        SELECT
          rc.source_table,
          rc.source_column,
          ccu.table_name,
          ccu.column_name,
          tc.constraint_name,
          rc.path || ccu.table_name,
          rc.level + 1
        FROM relation_chain rc
        JOIN information_schema.table_constraints tc
          ON tc.table_name = rc.target_table
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage ccu
          ON tc.constraint_name = ccu.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY'
          AND NOT ccu.table_name = ANY(rc.path)
          AND rc.level < 2
      )
      SELECT DISTINCT ON (constraint_name)
        source_table,
        source_column,
        target_table,
        target_column,
        path,
        level
      FROM relation_chain
      WHERE source_table = $1 OR target_table = $1
      ORDER BY constraint_name, level
    `,
      [table],
    )

    return result.rows.map((row: any) => {
      let type: 'oneToOne' | 'oneToMany' | 'manyToOne' | 'manyToMany' = 'oneToMany'
      let throughTable: string | undefined

      if (row.level === 2) {
        type = 'manyToMany'
        throughTable = row.path[1]
      } else {
        // Determine cardinality based on unique constraints
        // This is a simplified approach - you might want to enhance this logic
        type = row.source_table === table ? 'manyToOne' : 'oneToMany'
      }

      return {
        table: row.target_table,
        type,
        throughTable,
        foreignKey: row.source_column,
        columnName: row.target_column,
      }
    })
  }

  private checkUserRelation(columns: ColumnDefinition[], relationships: Relationship[]): boolean {
    return (
      columns.some((col) => col.name === 'user_id') ||
      relationships.some((rel) => rel.table === 'user_profiles')
    )
  }

  private checkCompanyRelation(
    columns: ColumnDefinition[],
    relationships: Relationship[],
  ): boolean {
    return (
      columns.some((col) => col.name === 'company_id') ||
      relationships.some((rel) => rel.table === 'companies')
    )
  }

  private isAuditTable(table: string, columns: ColumnDefinition[]): boolean {
    const auditPatterns = ['log', 'audit', 'history', 'archive', 'backup']
    const hasAuditName = auditPatterns.some((pattern) => table.toLowerCase().includes(pattern))
    const hasTimestamps = columns.some((col) =>
      ['created_at', 'updated_at', 'deleted_at', 'timestamp'].includes(col.name),
    )
    return hasAuditName && hasTimestamps
  }

  private hasSensitiveData(table: string, columns: ColumnDefinition[]): boolean {
    const sensitivePatterns = [
      'password',
      'secret',
      'token',
      'key',
      'credential',
      'payment',
      'billing',
      'address',
      'ssn',
      'social_security',
      'credit_card',
      'authorization',
      'permission',
      'role',
    ]

    return sensitivePatterns.some(
      (pattern) =>
        table.toLowerCase().includes(pattern) ||
        columns.some((col) => col.name.toLowerCase().includes(pattern)),
    )
  }

  private determineSecurityLevel(params: {
    table: string
    columns: ColumnDefinition[]
    relationships: Relationship[]
    hasUserRelation: boolean
    hasCompanyRelation: boolean
    isAuditTable: boolean
    hasSensitiveData: boolean
  }): 'public' | 'private' | 'protected' {
    const { table, hasUserRelation, hasCompanyRelation, isAuditTable, hasSensitiveData } = params

    // Protected tables
    if (
      isAuditTable ||
      hasSensitiveData ||
      table.includes('permission') ||
      table.includes('role') ||
      table.includes('webhook') ||
      table.includes('payment') ||
      table.includes('subscription')
    ) {
      return 'protected'
    }

    // Private tables
    if (
      hasUserRelation ||
      hasCompanyRelation ||
      table.includes('profile') ||
      table.includes('contact') ||
      table.includes('address') ||
      table.includes('bookmark') ||
      table.includes('feedback')
    ) {
      return 'private'
    }

    // Public tables
    return 'public'
  }
}
