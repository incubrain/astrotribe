export interface Goal {
  id: number
  title: string
  date: string
  category: 'financial' | 'metrics' | 'hiring' | 'events' | 'development' | 'milestone'
  assigneeId: number
  completed: boolean
  recurrence?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
    interval: number
    endDate?: string
  }
}

export default function useTasks() {
  const goals = ref<Goal[]>([])

  async function fetchGoals() {
    try {
      console.log('fetchGoals')
      const response = await $fetch('/api/admin/goals', {
        method: 'POST',
        body: { action: 'read' },
      })

      console.log('fetchGoals response', response)
      if (response.success) {
        goals.value = response.goals
        generateRecurringTasks()
      } else {
        throw new Error(response.message)
      }
    } catch (error) {
      console.error('Error fetching goals:', error)
      throw error
    }
  }

  function generateRecurringTasks() {
    const today = new Date()
    const oneYearLater = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate())
    const newGoals: Goal[] = []

    goals.value.forEach((task) => {
      if (task.recurrence) {
        const currentDate = new Date(task.date)
        while (currentDate <= oneYearLater) {
          if (task.recurrence.endDate && new Date(task.recurrence.endDate) < currentDate) {
            break
          }
          if (currentDate > today) {
            newGoals.push({
              ...task,
              id: Math.max(...goals.value.map((g) => g.id), 0) + 1,
              date: currentDate.toISOString().split('T')[0],
              completed: false,
            })
          }
          advanceDate(currentDate, task.recurrence.frequency, task.recurrence.interval)
        }
      }
    })

    goals.value = [...goals.value, ...newGoals]
  }

  function advanceDate(date: Date, frequency: string, interval: number) {
    switch (frequency) {
      case 'daily':
        date.setDate(date.getDate() + interval)
        break
      case 'weekly':
        date.setDate(date.getDate() + 7 * interval)
        break
      case 'monthly':
        date.setMonth(date.getMonth() + interval)
        break
      case 'yearly':
        date.setFullYear(date.getFullYear() + interval)
        break
    }
  }

  async function createGoal(goal: Goal) {
    return handleGoalCrud('create', goal)
  }

  async function updateGoal(goal: Goal) {
    return handleGoalCrud('update', goal)
  }

  async function deleteGoal(goal: Goal) {
    return handleGoalCrud('delete', goal)
  }

  async function handleGoalCrud(action: 'create' | 'update' | 'delete', goal: Goal) {
    try {
      const response = await $fetch('/api/admin/goals', {
        method: 'POST',
        body: { action, goal },
      })
      if (response.success) {
        if (action === 'update') {
          // Update the goal in the local state
          const index = goals.value.findIndex((g) => g.id === goal.id)
          if (index !== -1) {
            goals.value[index] = goal
          }
        } else {
          // For create and delete, re-fetch all goals
          await fetchGoals()
        }
      } else {
        throw new Error(response.message)
      }
    } catch (error) {
      console.error(`Error ${action}ing goal:`, error)
      throw error
    }
  }

  return {
    goals,
    fetchGoals,
    createGoal,
    updateGoal,
    deleteGoal,
  }
}
