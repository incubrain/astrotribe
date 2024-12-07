<!-- components/admin/table/TableSearch.vue -->
<template>
  <div class="px-6 py-3 border-b border-color">
    <div class="flex items-center gap-3">
      <div class="relative flex-1">
        <span
          class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none opacity-50"
        >
          <i class="pi pi-search text-muted-foreground text-sm"></i>
        </span>
        <PrimeInputText
          v-model="modelValue.global.value"
          placeholder="Search all fields..."
          class="w-full pl-10 background border-color text-sm h-9"
          @update:model-value="$emit('update:filters', modelValue)"
        />
      </div>
      <PrimeButton
        icon="pi pi-refresh"
        :loading="loading"
        size="small"
        class="h-9"
        severity="secondary"
        text
        @click="$emit('refresh')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  filters: { global: { value: any } }
  loading: boolean
}>()

const modelValue = ref(props.filters)

defineEmits<{
  'update:filters': [value: { global: { value: any } }]
  'refresh': []
}>()
</script>
