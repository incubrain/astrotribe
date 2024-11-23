<template>
  <div class="p-6">
    <div class="mb-8">
      <h1 class="text-2xl font-semibold mb-2">Role-Based Access Control</h1>
      <p class="">View and manage system permissions for different roles</p>
    </div>

    <!-- Role Hierarchy Visualization -->
    <div class="mb-8 p-4 rounded-lg border border-color">
      <h2 class="text-lg font-medium mb-4">Role Inheritance Flow</h2>
      <div class="flex items-center justify-start">
        <template
          v-for="(level, index) in roleHierarchy"
          :key="index"
        >
          <div class="flex flex-row gap-4 items-center">
            <div
              class="py-2 px-3 rounded-lg text-center font-medium"
              :class="selectedRole?.value === level.role ? 'bg-primary text-white' : 'background'"
            >
              {{ formatRoleName(level.role) }}
            </div>
            <div
              v-if="level.inheritsFrom"
              class="text-sm text-center uppercase"
            >
              inherits
            </div>
          </div>
          <div
            v-if="index < roleHierarchy.length - 1"
            class="pr-4 pl-1 flex"
          >
            <Icon name="mdi:arrow-right" />
          </div>
        </template>
      </div>
    </div>

    <!-- Role selector -->
    <PrimeSelect
      v-model="selectedRole"
      :options="roles"
      option-label="label"
      class="w-64 mb-6"
      placeholder="Select a role"
    />

    <div
      v-if="selectedRole"
      class="space-y-8"
    >
      <!-- Table Groups -->
      <div
        v-for="(group, groupKey) in tableGroups"
        :key="groupKey"
        class="rounded-lg shadow"
      >
        <div class="border-b border-color p-4">
          <h2 class="text-lg font-medium">{{ formatGroupName(groupKey) }}</h2>
          <p class="text-sm">{{ group.description }}</p>
          <div class="flex items-center mt-2 space-x-2">
            <PrimeBadge
              :value="group.audit_level"
              :severity="getAuditLevelSeverity(group.audit_level)"
            />
            <PrimeBadge
              v-if="group.requires_user_check"
              value="Requires User Check"
              severity="warning"
            />
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divider-color">
            <thead class="background">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-1/4">
                  Table Name
                </th>
                <th class="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider">
                  Select
                </th>
                <th class="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider">
                  Insert
                </th>
                <th class="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider">
                  Update
                </th>
                <th class="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider">
                  Delete
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Conditions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divider-color">
              <tr
                v-for="table in group.tables"
                :key="table"
              >
                <td class="px-4 py-3 text-sm">
                  {{ formatTableName(table) }}
                </td>
                <td class="px-4 py-3 text-center">
                  <div class="flex justify-center items-center">
                    <PrimeCheckbox
                      :model-value="hasPermission(table, 'select')"
                      disabled
                      binary
                    />
                    <PrimeTag
                      v-if="isInheritedPermission(table, 'select')"
                      value="Inherited"
                      severity="info"
                      class="ml-2 text-xs"
                    />
                  </div>
                </td>
                <td class="px-4 py-3 text-center">
                  <div class="flex justify-center items-center">
                    <PrimeCheckbox
                      :model-value="hasPermission(table, 'insert')"
                      disabled
                      binary
                    />
                    <PrimeTag
                      v-if="isInheritedPermission(table, 'insert')"
                      value="Inherited"
                      severity="info"
                      class="ml-2 text-xs"
                    />
                  </div>
                </td>
                <td class="px-4 py-3 text-center">
                  <div class="flex justify-center items-center">
                    <PrimeCheckbox
                      :model-value="hasPermission(table, 'update')"
                      disabled
                      binary
                    />
                    <PrimeTag
                      v-if="isInheritedPermission(table, 'update')"
                      value="Inherited"
                      severity="info"
                      class="ml-2 text-xs"
                    />
                  </div>
                </td>
                <td class="px-4 py-3 text-center">
                  <div class="flex justify-center items-center">
                    <PrimeCheckbox
                      :model-value="hasPermission(table, 'delete')"
                      disabled
                      binary
                    />
                    <PrimeTag
                      v-if="isInheritedPermission(table, 'delete')"
                      value="Inherited"
                      severity="info"
                      class="ml-2 text-xs"
                    />
                  </div>
                </td>
                <td class="px-4 py-3 text-sm">
                  <div
                    v-if="getConditions(table)"
                    class="text-xs"
                  >
                    <PrimeButton
                      v-tooltip.bottom="getConditions(table)"
                      icon="pi pi-info-circle"
                      text
                      severity="info"
                      class="p-0"
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div
      v-else
      class="text-center py-12 background rounded-lg"
    >
      <p class="">Select a role to view its permissions</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import permissionsConfig from '../../../generated/role-permissions.json'

interface Role {
  label: string
  value: string
}

interface RoleHierarchyLevel {
  role: string
  inheritsFrom?: string
}

const selectedRole = ref<Role | null>(null)

// Define role hierarchy
const roleHierarchy = [
  { role: 'super_admin' },
  { role: 'admin', inheritsFrom: 'super_admin' },
  { role: 'moderator', inheritsFrom: 'admin' },
  { role: 'user', inheritsFrom: 'guest' },
  { role: 'guest' },
]

// Transform roles into dropdown options
const roles = computed(() => {
  return Object.keys(permissionsConfig.roles).map((role) => ({
    label: formatRoleName(role),
    value: role,
  }))
})

const tableGroups = computed(() => {
  return permissionsConfig.table_groups
})

// Get inherited roles for a given role
function getInheritedRoles(role: string): string[] {
  const inherited: string[] = []
  let currentRole = role

  while (currentRole) {
    const hierarchyEntry = roleHierarchy.find((r) => r.role === currentRole)
    if (hierarchyEntry?.inheritsFrom) {
      inherited.push(hierarchyEntry.inheritsFrom)
      currentRole = hierarchyEntry.inheritsFrom
    } else {
      break
    }
  }

  return inherited
}

// Get permissions for selected role and table, including inherited permissions
function hasPermission(tableName: string, action: string): boolean {
  if (!selectedRole.value) return false

  const currentRole = selectedRole.value.value
  const inheritedRoles = getInheritedRoles(currentRole)
  const rolesToCheck = [currentRole, ...inheritedRoles]

  for (const roleToCheck of rolesToCheck) {
    const role = permissionsConfig.roles[roleToCheck]

    // Check if role has all_tables permission
    if (role.all_tables?.permissions.includes(action)) {
      return true
    }

    // Find the table group that contains this table
    for (const [groupKey, group] of Object.entries(permissionsConfig.table_groups)) {
      if (group.tables.includes(tableName)) {
        if (role[groupKey]?.permissions.includes(action)) {
          return true
        }
      }
    }
  }

  return false
}

// Check if a permission is inherited
function isInheritedPermission(tableName: string, action: string): boolean {
  if (!selectedRole.value) return false

  const currentRole = selectedRole.value.value
  const role = permissionsConfig.roles[currentRole]

  // Check direct permissions first
  if (role.all_tables?.permissions.includes(action)) {
    return false
  }

  for (const [groupKey, group] of Object.entries(permissionsConfig.table_groups)) {
    if (group.tables.includes(tableName)) {
      if (role[groupKey]?.permissions.includes(action)) {
        return false
      }
    }
  }

  // If we have the permission but it's not direct, it must be inherited
  return hasPermission(tableName, action)
}

// Get conditions for a table if any exist
function getConditions(tableName: string): string {
  if (!selectedRole.value) return ''

  const role = permissionsConfig.roles[selectedRole.value.value]

  // Find the table group that contains this table
  for (const [groupKey, group] of Object.entries(permissionsConfig.table_groups)) {
    if (group.tables.includes(tableName)) {
      const conditions = role[groupKey]?.conditions
      if (conditions) {
        return JSON.stringify(conditions, null, 2)
      }
    }
  }

  return ''
}

// Helper functions for formatting
function formatRoleName(role: string): string {
  return role
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function formatTableName(table: string): string {
  return table
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function formatGroupName(group: string): string {
  return group
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function getAuditLevelSeverity(level: string): string {
  const severityMap: Record<string, string> = {
    low: 'info',
    medium: 'warning',
    high: 'danger',
    critical: 'danger',
  }
  return severityMap[level] || 'info'
}

onMounted(() => {
  const userRole = roles.value.find((r) => r.value === 'user')
  if (userRole) {
    selectedRole.value = userRole
  }
})
</script>
