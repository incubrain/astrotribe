// libs/testing/src/types.ts
import type { Store } from 'pinia'
import type { InboundTableSchema } from './schemas'

export interface TestDataContext {
  userId: string
  role: string
  contentIds: Record<string, string>
  categoryIds: number[]
  tagIds: number[]
}

export interface InsertedData {
  users: InboundTableSchema<'user_profiles'>[]
  contents: InboundTableSchema<'contents'>[]
  categories: InboundTableSchema<'categories'>[]
  tags: InboundTableSchema<'tags'>[]
  [key: string]: any[]
}

export interface CrudOperations {
  useSelect: (
    table: string,
    options?: any,
  ) => {
    store: Store<string, any> & { items: any[] }
    refresh: () => Promise<void>
  }
  useInsert: (
    table: string,
    options?: any,
  ) => {
    insertData: (data: any) => Promise<any>
  }
  useUpdate: (
    table: string,
    options?: any,
  ) => {
    updateData: (id: string | number, data: any) => Promise<any>
  }
  useDelete: (
    table: string,
    options?: any,
  ) => {
    deleteData: (id: string | number) => Promise<void>
  }
}

export type Operation = 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE'

export interface RLSPolicy {
  table: string
  operation: Operation
  check: string
}

export interface RLSTestCase {
  operation: string
  role: string
  expectedResult: 'success' | 'failure'
  description: string
  context: {
    userId: string
  }
  setup: {
    data: any[]
  }
  inherited?: boolean
}

export interface RLSTest {
  table: string
  group: string
  policies: Array<{
    table: string
    operation: Operation
    check: string
  }>
  tests: RLSTestCase[]
}

// PERMISSIONS CONFIG
export type AuditLevel = 'low' | 'medium' | 'high' | 'critical'
export type Permission = 'select' | 'insert' | 'update' | 'delete'

export interface PermissionCondition {
  sql: string
}

export interface RolePermissionConfig {
  permissions: Permission[]
  conditions?: {
    [key in Permission]?: PermissionCondition
  }
}

export interface TableGroup {
  description: string
  tables: string[]
  default_permissions: Permission[]
  requires_user_check?: boolean
  audit_level: AuditLevel
}

export interface TableGroups {
  reference_tables: TableGroup
  public_content_tables: TableGroup
  user_content_tables: TableGroup
  user_data_tables: TableGroup
  operational_tables: TableGroup
  security_tables: TableGroup
  [key: string]: TableGroup
}

export interface RoleConfig {
  inherit_from?: string[]
  all_tables?: RolePermissionConfig
  reference_tables?: RolePermissionConfig
  public_content_tables?: RolePermissionConfig
  user_content_tables?: RolePermissionConfig
  user_data_tables?: RolePermissionConfig
  operational_tables?: RolePermissionConfig
  security_tables?: RolePermissionConfig
  [key: string]: RolePermissionConfig | string[] | undefined
}

export interface PermissionsConfig {
  table_groups: TableGroups
  roles: {
    super_admin: RoleConfig
    admin: RoleConfig
    moderator: RoleConfig
    user: RoleConfig
    guest: RoleConfig
    [key: string]: RoleConfig
  }
}

export interface ResolvedTablePermissions {
  permissions: Permission[]
  conditions?: {
    [key in Permission]?: PermissionCondition
  }
  source: {
    role: string
    group: string
  }
}
