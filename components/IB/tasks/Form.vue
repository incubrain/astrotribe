<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  goal: Goal
  employees: Employee[]
  categories: { name: string; value: string }[],
  isNew: boolean
}>()

const emit = defineEmits<{
  (e: 'save', goal: Goal): void
  (e: 'delete', goal: Goal): void
}>()

const formData = ref({ ...props.goal })

watch(
  () => props.goal,
  (newGoal) => {
    formData.value = { ...newGoal }
  },
  { deep: true }
)

function handleSubmit() {
  emit('save', formData.value)
}
</script>

<template>
  <form
    @submit.prevent="handleSubmit"
    class="flex flex-col gap-4 text-sm"
  >
    <div class="flex flex-col gap-2">
      <label for="title">Goal Title</label>
      <PrimeInputText
        id="title"
        v-model="formData.title"
        placeholder="Goal title"
        required
      />
    </div>

    <div class="flex flex-col gap-2">
      <label for="date">Date</label>
      <PrimeDatePicker
        id="date"
        v-model="formData.date"
        dateFormat="yy-mm-dd"
        :showIcon="true"
        required
      />
    </div>

    <div class="flex flex-col gap-2">
      <label for="category">Category</label>
      <PrimeSelect
        id="category"
        v-model="formData.category"
        :options="categories"
        optionLabel="name"
        optionValue="value"
        placeholder="Select a category"
      />
    </div>

    <div class="flex flex-col gap-2">
      <label for="assignee">Assignee</label>
      <PrimeSelect
        id="assignee"
        v-model="formData.assigneeId"
        :options="employees"
        optionLabel="name"
        optionValue="id"
        placeholder="Select an assignee"
      />
    </div>

    <PrimeButton type="submit">
      {{ isNew ? 'Create Goal' : 'Update Goal' }}
    </PrimeButton>
    <PrimeButton
      v-if="!isNew"
      type="button"
      severity="danger"
      @click="$emit('delete', formData)"
    >
      Delete Goal
    </PrimeButton>
  </form>
</template>
