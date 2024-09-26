<script setup lang="ts">
import Select from 'primevue/select'
import DatePicker from 'primevue/datepicker'
import { z } from 'zod'
import { createCRUDComposable, type CRUDOptions } from '../composables/crud-factory'
import { createAdminDashboard } from '../composables/createAdminDashboard'

definePageMeta({
  layoutTransition: false,
  name: 'Users',
})

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
  'super_admin',
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
  role: app_role_enum.optional(),
})

// Infer TypeScript type from Zod schema
type UserProfile = z.infer<typeof userProfileSchema>

const createDateEditor = () => {
  return (slotProps: any) =>
    h(DatePicker, {
      'modelValue': slotProps.data[slotProps.field],
      'onUpdate:modelValue': (value: any) => {
        slotProps.data[slotProps.field] = value
      },
      'editorSaveCallback': slotProps.editorSaveCallback,
    })
}

const createSelectEditor = (options: any[], placeholder: string) => {
  return (slotProps: any) =>
    h(Select, {
      'modelValue': slotProps.data[slotProps.field],
      'onUpdate:modelValue': (value: any) => {
        slotProps.data[slotProps.field] = value
      },
      options,
      placeholder,
      'editorSaveCallback': slotProps.editorSaveCallback,
    })
}

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
  },
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
    editComponent: createDateEditor(),
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
    editComponent: createSelectEditor(app_plan_enum.options, 'Select a Plan'),
  },
  {
    field: 'role',
    header: 'Role',
    sortable: true,
    editComponent: createSelectEditor(app_role_enum.options, 'Select a Role'),
  },
]

const UserProfilesAdminDashboard = createAdminDashboard(
  'userProfiles',
  userColumns,
  useUserProfiles,
)
</script>

<template>
  <div class="border-color h-full overflow-scroll rounded-lg border">
    <UserProfilesAdminDashboard>
      <template #title>
        <div class="flex items-center">
          <h2 class="text-2xl font-bold mr-4">Custom Title</h2>
        </div>
      </template>
    </UserProfilesAdminDashboard>
  </div>
</template>

<style scoped></style>
