<script setup lang="ts">
interface Subtask {
  title: string
  completed: boolean
}

interface ExtendedGoal extends Goal {
  subtasks: Subtask[]
}

const props = defineProps<{
  goal: ExtendedGoal
  employees: Employee[]
  categories: { name: string; value: string }[]
  milestones: Milestone[]
  isNew: boolean
}>()

const emit = defineEmits<{
  (e: 'save', goal: Goal): void
  (e: 'delete', goal: Goal): void
  (e: 'updateSubtask', goalId: number, subtaskId: number, completed: boolean): void
}>()

const formData = ref<ExtendedGoal>({ ...props.goal, subtasks: props.goal.subtasks || [] })

watch(
  () => props.goal,
  (newGoal) => {
    formData.value = { ...newGoal, subtasks: newGoal.subtasks || [] }
  },
  { deep: true },
)

const progress = computed(() => {
  if (formData.value.subtasks.length === 0) return 0
  const completedSubtasks = formData.value.subtasks.filter((subtask) => subtask.completed).length
  return Math.round((completedSubtasks / formData.value.subtasks.length) * 100)
})

function handleSubmit() {
  emit('save', formData.value)
}

function updateSubtask(subtaskId: number, completed: boolean) {
  const subtask = formData.value.subtasks.find((st) => st.id === subtaskId)
  if (subtask) {
    subtask.completed = completed
    emit('updateSubtask', formData.value.id, subtaskId, completed)
  }
}

function addSubtask() {
  formData.value.subtasks.push({
    id: Date.now(), // Use a temporary ID
    title: '',
    completed: false,
  })
}

function removeSubtask(subtaskId: number) {
  formData.value.subtasks = formData.value.subtasks.filter((st) => st.id !== subtaskId)
}

function updateTimeSpent(time: number) {
  formData.value.timeSpent = time
}
</script>

<template>
  <form
    class="flex gap-6 text-sm"
    @submit.prevent="handleSubmit"
  >
    <!-- Left column: Title, Milestone, Description, and Subtasks -->
    <div class="flex-grow">
      <div class="mb-4">
        <PrimeInputText
          id="title"
          v-model="formData.title"
          placeholder="Goal title"
          class="w-full text-2xl font-bold"
          required
        />
      </div>

      <div class="mb-4">
        <label
          for="milestone"
          class="mb-2 flex items-center font-medium"
        >
          <Icon
            name="mdi:flag"
            class="mr-2"
          />
          Milestone
        </label>
        <PrimeSelect
          id="milestone"
          v-model="formData.milestoneId"
          :options="milestones"
          option-label="title"
          option-value="id"
          placeholder="Select a milestone"
          class="w-full"
        />
      </div>

      <div class="mb-4">
        <label
          for="description"
          class="mb-2 flex items-center font-medium"
        >
          <Icon
            name="mdi:text"
            class="mr-2"
          />
          Description
        </label>
        <PrimeTextarea
          id="description"
          v-model="formData.description"
          rows="6"
          auto-resize
          placeholder="Add a more detailed description..."
          class="w-full"
        />
      </div>

      <div class="mb-4">
        <h3 class="mb-2 flex items-center font-medium">
          <Icon
            name="mdi:checkbox-marked"
            class="mr-2"
          />
          Subtasks
        </h3>
        <ul class="space-y-2 pb-2">
          <li
            v-for="(subtask, index) in formData.subtasks"
            :key="index"
            class="flex items-center"
          >
            <PrimeCheckbox
              v-model="subtask.completed"
              :binary="true"
              class="mr-2"
              @change="updateSubtask(subtask.id, $event)"
            />
            <PrimeInputText
              v-model="subtask.title"
              class="flex-grow"
              placeholder="Subtask title"
            />
            <PrimeButton
              link
              @click="removeSubtask(index)"
            >
              <Icon
                name="mdi:trash"
                size="24px"
              />
            </PrimeButton>
          </li>
        </ul>
        <PrimeButton
          size="small"
          class="flex gap-2"
          @click="addSubtask"
        >
          <Icon
            name="mdi:plus"
            size="24px"
          />
          Add
        </PrimeButton>
      </div>
    </div>

    <!-- Right column: Other details -->
    <div class="w-64">
      <div class="mb-4">
        <label class="mb-2 flex items-center font-medium">
          <Icon
            name="mdi:progress-check"
            class="mr-2"
          />
          Progress
        </label>
        <PrimeProgressBar
          :value="progress"
          class="h-2"
        />
        <span class="text-sm text-gray-600">{{ progress }}% Complete</span>
      </div>

      <div class="mb-4">
        <label
          for="date"
          class="mb-2 flex items-center font-medium"
        >
          <Icon
            name="mdi:calendar"
            class="mr-2"
          />
          Due Date
        </label>
        <PrimeDatePicker
          id="date"
          v-model="formData.date"
          date-format="yy-mm-dd"
          :show-icon="true"
          class="w-full"
          required
        />
      </div>

      <div class="mb-4">
        <label
          for="category"
          class="mb-2 flex items-center font-medium"
        >
          <Icon
            name="mdi:tag"
            class="mr-2"
          />
          Category
        </label>
        <PrimeSelect
          id="category"
          v-model="formData.category"
          :options="categories"
          option-label="name"
          option-value="value"
          placeholder="Select a category"
          class="w-full"
        />
      </div>

      <div class="mb-4">
        <label
          for="priority"
          class="mb-2 flex items-center font-medium"
        >
          <Icon
            name="mdi:flag"
            class="mr-2"
          />
          Priority
        </label>
        <PrimeSelect
          id="priority"
          v-model="formData.priority"
          :options="[
            { label: 'Low', value: 'low' },
            { label: 'Medium', value: 'medium' },
            { label: 'High', value: 'high' },
          ]"
          option-label="label"
          option-value="value"
          placeholder="Select priority"
          class="w-full"
        />
      </div>

      <div class="mb-4">
        <label
          for="assignee"
          class="mb-2 flex items-center font-medium"
        >
          <Icon
            name="mdi:account"
            class="mr-2"
          />
          Assignee
        </label>
        <PrimeSelect
          id="assignee"
          v-model="formData.assigneeId"
          :options="employees"
          option-label="name"
          option-value="id"
          placeholder="Select an assignee"
          class="w-full"
        />
      </div>

      <div class="mb-4">
        <label class="mb-2 flex items-center font-medium">
          <Icon
            name="mdi:clock"
            class="mr-2"
          />
          Time Tracking
        </label>
        <IBTasksTimeTracker
          :goal="formData"
          @update:time-spent="updateTimeSpent"
        />
      </div>

      <div class="mt-6 flex justify-between">
        <PrimeButton
          type="submit"
          class="mr-2 w-full"
        >
          {{ isNew ? 'Create Goal' : 'Update Goal' }}
        </PrimeButton>
        <PrimeButton
          v-if="!isNew"
          type="button"
          severity="danger"
          class="ml-2 w-full"
          @click="$emit('delete', formData)"
        >
          Delete Goal
        </PrimeButton>
      </div>
    </div>
  </form>
</template>
