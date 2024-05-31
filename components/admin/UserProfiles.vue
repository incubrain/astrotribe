<script setup lang="ts">
const editingRows = ref([])
const usersStore = useUsersStore()
const { userProfiles } = storeToRefs(usersStore)
const admin = useAdmin()

await usersStore.getManyUserProfiles()

const onRowEditSave = async (event) => {
  const { data, newData } = event

  // Update the user profile in Supabase
  await admin.updateUser(newData, data.id)

  usersStore.updateUserProfileState(data, newData)
}
</script>

<template>
  <div>
    <PrimeDataTable
      v-model:editingRows="editingRows"
      :value="userProfiles"
      editMode="row"
      dataKey="id"
      @row-edit-save="onRowEditSave"
      :pt="{
        table: { style: 'min-width: 50rem' },
        column: {
          bodycell: ({ state }) => ({
            style: state['d_editing'] && 'padding-top: 0.6rem; padding-bottom: 0.6rem'
          })
        }
      }"
    >
      <PrimeColumn
        field="id"
        header="ID"
        style="width: 10%"
      ></PrimeColumn>
      <PrimeColumn
        field="first_name"
        header="First Name"
        style="width: 20%"
      >
        <template #editor="{ data, field }">
          <PrimeInputText v-model="data[field]" />
        </template>
      </PrimeColumn>
      <PrimeColumn
        field="last_name"
        header="Last Name"
        style="width: 20%"
      >
        <template #editor="{ data, field }">
          <PrimeInputText v-model="data[field]" />
        </template>
      </PrimeColumn>
      <PrimeColumn
        field="email"
        header="Email"
        style="width: 30%"
      >
        <template #editor="{ data, field }">
          <PrimeInputText v-model="data[field]" />
        </template>
      </PrimeColumn>
      <PrimeColumn
        :rowEditor="true"
        style="width: 10%; min-width: 8rem"
        bodyStyle="text-align:center"
      ></PrimeColumn>
    </PrimeDataTable>
  </div>
</template>
