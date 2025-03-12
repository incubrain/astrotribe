// src/scripts/db/schema-analyzer.ts
import type { PoolClient, Pool } from 'pg'
import { domainMap, inferDomain, domainConfig, type DomainName } from './api/domain-config'

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

export interface ColumnDefinition {
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

export interface Relationship {
  table: string
  type: 'oneToOne' | 'oneToMany' | 'manyToOne' | 'manyToMany'
  throughTable?: string
  foreignKey: string
  columnName: string
}

// Update TableSchema to include domain-specific properties
export interface TableSchema {
  name: string
  domain?: string
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
  // Add domain-specific properties
  requiresAuth?: boolean
  defaultPermissions?: string[]
  supportsSoftDelete?: boolean
  supportsVersioning?: boolean
  requiresCompany?: boolean
  requiresUser?: boolean
  requiresEncryption?: boolean
  supportsCaching?: boolean
  requiresAdmin?: boolean
  sensitiveFields?: string[]
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
    } catch (error: any) {
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

export class EnumAnalyzer implements BaseAnalyzer<EnumDefinition[]> {
  async analyze(client: PoolClient, table?: string): Promise<EnumDefinition[]> {
    if (table) {
      // If table is provided, get enum definitions for specific table
      return this.getTableEnumDefinitions(client, table)
    }

    // If no table provided, get all enum definitions
    return this.getAllEnumDefinitions(client)
  }

  private async getTableEnumDefinitions(
    client: PoolClient,
    tableName: string,
  ): Promise<EnumDefinition[]> {
    // Get all enum columns for this table
    const enumColumnsQuery = `
      SELECT 
        column_name,
        udt_name as enum_type
      FROM information_schema.columns
      WHERE table_name = $1
      AND data_type = 'USER-DEFINED'
    `

    const enumColumns = await client.query(enumColumnsQuery, [tableName])
    const definitions: EnumDefinition[] = []

    for (const column of enumColumns.rows) {
      const values = await this.getEnumValues(client, column.enum_type)
      if (values.length) {
        definitions.push({
          name: column.column_name,
          type: column.enum_type,
          values,
          schema: 'public',
        })
      }
    }

    return definitions
  }

  private async getAllEnumDefinitions(client: PoolClient): Promise<EnumDefinition[]> {
    const query = `
      SELECT 
        t.typname as name,
        n.nspname as schema,
        array_agg(e.enumlabel ORDER BY e.enumsortorder) as values
      FROM pg_type t 
      JOIN pg_enum e ON t.oid = e.enumtypid  
      JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
      WHERE n.nspname = 'public'
      GROUP BY t.typname, n.nspname
    `

    const result = await client.query(query)
    return result.rows
  }

  private async getEnumValues(client: PoolClient, enumTypeName: string): Promise<string[]> {
    const query = `
      SELECT e.enumlabel as value
      FROM pg_type t
      JOIN pg_enum e ON t.oid = e.enumtypid
      JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
      WHERE t.typname = $1
      AND n.nspname = 'public'
      ORDER BY e.enumsortorder
    `

    const result = await client.query(query, [enumTypeName])
    return result.rows.map((row) => row.value)
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
    } catch (error: any) {
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
    } catch (error: any) {
      console.error('Error analyzing policies:', error)
      throw error
    }
  }
}

export class DomainValidator {
  static validateSchema(schema: TableSchema): void {
    if (!schema.domain) {
      throw new Error(`No domain assigned for table: ${schema.name}`)
    }

    const config = domainConfig[schema.domain as DomainName]
    if (!config) {
      if (schema.domain !== 'common') {
        throw new Error(`Invalid domain "${schema.domain}" for table: ${schema.name}`)
      }
      return
    }

    // Check required relations only if not implicitly handled
    if (config.requiresUser && !config.implicitRelations?.user && !schema.hasUserRelation) {
      throw new Error(`Table ${schema.name} in domain ${schema.domain} requires user relation`)
    }
    if (
      config.requiresCompany &&
      !config.implicitRelations?.company &&
      !schema.hasCompanyRelation
    ) {
      throw new Error(`Table ${schema.name} in domain ${schema.domain} requires company relation`)
    }
  }

  static validateDomainConsistency(schemas: TableSchema[]): void {
    for (const schema of schemas) {
      if (!schema.relationships) continue

      const relatedDomains = new Set(
        schema.relationships
          .map((rel) => {
            const relatedSchema = schemas.find((s) => s.name === rel.table)
            return relatedSchema?.domain
          })
          .filter(Boolean),
      )

      // Check if relationships are allowed for this domain
      const config = domainConfig[schema.domain as DomainName]
      if (config && config.allowedRelations) {
        const invalidDomains = Array.from(relatedDomains).filter((domain) => {
          return (
            !config.allowedRelations!.includes('*') && !config.allowedRelations!.includes(domain)
          )
        })

        if (invalidDomains.length > 0) {
          console.warn(
            `Warning: Table ${schema.name} has unauthorized relationships with domains: ${invalidDomains.join(', ')}`,
          )
        }
      }
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
      const schemas = await this.performAnalysis(client, options)

      // Validate each schema
      for (const schema of schemas) {
        try {
          DomainValidator.validateSchema(schema)
        } catch (error: any) {
          console.error(`Validation error: ${error.message}`)
          // Set to common domain if validation fails
          schema.domain = 'common'
        }
      }

      // Check domain consistency
      DomainValidator.validateDomainConsistency(schemas)

      return schemas
    } finally {
      client.release()
    }
  }

  private async performAnalysis(
    client: PoolClient,
    options: AnalyzerOptions,
  ): Promise<TableSchema[]> {
    const tables = options.tables || (await this.getTables(client))
    let schemas: TableSchema[] = []

    // Global analyses that don't depend on specific tables
    const globalAnalyses: Record<string, any> = {}
    if (options.includeEnums) {
      globalAnalyses.enums = await this.analyzers.get('enums')!.analyze(client)
    }
    if (options.includeFunctions) {
      globalAnalyses.functions = await this.analyzers.get('functions')!.analyze(client)
    }

    // Process each table
    for (const table of tables) {
      const schema: TableSchema = {
        name: table,
        domain: this.assignInitialDomain(table),
      }

      // Perform requested analysis
      try {
        if (options.includeColumns) {
          schema.columns = await this.analyzers.get('columns')!.analyze(client, table)
        }

        if (options.includeRelationships) {
          schema.relationships = await this.analyzers.get('relationships')!.analyze(client, table)
        }

        if (options.includePolicies) {
          schema.policies = await this.analyzers.get('policies')!.analyze(client, table)
        }

        if (options.includeEnums) {
          // For enums, we'll use both global enums and table-specific enums
          schema.enums = await this.analyzers.get('enums')!.analyze(client, table)
        }

        if (options.includeFunctions) {
          schema.functions = globalAnalyses.functions.filter((f: FunctionDefinition) =>
            f.name.toLowerCase().includes(table.toLowerCase()),
          )
        }

        // Perform security analysis if requested and required data is available
        if (options.includeSecurityAnalysis && schema.columns && schema.relationships) {
          await this.enrichSchemaWithSecurity(schema)
        }

        schemas.push(schema)
      } catch (error: any) {
        console.error(`Error analyzing table ${table}:`, error)
        // Add table with minimal info even if analysis fails
        schemas.push({
          name: table,
          domain: 'common',
          error: error.message,
        })
      }
    }

    // Post-processing
    if (options.includeRelationships) {
      schemas = this.finalizeDomains(schemas)
    }

    // Apply domain-specific configurations
    schemas = this.applyDomainConfigs(schemas)

    return schemas
  }

  private assignInitialDomain(tableName: string): string {
    // First check explicit mapping
    if (domainMap[tableName]) {
      return domainMap[tableName]
    }

    // Then try to infer from name
    return inferDomain(tableName)
  }

  private finalizeDomains(schemas: TableSchema[]): TableSchema[] {
    // First pass: Build a map of table relationships
    const relationshipMap = new Map<string, Set<string>>()

    for (const schema of schemas) {
      if (!schema.relationships) continue

      const relatedTables = new Set<string>()
      for (const rel of schema.relationships) {
        relatedTables.add(rel.table)
      }
      relationshipMap.set(schema.name, relatedTables)
    }

    // Second pass: Refine domains based on relationships
    for (const schema of schemas) {
      if (schema.domain && schema.domain !== 'common') continue

      const relatedTables = relationshipMap.get(schema.name)
      if (!relatedTables) continue

      // Get domains of related tables
      const relatedDomains = new Set<string>()
      for (const relatedTable of relatedTables) {
        const relatedSchema = schemas.find((s) => s.name === relatedTable)
        if (relatedSchema?.domain && relatedSchema.domain !== 'common') {
          relatedDomains.add(relatedSchema.domain)
        }
      }

      // If all related tables are in the same domain, use that domain
      if (relatedDomains.size === 1) {
        schema.domain = Array.from(relatedDomains)[0]
      }
      // If related tables are in multiple domains, use the most specific one
      else if (relatedDomains.size > 1) {
        // Prioritize certain domains (e.g., content > common)
        const domainPriority: Record<string, number> = {
          content: 5,
          auth: 4,
          org: 3,
          payments: 2,
          common: 1,
        }

        const sortedDomains = Array.from(relatedDomains).sort(
          (a, b) => (domainPriority[b] || 0) - (domainPriority[a] || 0),
        )

        schema.domain = sortedDomains[0]
      }
    }

    return schemas
  }

  private applyDomainConfigs(schemas: TableSchema[]): TableSchema[] {
    return schemas.map((schema) => {
      if (!schema.domain || !(schema.domain in domainConfig)) {
        return schema
      }

      const config = domainConfig[schema.domain as DomainName]

      // Apply domain-specific configurations
      return {
        ...schema,
        requiresAuth: config.requiresAuth,
        defaultPermissions: config.defaultPermissions,
        supportsSoftDelete: config.supportsSoftDelete,
        supportsVersioning: config.supportsVersioning,
        requiresCompany: config.requiresCompany,
        requiresUser: config.requiresUser,
        requiresEncryption: config.requiresEncryption,
        supportsCaching: config.supportsCaching,
        requiresAdmin: config.requiresAdmin,
        sensitiveFields: config.sensitiveFields,
      }
    })
  }

  private async enrichSchemaWithSecurity(schema: TableSchema): Promise<void> {
    if (!schema.columns || !schema.relationships) return

    schema.hasUserRelation = this.checkUserRelation(schema.columns, schema.relationships)
    schema.hasCompanyRelation = this.checkCompanyRelation(schema.columns, schema.relationships)
    schema.isAuditTable = this.isAuditTable(schema.name, schema.columns)
    schema.hasSensitiveData = this.hasSensitiveData(schema.name, schema.columns)

    // Determine security level considering domain
    schema.securityLevel = this.determineSecurityLevel({
      table: schema.name,
      columns: schema.columns,
      relationships: schema.relationships,
      hasUserRelation: schema.hasUserRelation,
      hasCompanyRelation: schema.hasCompanyRelation,
      isAuditTable: schema.isAuditTable,
      hasSensitiveData: schema.hasSensitiveData,
      domain: schema.domain,
    })
  }

  private async getTables(client: PoolClient): Promise<string[]> {
    const result = await client.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
      AND tablename NOT IN (
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
    domain?: string
  }): 'public' | 'private' | 'protected' {
    const { table, hasUserRelation, hasCompanyRelation, isAuditTable, hasSensitiveData, domain } =
      params

    // Domain-specific security rules
    if (domain) {
      const config = domainConfig[domain as DomainName]
      if (config?.requiresAdmin) return 'protected'
      if (config?.requiresAuth) return 'private'
    }

    // Original security level logic
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

    return 'public'
  }
}
