<script setup lang="ts">
import { ref, computed } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import multiMonthPlugin from '@fullcalendar/multimonth'

interface Goal {
  id: number
  title: string
  date: string
  category: 'financial' | 'metrics' | 'hiring' | 'events'
  completed: boolean
}

let nextId = 1

function createGoal(
  title: string,
  date: string,
  category: Goal['category'],
  completed = false
): Goal {
  return {
    id: nextId++,
    title,
    date,
    category,
    completed
  }
}

const goals = ref<Goal[]>([
  createGoal('Launch website and app (free version)', '2024-09-16', 'events'),
  createGoal('Achieve 20 news sources', '2024-09-30', 'metrics'),
  createGoal('Release first weekly video', '2024-10-15', 'events'),
  createGoal('Achieve 50 news sources', '2024-10-31', 'metrics'),
  createGoal('Reach 2,000 users', '2024-10-31', 'metrics'),
  createGoal('Launch basic subscription (500 INR/month)', '2024-11-01', 'financial'),
  createGoal('Achieve 100 news sources', '2024-11-30', 'metrics'),
  createGoal('Reach 4,000 users', '2024-11-30', 'metrics'),
  createGoal('Achieve 200 news sources', '2024-12-31', 'metrics'),
  createGoal('Reach 7,000 users', '2024-12-31', 'metrics'),
  createGoal('Launch pro subscription (2,000 INR/month)', '2025-01-01', 'financial'),
  createGoal('Achieve 500 news sources', '2025-01-31', 'metrics'),
  createGoal('Reach 10,000 users', '2025-01-31', 'metrics'),
  createGoal('Launch expert subscription (4,000 INR/month)', '2025-02-01', 'financial'),
  createGoal('Achieve 1,000 news sources', '2025-02-28', 'metrics'),
  createGoal('Reach 16,000 users', '2025-02-28', 'metrics'),
  createGoal('Achieve 2,000 news sources', '2025-03-31', 'metrics'),
  createGoal('Reach 20,000 users', '2025-03-31', 'metrics'),
  createGoal('Achieve 4,000 news sources', '2025-04-30', 'metrics'),
  createGoal('Reach 26,000 users', '2025-04-30', 'metrics'),
  createGoal('Launch B2B component (50k INR/month)', '2025-05-01', 'financial'),
  createGoal('Hire and start training 10 interns', '2025-05-01', 'hiring'),
  createGoal('Achieve full news coverage', '2025-05-31', 'metrics'),
  createGoal('Reach 30,000 users', '2025-05-31', 'metrics'),
  createGoal('Reach 33,000 users', '2025-06-30', 'metrics'),
  createGoal('Interns start contributing meaningfully', '2025-07-01', 'events'),
  createGoal('Reach 36,000 users', '2025-08-31', 'metrics'),
  createGoal('Reach 40,000 users', '2025-09-30', 'metrics'),
  createGoal('Achieve 1,000 Patreon subscribers', '2025-09-30', 'metrics'),
  createGoal('Achieve 4 B2B clients', '2025-09-30', 'metrics')
])

const editingGoal = ref<Goal | null>(null)
const showModal = ref(false)

const currentGoal = computed({
  get: () =>
    editingGoal.value || { title: '', date: '', category: 'financial' as const, completed: false },
  set: (value) => {
    if (editingGoal.value) {
      Object.assign(editingGoal.value, value)
    } else {
      editingGoal.value = { ...value, id: goals.value.length + 1, completed: false } as Goal
    }
  }
})

const upcomingGoals = computed(() => {
  const today = new Date()
  return goals.value
    .filter((goal) => !goal.completed && new Date(goal.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5)
})

const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, interactionPlugin, multiMonthPlugin],
  initialView: 'multiMonthYear',
  multiMonthMaxColumns: 2,
  events: goals.value.map((goal) => ({
    id: goal.id.toString(),
    title: goal.title,
    start: goal.date,
    classNames: [goal.category, goal.completed ? 'completed' : '']
  })),
  dateClick: handleDateClick,
  eventClick: handleEventClick
}))

function handleDateClick(arg: { dateStr: string }) {
  editingGoal.value = null
  currentGoal.value = {
    title: '',
    date: arg.dateStr,
    category: 'financial' as const,
    completed: false
  }
  showModal.value = true
}

function handleEventClick(info: { event: { id: string; title: string; start: Date } }) {
  const goal = goals.value.find((g) => g.id === parseInt(info.event.id))
  if (goal) {
    editingGoal.value = { ...goal }
    showModal.value = true
  }
}

function saveGoal() {
  if (editingGoal.value) {
    const index = goals.value.findIndex((g) => g.id === editingGoal.value!.id)
    if (index !== -1) {
      goals.value[index] = editingGoal.value
    }
  } else {
    goals.value.push(currentGoal.value as Goal)
  }
  showModal.value = false
  editingGoal.value = null
}

function toggleGoalCompletion(goal: Goal) {
  goal.completed = !goal.completed
}
</script>

<template>
  <div class="company-goals-calendar">
    <h2>Upcoming Goals</h2>
    <ul class="upcoming-goals">
      <li
        v-for="goal in upcomingGoals"
        :key="goal.id"
        :class="{ completed: goal.completed }"
      >
        <span>{{ goal.title }} ({{ goal.date }})</span>
        <PrimeButton @click="toggleGoalCompletion(goal)">
          {{ goal.completed ? 'Undo' : 'Complete' }}
        </PrimeButton>
      </li>
    </ul>

    <FullCalendar :options="calendarOptions" />

    <PrimeDialog
      v-model:visible="showModal"
      :modal="true"
      header="Goal Details"
    >
      <form
        @submit.prevent="saveGoal"
        class="goal-form"
      >
        <input
          v-model="currentGoal.title"
          placeholder="Goal title"
          required
        />
        <input
          v-model="currentGoal.date"
          type="date"
          required
        />
        <select v-model="currentGoal.category">
          <option value="financial">Financial</option>
          <option value="metrics">Metrics</option>
          <option value="hiring">Hiring</option>
          <option value="events">Events</option>
        </select>
        <PrimeButton type="submit">{{ editingGoal ? 'Update Goal' : 'Add Goal' }}</PrimeButton>
      </form>
    </PrimeDialog>
  </div>
</template>

<style scoped>
.company-goals-calendar {
  font-family: Arial, sans-serif;
}

.upcoming-goals {
  list-style-type: none;
  padding: 0;
}

.upcoming-goals li {
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.upcoming-goals li.completed span {
  text-decoration: line-through;
  color: #888;
}

.goal-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.goal-form input,
.goal-form select {
  padding: 5px;
}

:deep(.fc-event) {
  cursor: pointer;
}

:deep(.financial) {
  background-color: #4caf50;
}

:deep(.metrics) {
  background-color: #2196f3;
}

:deep(.hiring) {
  background-color: #ffc107;
}

:deep(.events) {
  background-color: #9c27b0;
}

:deep(.completed) {
  opacity: 0.6;
}
</style>
