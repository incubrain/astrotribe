import { promises as fs } from 'fs'
import { resolve } from 'path'
import { defineEventHandler, readBody } from 'h3'

const goalsFilePath = resolve(process.cwd(), 'data', 'tasks/goals.json')

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { action, goal } = body

  async function readGoals(): Promise<Goal[]> {
    try {
      const data = await fs.readFile(goalsFilePath, 'utf-8')
      console.log('goals1', data.length)
      console.log('Start of JSON:', data.substring(0, 100))
      console.log('End of JSON:', data.substring(data.length - 100))

      return JSON.parse(data)
    } catch (error) {
      if (error.code === 'ENOENT') {
        // File doesn't exist, return an empty array
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

    console.log('goals2', goals.length)

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
          goals[index] = goal
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
  } catch (error) {
    console.error('Error performing goal action:', error)
    return { success: false, message: `Failed to ${action} goal`, error: error.message }
  }
})
