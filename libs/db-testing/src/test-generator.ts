// db-testing/src/test-generator.ts
import type { z } from 'zod'
import { generateTestData } from './data-generator'
import type {
  RLSTest,
  RLSPolicy,
  RLSTestCase,
  PermissionsConfig,
  PermissionCondition,
  Permission,
  Operation,
  TestDataContext,
  ResolvedTablePermissions,
} from './types'
import type { InboundTableSchema, SchemaKey } from './schemas'
import { TEST_USERS, DEFAULT_TEST_IDS } from './constants'

function createPoliciesForTable(
  table: string,
  permissions: ResolvedTablePermissions,
  conditions?: Record<string, PermissionCondition>,
): RLSPolicy[] {
  const policies: RLSPolicy[] = []

  for (const operation of permissions.permissions) {
    if (conditions?.[operation]) {
      policies.push({
        table,
        operation: operation.toUpperCase() as Operation,
        check: conditions[operation].sql,
      })
    }
  }

  return policies
}

function createTestCase<T extends SchemaKey>(
  table: T,
  operation: string,
  role: string,
  expectedResult: 'success' | 'failure',
  description: string,
  userId: string,
  dataOverrides: Partial<InboundTableSchema<T>> = {},
  inherited = false,
): RLSTestCase {
  const data = generateTestData(table, dataOverrides)
  return {
    operation,
    role,
    expectedResult,
    description: inherited ? `${description} (inherited)` : description,
    context: { userId },
    setup: { data: [data] },
    inherited,
  }
}

function getInheritedRoles(role: string, config: PermissionsConfig): string[] {
  const inheritedRoles: string[] = []
  let currentRole = role

  while (currentRole) {
    const roleConfig = config.roles[currentRole]
    if (roleConfig?.inherit_from?.[0]) {
      const parentRole = roleConfig.inherit_from[0]
      inheritedRoles.push(parentRole)
      currentRole = parentRole
    } else {
      break
    }
  }

  return inheritedRoles
}

interface PermissionSource {
  role: string
  group: string
  conditions?: Record<string, PermissionCondition>
}

export function getRolePermissions(
  role: string,
  config: PermissionsConfig,
): Map<string, ResolvedTablePermissions> {
  const rolePermissions = new Map<string, ResolvedTablePermissions>()
  const inheritedRoles = getInheritedRoles(role, config)
  const allRoles = [role, ...inheritedRoles]

  for (const currentRole of allRoles) {
    const roleConfig = config.roles[currentRole]

    // Handle all_tables permissions
    if (roleConfig.all_tables) {
      for (const tableGroup of Object.values(config.table_groups)) {
        for (const table of tableGroup.tables) {
          if (!rolePermissions.has(table)) {
            rolePermissions.set(table, {
              permissions: roleConfig.all_tables.permissions,
              conditions: roleConfig.all_tables.conditions,
              source: {
                role: currentRole,
                group: 'all_tables',
              },
            })
          }
        }
      }
    }

    // Handle specific table groups
    for (const [groupKey, groupConfig] of Object.entries(roleConfig)) {
      if (groupKey === 'inherit_from' || !groupConfig || !('permissions' in groupConfig)) {
        continue
      }

      const tableGroup = config.table_groups[groupKey]
      if (tableGroup) {
        for (const table of tableGroup.tables) {
          if (!rolePermissions.has(table)) {
            rolePermissions.set(table, {
              permissions: groupConfig.permissions,
              conditions: groupConfig.conditions,
              source: {
                role: currentRole,
                group: groupKey,
              },
            })
          }
        }
      }
    }
  }

  return rolePermissions
}

export function generateTestsFromPermissions(permissionsJson: PermissionsConfig): RLSTest[] {
  const tests: RLSTest[] = []

  // Create test context with default values
  const context: TestDataContext = {
    userId: TEST_USERS.NORMAL_USER.id,
    role: 'user',
    contentIds: { ...DEFAULT_TEST_IDS.contents },
    categoryIds: [...DEFAULT_TEST_IDS.categories],
    tagIds: [...DEFAULT_TEST_IDS.tags],
  }

  for (const roleName in permissionsJson.roles) {
    const rolePermissions = getRolePermissions(roleName, permissionsJson)

    // Process each table's permissions
    for (const [table, tablePermissions] of rolePermissions) {
      const tableGroup = Object.entries(permissionsJson.table_groups).find(([_, group]) =>
        group.tables.includes(table),
      )?.[0]

      if (!tableGroup) continue

      // Create test cases with the context
      const testCases = createTestCasesForTable(
        table as SchemaKey,
        roleName,
        tablePermissions.permissions,
        context,
        tablePermissions.conditions,
      )

      if (testCases.length > 0) {
        tests.push({
          table,
          group: tableGroup as RLSTest['group'],
          policies: createPoliciesForTable(table, tablePermissions, tablePermissions.conditions),
          tests: testCases,
        })
      }
    }
  }

  return tests
}

function createTestCasesForTable(
  table: SchemaKey,
  role: string,
  permissions: Permission[],
  context: TestDataContext,
  conditions?: Record<string, PermissionCondition>,
): RLSTestCase[] {
  const testCases: RLSTestCase[] = []

  for (const operation of permissions) {
    const data = generateTestData(table, {
      user_id: context.userId,
      is_active: true,
      is_public: false,
    })

    if (conditions?.[operation]) {
      // Test case for user's own data
      testCases.push({
        operation: operation.toUpperCase() as Operation,
        role,
        expectedResult: 'success',
        description: `${role} should be able to ${operation} their own ${table}`,
        context: { userId: context.userId },
        setup: {
          data: [{ ...data, user_id: context.userId }],
        },
      })

      // Test case for other user's data
      testCases.push({
        operation: operation.toUpperCase() as Operation,
        role,
        expectedResult: 'failure',
        description: `${role} should not be able to ${operation} others' ${table}`,
        context: { userId: context.userId },
        setup: {
          data: [{ ...data, user_id: 'other-user-id' }],
        },
      })
    } else {
      testCases.push({
        operation: operation.toUpperCase() as Operation,
        role,
        expectedResult: 'success',
        description: `${role} should be able to ${operation} on ${table}`,
        context: { userId: context.userId },
        setup: { data: [data] },
      })
    }
  }

  return testCases
}
