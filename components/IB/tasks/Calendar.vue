<script setup lang="ts">
import { ref, computed } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

interface Employee {
  id: number
  name: string
}

interface Subtask {
  id: number
  title: string
  completed: boolean
}

interface Task {
  id: number
  title: string
  category: 'financial' | 'metrics' | 'hiring' | 'events' | 'development' | 'milestone'
  assigneeId: number
  gitHubIssueId?: number
  recurrence?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
    interval: number
    endDate?: string
  }
}

interface Goal extends Task {
  date: string
  completed: boolean
  milestoneId?: number
  progress: number
  priority: 'low' | 'medium' | 'high'
  timeSpent: number // in minutes
  description: string
  subtasks: Subtask[]
}

const showTimeTrackerModal = ref(false)
const selectedGoal = ref<Goal | null>(null)
const milestones = ref<Milestone[]>([])
const toast = useNotification()
const tasks = useTasks()

const goals = ref(tasks.goals.value)
watch(
  () => tasks.goals.value,
  (newGoals) => {
    goals.value = newGoals
  }
)

onMounted(async () => {
  await tasks.fetchGoals()
  await tasks.fetchMilestones()
  // await tasks.updateGoalsWithDefaultValues()
})

const employees = ref<Employee[]>([
  { id: 0, name: 'Team' },
  { id: 1, name: 'Shweta' },
  { id: 2, name: 'Mac' },
  { id: 3, name: 'Ruchera' },
  { id: 4, name: 'Omkar' },
  { id: 5, name: 'Ruturaj' },
])

const categories = [
  { name: 'Financial', value: 'financial' },
  { name: 'Metrics', value: 'metrics' },
  { name: 'Hiring', value: 'hiring' },
  { name: 'Events', value: 'events' },
  { name: 'Development', value: 'development' },
  { name: 'Milestone', value: 'milestone' },
]

const selectedEmployee = ref<Employee>({ id: 0, name: 'Team' })
const dragDropEnabled = ref(false)

const showModal = ref(false)
const editingGoal = ref<Goal | null>(null)
const currentGoal = computed(
  () =>
    editingGoal.value ?? {
      id: goals.value.length + 1,
      title: '',
      date: '',
      category: 'events',
      completed: false,
      assigneeId: 0,
    }
)

const priorityFilter = ref('all')

const upcomingGoals = computed(() => {
  const today = new Date()
  return goals.value
    .filter((goal) => !goal.completed && new Date(goal.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5)
})

function handleDateClick(arg: { dateStr: string }) {
  editingGoal.value = {
    id: goals.value.length + 1,
    title: '',
    date: arg.dateStr,
    category: 'events',
    assigneeId: employees.value[0].id,
    completed: false,
  }
  showModal.value = true
}

function handleEventClick(info: { event: { id: string } }) {
  console.log('eventzzz', info)
  const goal = goals.value.find((g) => g.id === parseInt(info.event.id))
  if (goal) {
    console.log('eventzzz', goal)
    selectedGoal.value = goal
    showTimeTrackerModal.value = true
    editingGoal.value = { ...goal }
    showModal.value = true
  }
}

const isNew = (goal: Goal) => !goals.value.some((g) => g.id === goal.id)

async function saveGoal(goal: Goal) {
  try {
    if (isNew(goal)) {
      await tasks.createGoal(goal)
      toast.success({ message: 'Goal created successfully', summary: 'Success' })
    } else {
      await tasks.updateGoal(goal)
      toast.success({ message: 'Goal updated successfully', summary: 'Success' })
    }
    await tasks.fetchGoals()
    showModal.value = false
  } catch (error) {
    toast.error({ message: `Failed to save goal: ${error.message}`, summary: 'Error' })
  }
}

async function deleteGoal(goal: Goal) {
  try {
    await tasks.deleteGoal(goal)
    toast.success({ message: 'Goal deleted successfully', summary: 'Success' })
    await tasks.fetchGoals()
    showModal.value = false
  } catch (error) {
    toast.error({ message: `Failed to delete goal: ${error.message}`, summary: 'Error' })
  }
}

function getEmployeeName(id: number): string {
  const employee = employees.value.find((emp) => emp.id === id)
  return employee ? employee.name : 'Unassigned'
}

const selectedEmployeeId = ref<number>(0)

watch(selectedEmployeeId, (newId) => {
  const selected = employees.value.find((e) => e.id === newId)
  if (selected) {
    filterByAssignee(selected)
  }
})

function filterByAssignee(employee: Employee) {
  console.log('Selected employee', employee)
  selectedEmployee.value = employee
}



const filteredGoals = computed(() => {
  let filtered = goals.value
  if (selectedEmployee.value?.id !== 0) {
    filtered = filtered.filter((goal) => goal.assigneeId === selectedEmployee.value?.id)
  }
  if (priorityFilter.value !== 'all') {
    filtered = filtered.filter((goal) => goal.priority === priorityFilter.value)
  }
  return filtered
})

function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}m`
}

const calendarOptions = computed(() => {
  const today = new Date()
  const start = new Date(today.getFullYear(), today.getMonth() - 1, 1) // Start of previous month
  const end = new Date(today.getFullYear() + 1, today.getMonth(), 0)

  return {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridYear',
    views: {
      dayGridYear: {
        displayEventTime: true,
        duration: { months: 13 },
        buttonText: '13 months',
      },
    },
    initialDate: today,
    timeZone: 'local',
    headerToolbar: {
      start: 'title',
      center: '',
      end: 'prev,next today',
      right: 'dayGridYear,dayGridMonth,dayGridWeek,dayGridDay', // user can switch between the two
    },
    events: filteredGoals.value.map((goal) => ({
      id: goal.id.toString(),
      title: goal.title,
      start: goal.date,
      end: goal.date,
      classNames: [goal.category, goal.completed ? 'completed' : '', `priority-${goal.priority}`],
      extendedProps: {
        assignee: getEmployeeName(goal.assigneeId),
        description: goal.description,
        subtasks: goal.subtasks,
        progress: goal.progress,
      },
    })),
    eventContent: (arg) => {
      const titleEl = document.createElement('div')
      titleEl.innerHTML = arg.event.title
      titleEl.style.fontWeight = 'bold'
      titleEl.style.marginBottom = '2px'

      const progressBar = document.createElement('div')
      progressBar.style.width = `${arg.event.extendedProps.progress}%`
      progressBar.style.height = '4px'
      progressBar.style.backgroundColor = 'rgba(255, 255, 255, 0.7)'
      progressBar.style.position = 'absolute'
      progressBar.style.bottom = '0'
      progressBar.style.left = '0'

      const timeSpent = document.createElement('div')
      timeSpent.innerHTML = `⏱️ ${formatTime(arg.event.extendedProps.timeSpent)}`
      timeSpent.style.fontSize = '0.8em'
      timeSpent.style.marginTop = '2px'

      const subtasksInfo = document.createElement('div')
      const completedSubtasks = arg.event.extendedProps.subtasks?.filter((st) => st.completed).length
      const totalSubtasks = arg.event.extendedProps.subtasks.length
      subtasksInfo.innerHTML = `Subtasks: ${completedSubtasks}/${totalSubtasks}`
      subtasksInfo.style.fontSize = '0.8em'
      subtasksInfo.style.marginTop = '2px'

      return { domNodes: [titleEl, progressBar, timeSpent, subtasksInfo] }
    },
    dateClick: handleDateClick,
    eventClick: handleEventClick,
    height: 'auto',
    visibleRange: {
      start: start,
      end: end,
    },
    editable: dragDropEnabled,
    eventDrop: handleEventDrop,
    showNonCurrentDates: true,
    fixedWeekCount: false,
    dayMaxEvents: 2,
    firstDay: 1,
  }
})

function toggleGoalCompletion(goal: Goal) {
  goal.completed = !goal.completed
  if (goal.completed) {
    goal.subtasks = goal.subtasks.map((st) => ({ ...st, completed: true }))
  }
  tasks.updateGoal(goal)
}

async function handleEventDrop(dropInfo: any) {
  const { event } = dropInfo
  console.log('dropInfo', dropInfo)
  const goal = goals.value.find((g) => g.id.toString() === event.id)
  if (goal) {
    const droppedDate = new Date(event.start)
    console.log('drag 1', droppedDate)
    droppedDate.setDate(droppedDate.getDate() + 1)

    console.log('drag 2', droppedDate)

    const updatedGoal = {
      ...goal,
      date: droppedDate.toISOString().split('T')[0],
    }

    try {
      await tasks.updateGoal(updatedGoal)
      toast.success({ message: 'Goal date updated successfully', summary: 'Success' })
    } catch (error) {
      toast.error({ message: 'Failed to update goal date', summary: 'Error' })
      dropInfo.revert()
    }
  }
}

function toggleDragDrop() {
  dragDropEnabled.value = !dragDropEnabled.value
  toast.info({
    message: `Drag and drop is now ${dragDropEnabled.value ? 'enabled' : 'disabled'}`,
    summary: 'Info',
  })
}

async function fetchGitHubIssue(issueId: number) {
  // Replace with your actual GitHub API call
  const response = await fetch(`https://api.github.com/repos/your-repo/issues/${issueId}`)
  return await response.json()
}

// Function to open GitHub issue in a new tab
function openGitHubIssue(issueId: number) {
  window.open(`https://github.com/your-repo/issues/${issueId}`, '_blank')
}

function handleSubtaskUpdate(goalId: number, subtaskId: number, completed: boolean) {
  const goal = goals.value.find((g) => g.id === goalId)
  if (goal) {
    updateSubtaskCompletion(goal, subtaskId, completed)
  }
}

function updateSubtaskCompletion(goal: Goal, subtaskId: number, completed: boolean) {
  const updatedGoal = { ...goal }
  const subtaskIndex = updatedGoal.subtasks.findIndex((st) => st.id === subtaskId)
  if (subtaskIndex !== -1) {
    updatedGoal.subtasks[subtaskIndex].completed = completed
    updatedGoal.completed = updatedGoal.subtasks.every((st) => st.completed)
    tasks.updateGoal(updatedGoal)
  }
}
</script>

<template>
  <div class="company-goals-calendar h-full">
    <IBTasksUpcoming
      :goals="upcomingGoals"
      @toggle-completion="toggleGoalCompletion"
    />

    <IBTasksMilestones
      :goals="filteredGoals"
      :milestones="tasks.milestones"
    />

    <div class="assignee-filter mb-4">
      <PrimeSelect
        v-model="selectedEmployeeId"
        :options="[...employees]"
        option-label="name"
        option-value="id"
        placeholder="Select an assignee"
        @change="filterByAssignee"
      />
    </div>

    <PrimeSelect
      v-model="priorityFilter"
      :options="[
        { label: 'All', value: 'all' },
        { label: 'Low', value: 'low' },
        { label: 'Medium', value: 'medium' },
        { label: 'High', value: 'high' },
      ]"
      option-label="label"
      option-value="value"
      placeholder="Filter by priority"
      class="mb-4"
    />

    <PrimeButton
      @click="toggleDragDrop"
      :label="dragDropEnabled ? 'Disable Drag & Drop' : 'Enable Drag & Drop'"
      :class="{ 'p-button-success': dragDropEnabled, 'p-button-secondary': !dragDropEnabled }"
      class="mb-4"
    />

    <FullCalendar
      :options="calendarOptions"
      class="custom-calendar w-full"
    />

    <PrimeDialog
      v-model:visible="showModal"
      :modal="true"
      :header="editingGoal ? 'Edit Goal' : 'Create Goal'"
    >
      <IBTasksForm
        :goal="currentGoal"
        :employees="employees"
        :categories="categories"
        :milestones="tasks.milestones"
        :is-new="isNew(currentGoal)"
        @save="saveGoal"
        @delete="deleteGoal"
        @update-subtask="handleSubtaskUpdate"
      />
    </PrimeDialog>
  </div>
</template>

<style scoped>
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

:deep(.fc-daygrid-day-events) {
  padding: 2px;
}

:deep(.fc-event) {
  margin-bottom: 2px;
  line-height: 115%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: 60px; /* Approx. two lines of text */
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

:deep(.fc-day-disabled) {
  opacity: 0.08;
  background-color: #0084ff;
  pointer-events: none;
}

:deep(.fc-col-header-cell) {
  background-color: #245883 !important;
  border-color: #2196f3;
}

:deep(.fc-scrollgrid-section-header) {
  border-color: #245883 !important;
}

:deep(.events) {
  background-color: #9c27b0;
}

:deep(.completed) {
  opacity: 0.6;
}

.custom-calendar {
  min-height: 1500px;
  /* Header background color */
  --fc-theme-standard-header-bg-color: #3490dc;
  --fc-theme-standard-header-text-color: #ffffff;

  /* Border color */
  --fc-border-color: rgba(255, 255, 255, 0.1);

  /* Navigation button color */
  --fc-button-bg-color: #ffffff;
  --fc-button-border-color: #ffffff;
  --fc-button-text-color: #3490dc;
  --fc-button-hover-bg-color: #f8fafc;
  --fc-button-hover-border-color: #f8fafc;
  --fc-button-hover-text-color: #2779bd;

  /* Today button color */
  --fc-today-button-bg-color: #ffffff;
  --fc-today-button-border-color: #ffffff;
  --fc-today-button-text-color: #3490dc;
  --fc-today-button-hover-bg-color: #f8fafc;
  --fc-today-button-hover-border-color: #f8fafc;
  --fc-today-button-hover-text-color: #2779bd;
}

.custom-calendar .fc .fc-button {
  text-transform: capitalize;
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
:deep(.development) {
  background-color: #ff5722;
}
:deep(.milestone) {
  background-color: #795548;
}
:deep(.fc-event-title) {
  color: white;
}

:deep(.priority-low) {
  border-left: 4px solid #4caf50;
}
:deep(.priority-medium) {
  border-left: 4px solid #ffc107;
}
:deep(.priority-high) {
  border-left: 4px solid #f44336;
}
</style>
