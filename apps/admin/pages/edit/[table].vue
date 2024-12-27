<!-- pages/edit/[table].vue -->
<template>
  <Table :table-name="tableName" />
</template>

<script setup lang="ts">
const route = useRoute()
const tableName = computed(() => route.params.table as string)

// Redirect to table selection if no table is selected
if (!route.params.table) {
  await navigateTo('/edit')
}
</script>
