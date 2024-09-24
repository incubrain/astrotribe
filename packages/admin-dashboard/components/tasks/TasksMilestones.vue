<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  goals: Goal[]
  milestones: Milestone[]
}>()

const showMilestoneDetails = ref(false)
const selectedMilestone = ref<Milestone | null>(null)

const getTasksForMilestone = computed(
  () => (milestoneId: number) => props.goals.filter((goal) => goal.milestoneId === milestoneId),
)

function calculateMilestoneProgress(milestoneId: number) {
  const tasks = getTasksForMilestone.value(milestoneId)
  if (tasks.length === 0) return 0
  const totalProgress = tasks.reduce((sum, task) => sum + task.progress, 0)
  return Math.round(totalProgress / tasks.length)
}

function openMilestoneDetails(milestone: Milestone) {
  selectedMilestone.value = milestone
  showMilestoneDetails.value = true
}
</script>

<template>
  <div class="milestone-overview">
    <h2>Milestones</h2>
    <ul class="milestone-list">
      <li
        v-for="milestone in milestones"
        :key="milestone.id"
        class="milestone-item"
      >
        <div
          class="milestone-header"
          @click="openMilestoneDetails(milestone)"
        >
          <h3>{{ milestone.title }}</h3>
          <span>{{ getTasksForMilestone(milestone.id).length }} tasks</span>
        </div>
        <div class="progress-bar">
          <div
            class="progress"
            :style="{ width: `${calculateMilestoneProgress(milestone.id)}%` }"
          ></div>
        </div>
      </li>
    </ul>

    <PrimeDialog
      v-model:visible="showMilestoneDetails"
      :header="selectedMilestone?.title"
    >
      <div v-if="selectedMilestone">
        <p>{{ selectedMilestone.description }}</p>
        <h4>Tasks:</h4>
        <ul>
          <li
            v-for="task in getTasksForMilestone(selectedMilestone.id)"
            :key="task.id"
          >
            {{ task.title }} ({{ task.progress }}% complete)
          </li>
        </ul>
      </div>
    </PrimeDialog>
  </div>
</template>

<style scoped>
.milestone-list {
  list-style-type: none;
  padding: 0;
}

.milestone-item {
  margin-bottom: 10px;
}

.milestone-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.progress-bar {
  background-color: #056993;
  height: 20px;
  border-radius: 5px;
  overflow: hidden;
}

.progress {
  background-color: #4caf50;
  height: 100%;
}
</style>
