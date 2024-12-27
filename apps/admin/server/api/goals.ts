import { promises as fs } from 'fs'
import { resolve } from 'path'
import { defineEventHandler, readBody } from 'h3'

const goalsFilePath = resolve(process.cwd(), 'data', 'tasks/goals.json')

export interface Goal {
  id: number
  title: string
  date: string
  category: 'financial' | 'metrics' | 'hiring' | 'events' | 'development' | 'milestone'
  assigneeId: number
  completed: boolean
  progress: number
  priority: 'low' | 'medium' | 'high'
  timeSpent: number
  description: string
  milestoneId?: number
  recurrence?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
    interval: number
    endDate?: string
  }
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { action, goal } = body

  async function readGoals(): Promise<Goal[]> {
    try {
      const data = await fs.readFile(goalsFilePath, 'utf-8')
      return JSON.parse(data)
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        return []
      }
      throw error
    }
  }

  async function writeGoals(goals: Goal[]): Promise<void> {
    await fs.writeFile(goalsFilePath, JSON.stringify(goals, null, 2), 'utf-8')
  }

  try {
    let goals = await readGoals()

    switch (action) {
      case 'read':
        return {
          success: true,
          goals: goals,
          totalCount: goals.length,
        }
      case 'create':
        goals.push(goal)
        await writeGoals(goals)
        break
      case 'update':
        const index = goals.findIndex((g) => g.id === goal.id)
        if (index !== -1) {
          goals[index] = { ...goals[index], ...goal }
          await writeGoals(goals)
        }
        break
      case 'delete':
        goals = goals.filter((g) => g.id !== goal.id)
        await writeGoals(goals)
        break
      default:
        throw new Error(`Invalid action: ${action}`)
    }

    return {
      success: true,
      message: action === 'read' ? 'Goals fetched successfully' : `Goal ${action}d successfully`,
    }
  } catch (error: any) {
    console.error('Error performing goal action:', error)
    return { success: false, message: `Failed to ${action} goal`, error: error.message }
  }
})
