<template>
  <div class="flex items-center justify-between gap-2 w-full">
    <UBadge
    class="flex gap-2"
      color="primary"
      variant="soft"
    >
    {{ feature }}:
      <UToggle
        v-model="settings[feature]"
        @change="admin.toggleFeature(feature, !settings[feature])"
      />
    </UBadge>
  </div>
</template>

<script setup lang="ts">
import { Settings } from '@/types/testing'

defineProps({
  feature: {
    type: String as PropType<keyof Settings>,
    required: true
  }
})

const admin = useTestingStore()
const { settings } = storeToRefs(admin)
</script>

<style scoped>
/* Add any necessary styling here */
</style>
