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
      <!-- Permissions Table -->
      <div class="rounded-lg shadow">
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
                v-for="permission in rolePermissions"
                :key="permission.table_name"
              >
                <td class="px-4 py-3 text-sm">
                  {{ formatTableName(permission.table_name) }}
                </td>
                <td class="px-4 py-3 text-center">
                  <div class="flex justify-center items-center">
                    <PrimeCheckbox
                      :model-value="permission.permissions.select"
                      disabled
                      binary
                    />
                    <PrimeTag
                      v-if="isInheritedPermission(permission.table_name, 'select')"
                      value="Inherited"
                      severity="info"
                      class="ml-2 text-xs"
                    />
                  </div>
                </td>
                <td class="px-4 py-3 text-center">
                  <div class="flex justify-center items-center">
                    <PrimeCheckbox
                      :model-value="permission.permissions.insert"
                      disabled
                      binary
                    />
                    <PrimeTag
                      v-if="isInheritedPermission(permission.table_name, 'insert')"
                      value="Inherited"
                      severity="info"
                      class="ml-2 text-xs"
                    />
                  </div>
                </td>
                <td class="px-4 py-3 text-center">
                  <div class="flex justify-center items-center">
                    <PrimeCheckbox
                      :model-value="permission.permissions.update"
                      disabled
                      binary
                    />
                    <PrimeTag
                      v-if="isInheritedPermission(permission.table_name, 'update')"
                      value="Inherited"
                      severity="info"
                      class="ml-2 text-xs"
                    />
                  </div>
                </td>
                <td class="px-4 py-3 text-center">
                  <div class="flex justify-center items-center">
                    <PrimeCheckbox
                      :model-value="permission.permissions.delete"
                      disabled
                      binary
                    />
                    <PrimeTag
                      v-if="isInheritedPermission(permission.table_name, 'delete')"
                      value="Inherited"
                      severity="info"
                      class="ml-2 text-xs"
                    />
                  </div>
                </td>
                <td class="px-4 py-3 text-sm">
                  <div
                    v-if="permission.conditions"
                    class="text-xs"
                  >
                    <PrimeButton
                      v-tooltip.bottom="JSON.stringify(permission.conditions, null, 2)"
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
import { useSupabaseClient } from '#imports'

interface Role {
  label: string
  value: string
}

interface RolePermission {
  id: number
  role: string
  inherit_from: string[]
  table_name: string
  permissions: {
    delete: boolean
    insert: boolean
    select: boolean
    update: boolean
  }
  conditions: Record<string, any>
  last_updated: string
}

const supabase = useSupabaseClient()
const selectedRole = ref<Role | null>(null)
const permissionsData = ref<RolePermission[]>([])
const loading = ref(false)

// Role hierarchy
const roleHierarchy = [
  { role: 'super_admin' },
  { role: 'admin', inheritsFrom: 'super_admin' },
  { role: 'moderator', inheritsFrom: 'admin' },
  { role: 'user', inheritsFrom: 'moderator' },
  { role: 'guest', inheritsFrom: 'user' },
]

// Get all ancestor roles including the current role
function getAllAncestorRoles(role: string): string[] {
  const ancestors = [role]
  let currentRole = role

  while (currentRole) {
    const parent = roleHierarchy.find((r) => r.role === currentRole)?.inheritsFrom
    if (parent) {
      ancestors.push(parent)
      currentRole = parent
    } else {
      break
    }
  }

  return ancestors
}

// Check if a role has a permission (including inherited)
function hasPermission(
  tableName: string,
  action: 'select' | 'update' | 'delete' | 'insert',
): boolean {
  if (!selectedRole.value) return false

  const allRoles = getAllAncestorRoles(selectedRole.value.value)

  return permissionsData.value.some(
    (permission) =>
      allRoles.includes(permission.role) &&
      permission.table_name === tableName &&
      permission.permissions?.[action],
  )
}

// Check if a permission is inherited
function isInheritedPermission(
  tableName: string,
  action: 'select' | 'update' | 'delete' | 'insert',
): boolean {
  if (!selectedRole.value) return false

  // Check if permission exists directly on the role
  const directPermission = permissionsData.value.find(
    (p) =>
      p.role === selectedRole.value?.value && p.table_name === tableName && p.permissions?.[action],
  )

  if (directPermission) return false

  // If we have the permission but not directly, it must be inherited
  return hasPermission(tableName, action)
}

async function fetchPermissions() {
  loading.value = true
  try {
    const { data, error } = await supabase.from('role_permissions').select('*').order('table_name')

    if (error) throw error
    permissionsData.value = data
  } catch (error) {
    console.error('Error fetching permissions:', error)
  } finally {
    loading.value = false
  }
}

// Transform roles into dropdown options
const roles = computed(() => {
  if (!permissionsData.value) return []

  const uniqueRoles = new Set(permissionsData.value.map((p) => p.role))
  return Array.from(uniqueRoles).map((role) => ({
    label: formatRoleName(role),
    value: role,
  }))
})

// Get all permissions for the selected role (including inherited)
const rolePermissions = computed(() => {
  if (!selectedRole.value || !permissionsData.value) return []

  // Get all unique table names
  const tableNames = new Set(permissionsData.value.map((p) => p.table_name))

  // For each table, combine direct and inherited permissions
  return Array.from(tableNames).map((tableName) => ({
    table_name: tableName,
    permissions: {
      select: hasPermission(tableName, 'select'),
      insert: hasPermission(tableName, 'insert'),
      update: hasPermission(tableName, 'update'),
      delete: hasPermission(tableName, 'delete'),
    },
    conditions: getConditions(tableName),
  }))
})

// Get conditions for a table
function getConditions(tableName: string): Record<string, any> | null {
  if (!selectedRole.value) return null

  const allRoles = getAllAncestorRoles(selectedRole.value.value)

  // Find first matching permission with conditions
  const permissionWithConditions = permissionsData.value.find(
    (permission) =>
      allRoles.includes(permission.role) &&
      permission.table_name === tableName &&
      permission.conditions &&
      Object.keys(permission.conditions).length > 0,
  )

  return permissionWithConditions?.conditions || null
}

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

onMounted(() => {
  fetchPermissions()
})
</script>
