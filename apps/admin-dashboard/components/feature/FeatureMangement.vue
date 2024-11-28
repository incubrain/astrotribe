<!-- components/admin/FeatureManagement.vue -->
<script setup lang="ts">
interface Feature {
  id: string
  title: string
  description: string
  status: 'planned' | 'in_progress' | 'completed'
  priority: number
  created_at: string
  updated_at: string
}

const features = ref<Feature[]>([])
const isLoading = ref(true)
const showAddForm = ref(false)
const selectedFeature = ref<Feature | null>(null)

const fetchFeatures = async () => {
  try {
    const { data } = await useFetch('/api/admin/features/list')
    features.value = data.value as Feature[]
  } catch (error) {
    console.error('Error fetching features:', error)
  } finally {
    isLoading.value = false
  }
}

const handleDelete = async (id: string) => {
  try {
    await $fetch('/api/admin/features/delete', {
      method: 'DELETE',
      body: { id },
    })
    features.value = features.value.filter((f) => f.id !== id)
  } catch (error) {
    console.error('Error deleting feature:', error)
  }
}

const handleEdit = (feature: Feature) => {
  selectedFeature.value = feature
  showAddForm.value = true
}

const handleFormClose = () => {
  selectedFeature.value = null
  showAddForm.value = false
  fetchFeatures()
}

onMounted(() => {
  fetchFeatures()
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold">Feature Management</h2>
      <PrimeButton @click="showAddForm = true">Add Feature</PrimeButton>
    </div>

    <PrimeDialog
      v-model:visible="showAddForm"
      :modal="true"
      :header="selectedFeature ? 'Edit Feature' : 'Add Feature'"
      :style="{ width: '50vw' }"
    >
      <FeatureForm
        :feature="selectedFeature"
        @close="handleFormClose"
      />
    </PrimeDialog>

    <div
      v-if="isLoading"
      class="space-y-4"
    >
      <div
        v-for="n in 3"
        :key="n"
        class="h-24 animate-pulse bg-gray-800 rounded-lg"
      />
    </div>

    <div
      v-else
      class="space-y-4"
    >
      <div
        v-for="feature in features"
        :key="feature.id"
        class="bg-gray-800 rounded-lg p-4 space-y-2"
      >
        <div class="flex items-start justify-between">
          <div>
            <h3 class="text-lg font-medium">{{ feature.title }}</h3>
            <p class="text-gray-400">{{ feature.description }}</p>
          </div>
          <div class="flex items-center gap-2">
            <span
              class="px-3 py-1 text-sm rounded-full"
              :class="{
                'bg-blue-500/10 text-blue-400': feature.status === 'planned',
                'bg-yellow-500/10 text-yellow-400': feature.status === 'in_progress',
                'bg-green-500/10 text-green-400': feature.status === 'completed',
              }"
            >
              {{ feature.status.replace('_', ' ') }}
            </span>
            <button
              @click="handleEdit(feature)"
              class="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Icon name="mdi:pencil" />
            </button>
            <button
              @click="handleDelete(feature.id)"
              class="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors"
            >
              <Icon name="mdi:delete" />
            </button>
          </div>
        </div>
        <div class="text-sm text-gray-500"> Priority: {{ feature.priority }} </div>
      </div>
    </div>
  </div>
</template>
