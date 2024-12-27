import { promises as fs } from 'fs'
import { resolve } from 'path'
import { defineEventHandler, readBody } from 'h3'

const milestonesFilePath = resolve(process.cwd(), 'data', 'tasks', 'milestones.json')

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (method === 'GET') {
    try {
      const data = await fs.readFile(milestonesFilePath, 'utf-8')
      return JSON.parse(data)
    } catch (error: any) {
      console.error('Error reading milestones:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to read milestones',
      })
    }
  } else if (method === 'POST') {
    const body = await readBody(event)
    const { action, milestone } = body

    try {
      const data = await fs.readFile(milestonesFilePath, 'utf-8')
      let milestones = JSON.parse(data)

      switch (action) {
        case 'create':
          milestone.id = Math.max(...milestones.map((m: Milestone) => m.id)) + 1
          milestones.push(milestone)
          break
        case 'update':
          const index = milestones.findIndex((m: Milestone) => m.id === milestone.id)
          if (index !== -1) {
            milestones[index] = milestone
          }
          break
        case 'delete':
          milestones = milestones.filter((m: Milestone) => m.id !== milestone.id)
          break
        default:
          throw new Error(`Invalid action: ${action}`)
      }

      await fs.writeFile(milestonesFilePath, JSON.stringify(milestones, null, 2), 'utf-8')
      return { success: true, message: `Milestone ${action}d successfully` }
    } catch (error: any) {
      console.error(`Error ${action}ing milestone:`, error)
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to ${action} milestone`,
      })
    }
  }
})
