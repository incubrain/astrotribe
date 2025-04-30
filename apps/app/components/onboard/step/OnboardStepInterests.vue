<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { FormInstance } from '@primevue/forms'
import { useOnboardingStore } from '@/stores/useOnboardingStore'
import { useCategoryTagStore } from '@/stores/useCategoryTagStore'

defineProps<{ form: FormInstance }>()

const categoryTagStore = useCategoryTagStore()

const isLoading = ref(true)

// Options for selectable cards
const categoryOptions = computed(() => {
  return categoryTagStore.categories.map((category) => ({
    value: category.id,
    label: category.name,
    description: category.body || '',
  }))
})

onMounted(async () => {
  try {
    await categoryTagStore.getCategories()
  } catch (error) {
    console.error('Error loading categories:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="interests-step">
    <h2 class="text-2xl font-bold mb-2">What topics are you interested in?</h2>
    <p class="text-gray-400 mb-6">Select categories that match your interests.</p>

    <!-- Loading state -->
    <div
      v-if="isLoading"
      class="flex justify-center my-8"
    >
      <PrimeProgressSpinner />
    </div>

    <!-- Form content -->
    <div v-else>
      <FormSelectableCardField
        name="interests"
        :options="categoryOptions"
        :multiple="true"
      >
        <template #card-content="{ option, selected }">
          <div class="flex items-center gap-3 p-2">
            <div class="w-6 h-6 flex items-center justify-center">
              <Icon
                :name="selected ? 'mdi:check-circle' : 'mdi:circle-outline'"
                size="24px"
                :class="selected ? 'text-primary-500' : 'text-gray-400'"
              />
            </div>
            <div>
              <h3 class="text-lg font-medium">{{ option.label }}</h3>
              <p
                v-if="option.description"
                class="text-sm text-gray-400"
              >
                {{ option.description }}
              </p>
            </div>
          </div>
        </template>
      </FormSelectableCardField>
    </div>
  </div>
</template>
