<!-- components/admin/FeatureForm.vue -->
<script setup lang="ts">
interface Feature {
  id?: string
  title: string
  description: string
  status: 'planned' | 'in_progress' | 'completed'
  priority: number
}

const props = defineProps<{
  feature?: Feature | null
}>()

const emit = defineEmits<{
  close: []
}>()

const form = reactive({
  title: props.feature?.title || '',
  description: props.feature?.description || '',
  status: props.feature?.status || 'planned',
  priority: props.feature?.priority || 0,
})

const statusOptions = [
  { label: 'Planned', value: 'planned' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Completed', value: 'completed' },
]

const isSubmitting = ref(false)

const handleSubmit = async () => {
  try {
    isSubmitting.value = true
    const endpoint = props.feature ? '/api/admin/features/update' : '/api/admin/features/create'

    await $fetch(endpoint, {
      method: props.feature ? 'PUT' : 'POST',
      body: {
        ...form,
        id: props.feature?.id,
      },
    })

    emit('close')
  } catch (error) {
    console.error('Error submitting feature:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <form
    @submit.prevent="handleSubmit"
    class="space-y-4"
  >
    <div class="space-y-2">
      <label class="block text-sm font-medium">Title</label>
      <PrimeInputText
        v-model="form.title"
        class="w-full"
        required
      />
    </div>

    <div class="space-y-2">
      <label class="block text-sm font-medium">Description</label>
      <PrimeTextarea
        v-model="form.description"
        class="w-full"
        rows="3"
        required
      />
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div class="space-y-2">
        <label class="block text-sm font-medium">Status</label>
        <PrimeSelect
          v-model="form.status"
          :options="statusOptions"
          optionLabel="label"
          optionValue="value"
          class="w-full"
        />
      </div>

      <div class="space-y-2">
        <label class="block text-sm font-medium">Priority</label>
        <PrimeInputNumber
          v-model="form.priority"
          class="w-full"
          :min="0"
          :max="100"
        />
      </div>
    </div>

    <div class="flex justify-end gap-2 pt-4">
      <PrimeButton
        type="button"
        severity="secondary"
        @click="emit('close')"
      >
        Cancel
      </PrimeButton>
      <PrimeButton
        type="submit"
        :loading="isSubmitting"
      >
        {{ feature ? 'Update' : 'Create' }}
      </PrimeButton>
    </div>
  </form>
</template>
