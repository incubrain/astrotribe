<!-- components/admin/table/TableHeader.vue -->
<template>
  <div class="px-6 py-4 border-b border-color">
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-lg font-medium text-foreground">Table name = {{ tableName }}</h2>
        <p class="text-sm text-muted-foreground">
          {{ selectedCount }} of {{ totalCount }} rows selected
        </p>
      </div>
      <div class="flex items-center gap-2">
        <PrimeButton
          severity="secondary"
          size="small"
          @click="$emit('add-row')"
        >
          Add Row
        </PrimeButton>
        <PrimeButton
          v-if="selectedCount > 0"
          severity="danger"
          size="small"
          @click="$emit('delete-selected')"
        >
          Delete Selected
        </PrimeButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  tableName: string
  selectedCount: number
  totalCount: number
}>()

defineEmits<{
  'add-row': []
  'delete-selected': []
}>()
</script>
