<script setup lang="ts">
const admin = useAdmin()

const roles = [
  { label: 'User', value: 'user' },
  { label: 'Admin', value: 'admin' },
  { label: 'Super Admin', value: 'super_admin' }
]

interface Column {
  field: string
  header: string
  style: string
  editor?: string
  editorProps?: Record<string, unknown>
}

const columns: Column[] = [
  { field: 'id', header: 'ID', style: 'width: 5%' },
  { field: 'email', header: 'Email', style: 'width: 10%', editor: 'PrimeInputText' },
  { field: 'given_name', header: 'First Name', style: 'width: 10%', editor: 'PrimeInputText' },
  { field: 'surname', header: 'Last Name', style: 'width: 10%', editor: 'PrimeInputText' },
  { field: 'username', header: 'Username', style: 'width: 10%', editor: 'PrimeInputText' },
  { field: 'dob', header: 'Date of Birth', style: 'width: 10%', editor: 'PrimeInputText' },
  { field: 'gender_id', header: 'Gender ID', style: 'width: 5%', editor: 'PrimeInputNumber' },
  { field: 'created_at', header: 'Created At', style: 'width: 10%', editor: 'PrimeInputText' },
  { field: 'last_seen', header: 'Last Seen', style: 'width: 10%', editor: 'PrimeInputText' },
  { field: 'avatar', header: 'Avatar', style: 'width: 10%', editor: 'PrimeInputText' },
  { field: 'plan', header: 'Plan', style: 'width: 10%', editor: 'PrimeInputText' },
  {
    field: 'role',
    header: 'Role',
    style: 'width: 10%',
    editor: 'PrimeSelect',
    editorProps: {
      options: roles,
      optionLabel: 'label',
      optionValue: 'value',
      placeholder: 'Select a Role'
    }
  }
]

const userProfiles = false


const handleRowEditSave = async ({ data, newData }) => {
  console.log('handleRowEditSave', data, newData)
  await admin.updateUser(newData, data.id)
}

const filters = ref({
  global: { value: null, matchMode: 'contains' },
  given_name: { value: null, matchMode: 'startsWith' },
  surname: { value: null, matchMode: 'startsWith' },
  email: { value: null, matchMode: 'startsWith' },
  role: { value: null, matchMode: 'startsWith' }
})

definePageMeta({
  layoutTransition: false,
  name: 'Manage-Users',
  middleware: 'is-admin'
})
</script>

<template>
  <div class="border-color h-full overflow-scroll rounded-lg border">
    <BaseTableAdmin
      v-if="userProfiles"
      :columns="columns"
      :table-data="userProfiles"1
      :filters="filters"
      :filter-fields="['given_name', 'surname', 'email', 'role']"
      @saved-edit="handleRowEditSave"
    >
      <template #header>
        <h3 class="text-lg font-semibold"> Manage Users</h3>
      </template>
    </BaseTableAdmin>
  </div>
</template>

<style scoped></style>
