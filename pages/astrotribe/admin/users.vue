<script setup lang="ts">
import {
  createCRUDComposable,
  type CRUDOptions
} from '@/composables/base/crud-factory.base.composable'
import { createAdminDashboard } from '~/components/IB/createAdminDashboard'
import Select from 'primevue/select'
import DatePicker from 'primevue/datepicker'

import { z } from 'zod'

const app_plan_enum = z.enum(['free', 'basic', 'intermediate', 'premium', 'enterprise', 'custom'])

const app_role_enum = z.enum([
  'guest',
  'user',
  'astroguide',
  'mentor',
  'moderator',
  'tenant_member',
  'tenant_admin',
  'tenant_super_admin',
  'admin',
  'super_admin'
])

const userProfileSchema = z.object({
  id: z.string(),
  email: z.string().email().optional(),
  given_name: z.string().nullable().optional(),
  surname: z.string().nullable().optional(),
  username: z.string().nullable().optional(),
  dob: z.date().nullable().optional(),
  gender_id: z.string().nullable().optional(),
  created_at: z.date().nullable().optional(),
  updated_at: z.date().nullable().optional(),
  last_seen: z.date().nullable().optional(),
  avatar: z.string().nullable().optional(),
  introduction: z.string().nullable().optional(),
  quote: z.string().nullable().optional(),
  followed_count: z.number().nullable().optional(),
  followers_count: z.number().nullable().optional(),
  plan: app_plan_enum.nullable().optional(),
  role: app_role_enum.optional()
})

// Infer TypeScript type from Zod schema
type UserProfile = z.infer<typeof userProfileSchema>

const userProfileOptions: CRUDOptions<UserProfile> = {
  orderBy: { column: 'created_at' as keyof UserProfile, ascending: false },
  customSelectLogic: (data: UserProfile[]) => data.filter((user) => user.role !== 'super_admin'),
  validateInsert: (data: Omit<UserProfile, 'id'>) => {
    const result = userProfileSchema.omit({ id: true }).safeParse(data)
    return result.success
  },
  validateUpdate: (data: Partial<UserProfile>) => {
    const result = userProfileSchema.partial().safeParse(data)
    return result.success
  },
  afterUpdate: async (updatedUser: UserProfile) => {
    // Perform actions after update, e.g., send notification
    console.log('User updated:', updatedUser)
  }
}

const useUserProfiles = createCRUDComposable<UserProfile>('user_profiles', userProfileOptions)

const userColumns = [
  { field: 'email', header: 'Email', sortable: true },
  { field: 'given_name', header: 'First Name', sortable: true },
  { field: 'surname', header: 'Last Name', sortable: true },
  { field: 'username', header: 'Username', sortable: true },
  {
    field: 'dob',
    header: 'Date of Birth',
    sortable: true,
    editComponent: (item: UserProfile, field: keyof UserProfile) =>
      h(DatePicker, {
        modelValue: item[field] as Date,
        'onUpdate:modelValue': (value: Date) => (item[field] = value),
        dateFormat: 'yy-mm-dd'
      })
  },
  { field: 'gender_id', header: 'Gender ID', sortable: true },
  { field: 'created_at', header: 'Created At', sortable: true },
  { field: 'last_seen', header: 'Last Seen', sortable: true },
  { field: 'avatar', header: 'Avatar' },
  { field: 'introduction', header: 'Introduction' },
  { field: 'quote', header: 'Quote' },
  { field: 'followed_count', header: 'Followed Count', sortable: true },
  { field: 'followers_count', header: 'Followers Count', sortable: true },
  {
    field: 'plan',
    header: 'Plan',
    sortable: true,
    editComponent: (item: UserProfile, field: keyof UserProfile) =>
      h(Select, {
        modelValue: item[field],
        'onUpdate:modelValue': (value: typeof app_plan_enum._type | null) => (item[field] = value),
        options: app_plan_enum.options,
        placeholder: 'Select a Plan'
      })
  },
  {
    field: 'role',
    header: 'Role',
    sortable: true,
    editComponent: (item: UserProfile, field: keyof UserProfile) =>
      h(Select, {
        modelValue: item[field],
        'onUpdate:modelValue': (value: typeof app_role_enum._type) => (item[field] = value),
        options: app_role_enum.options,
        placeholder: 'Select a Role'
      })
  }
]

const UserProfilesAdminDashboard = createAdminDashboard(
  'userProfiles',
  userColumns,
  useUserProfiles
)

definePageMeta({
  layoutTransition: false,
  name: 'Users',
  middleware: 'is-admin'
})
</script>

<template>
  <div class="border-color h-full overflow-scroll rounded-lg border">
    <UserProfilesAdminDashboard />
  </div>
</template>

<style scoped></style>
