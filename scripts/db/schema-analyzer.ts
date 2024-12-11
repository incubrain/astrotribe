// src/scripts/db/schema-analyzer.ts
import type { PoolClient, Pool } from 'pg'

type AnalyzerResult =
  | ColumnDefinition[]
  | Relationship[]
  | EnumDefinition[]
  | FunctionDefinition[]
  | PolicyDefinition[]
  | TriggerDefinition[]

interface BaseAnalyzer<T extends AnalyzerResult = AnalyzerResult> {
  analyze(client: PoolClient, table?: string): Promise<T>
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

// Original interfaces remain the same
interface TableSchema {
  name: string
  columns?: ColumnDefinition[]
  relationships?: Relationship[]
  securityLevel?: 'public' | 'private' | 'protected'
  hasUserRelation?: boolean
  hasCompanyRelation?: boolean
  isAuditTable?: boolean
  hasSensitiveData?: boolean
  enums?: EnumDefinition[]
  functions?: FunctionDefinition[]
  triggers?: TriggerDefinition[]
  policies?: PolicyDefinition[]
}

// Add new interfaces for additional schema objects
interface EnumDefinition {
  name: string
  values: string[]
  schema: string
}

interface FunctionDefinition {
  name: string
  schema: string
  returnType: string
  arguments: string
  kind: 'function' | 'aggregate' | 'procedure' | 'window'
  definition: string | null
}

interface TriggerDefinition {
  name: string
  table: string
  function: string
  definition: string
}

interface PolicyDefinition {
  name: string
  table: string
  action: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | string
  permissive: boolean
  using: string
  withCheck?: string
  roles: string[]
}

interface AnalyzerOptions {
  /** Include basic table information */
  includeTables?: boolean
  /** Include column definitions and constraints */
  includeColumns?: boolean
  /** Include relationship information between tables */
  includeRelationships?: boolean
  /** Include enum type definitions */
  includeEnums?: boolean
  /** Include function definitions */
  includeFunctions?: boolean
  /** Include policy definitions */
  includePolicies?: boolean
  /** Include security analysis of tables */
  includeSecurityAnalysis?: boolean
  /** Specific tables to analyze. If not provided, all tables will be analyzed */
  tables?: string[]
}

class TriggerAnalyzer implements BaseAnalyzer<TriggerDefinition[]> {
  async analyze(client: PoolClient, table?: string): Promise<TriggerDefinition[]> {
    const query = `
      SELECT 
        t.tgname as name,
        c.relname as table_name,
        p.proname as function_name,
        pg_get_triggerdef(t.oid) as definition,
        n.nspname as schema_name
      FROM pg_trigger t
      JOIN pg_class c ON t.tgrelid = c.oid
      JOIN pg_proc p ON t.tgfoid = p.oid
      JOIN pg_namespace n ON c.relnamespace = n.oid
      WHERE NOT t.tgisinternal
      AND n.nspname = 'public'
      ${table ? 'AND c.relname = $1' : ''}
    `

    try {
      const result = await client.query(query, table ? [table] : [])

      return result.rows.map((row) => ({
        name: row.name,
        table: row.table_name,
        function: row.function_name,
        definition: row.definition,
        schema: row.schema_name,
      }))
    } catch (error) {
      console.error('Error analyzing triggers:', error)
      throw error
    }
  }
}

// Individual analyzers
class ColumnAnalyzer implements BaseAnalyzer {
  async analyze(client: PoolClient, table: string): Promise<ColumnDefinition[]> {
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
}

class RelationshipAnalyzer implements BaseAnalyzer {
  async analyze(client: PoolClient, table: string): Promise<Relationship[]> {
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
}

class EnumAnalyzer implements BaseAnalyzer {
  async analyze(client: PoolClient): Promise<EnumDefinition[]> {
    const result = await client.query(`
      SELECT 
        t.typname as name,
        n.nspname as schema,
        array_agg(e.enumlabel) as values
      FROM pg_type t 
      JOIN pg_enum e ON t.oid = e.enumtypid  
      JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
      WHERE n.nspname = 'public'
      GROUP BY t.typname, n.nspname
    `)
    return result.rows
  }
}

class FunctionAnalyzer implements BaseAnalyzer<FunctionDefinition[]> {
  async analyze(client: PoolClient): Promise<FunctionDefinition[]> {
    const query = `
      SELECT 
        p.proname as name,
        n.nspname as schema,
        pg_get_function_result(p.oid) as return_type,
        pg_get_function_arguments(p.oid) as arguments,
        CASE 
          WHEN p.prokind = 'a' THEN 'aggregate'
          WHEN p.prokind = 'w' THEN 'window'
          WHEN p.prokind = 'p' THEN 'procedure'
          ELSE 'function'
        END as kind,
        CASE 
          WHEN p.prokind = 'a' THEN NULL  -- Skip definition for aggregates
          ELSE pg_get_functiondef(p.oid)
        END as definition
      FROM pg_proc p
      JOIN pg_namespace n ON p.pronamespace = n.oid
      WHERE n.nspname = 'public'
      AND p.prokind NOT IN ('i', 't')  -- Exclude internal functions and trigger functions
      ORDER BY p.proname
    `

    try {
      const result = await client.query(query)

      return result.rows.map((row) => ({
        name: row.name,
        schema: row.schema,
        returnType: row.return_type,
        arguments: row.arguments,
        kind: row.kind,
        definition: row.definition,
      }))
    } catch (error) {
      console.error('Error analyzing functions:', error)
      throw error
    }
  }
}

class PolicyAnalyzer implements BaseAnalyzer<PolicyDefinition[]> {
  async analyze(client: PoolClient, table?: string): Promise<PolicyDefinition[]> {
    const query = `
      WITH policy_definitions AS (
        SELECT 
          pol.polname as name,
          cls.relname as table_name,
          CASE pol.polcmd
            WHEN 'r' THEN 'SELECT'
            WHEN 'a' THEN 'INSERT'
            WHEN 'w' THEN 'UPDATE'
            WHEN 'd' THEN 'DELETE'
            ELSE pol.polcmd::text
          END as action,
          CASE 
            WHEN pol.polpermissive THEN 'PERMISSIVE'
            ELSE 'RESTRICTIVE'
          END as permissive,
          pg_get_expr(pol.polqual, pol.polrelid) as using_expr,
          pg_get_expr(pol.polwithcheck, pol.polrelid) as with_check_expr,
          pol.polroles as roles,
          nsp.nspname as schema_name
        FROM pg_policy pol
        JOIN pg_class cls ON pol.polrelid = cls.oid
        JOIN pg_namespace nsp ON cls.relnamespace = nsp.oid
        WHERE nsp.nspname = 'public'
        ${table ? 'AND cls.relname = $1' : ''}
      )
      SELECT 
        name,
        table_name,
        action,
        permissive,
        using_expr as using,
        with_check_expr as with_check,
        array_to_string(array(
          SELECT r.rolname 
          FROM pg_roles r 
          WHERE r.oid = ANY(roles)
        ), ', ') as role_names
      FROM policy_definitions
      ORDER BY table_name, name
    `

    try {
      const result = await client.query(query, table ? [table] : [])

      return result.rows.map((row) => ({
        name: row.name,
        table: row.table_name,
        action: row.action,
        permissive: row.permissive === 'PERMISSIVE',
        using: row.using,
        withCheck: row.with_check,
        roles: row.role_names ? row.role_names.split(', ') : [],
      }))
    } catch (error) {
      console.error('Error analyzing policies:', error)
      throw error
    }
  }
}

// Enhanced SchemaAnalyzer
export class SchemaAnalyzer {
  private analyzers: Map<string, BaseAnalyzer<AnalyzerResult>>

  constructor(private pool: Pool) {
    this.analyzers = new Map<string, BaseAnalyzer<AnalyzerResult>>([
      ['columns', new ColumnAnalyzer()],
      ['relationships', new RelationshipAnalyzer()],
      ['enums', new EnumAnalyzer()],
      ['functions', new FunctionAnalyzer()],
      ['policies', new PolicyAnalyzer()],
      ['triggers', new TriggerAnalyzer()],
    ])
  }

  async analyzeDatabase(options: AnalyzerOptions = {}): Promise<TableSchema[]> {
    const client: PoolClient = await this.pool.connect()
    try {
      const tables = options.tables || (await this.getTables(client))
      const schemas: TableSchema[] = []

      // Global analyses that don't depend on specific tables
      const globalAnalyses: Record<string, any> = {}
      if (options.includeEnums) {
        globalAnalyses.enums = await this.analyzers.get('enums')!.analyze(client)
      }
      if (options.includeFunctions) {
        globalAnalyses.functions = await this.analyzers.get('functions')!.analyze(client)
      }

      // Table-specific analyses
      for (const table of tables) {
        const schema: TableSchema = { name: table }

        if (options.includeColumns) {
          schema.columns = await this.analyzers.get('columns')!.analyze(client, table)
        }

        if (options.includeRelationships) {
          schema.relationships = await this.analyzers.get('relationships')!.analyze(client, table)
        }

        if (options.includePolicies) {
          schema.policies = await this.analyzers.get('policies')!.analyze(client, table)
        }

        if (options.includeSecurityAnalysis && schema.columns && schema.relationships) {
          schema.hasUserRelation = this.checkUserRelation(schema.columns, schema.relationships)
          schema.hasCompanyRelation = this.checkCompanyRelation(
            schema.columns,
            schema.relationships,
          )
          schema.isAuditTable = this.isAuditTable(table, schema.columns)
          schema.hasSensitiveData = this.hasSensitiveData(table, schema.columns)
          schema.securityLevel = this.determineSecurityLevel({
            table,
            columns: schema.columns,
            relationships: schema.relationships,
            hasUserRelation: schema.hasUserRelation,
            hasCompanyRelation: schema.hasCompanyRelation,
            isAuditTable: schema.isAuditTable,
            hasSensitiveData: schema.hasSensitiveData,
          })
        }

        schemas.push(schema)
      }

      return schemas
    } finally {
      client.release()
    }
  }

  private async getTables(client: PoolClient): Promise<string[]> {
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
