import { promises as fs } from 'fs'
import { resolve } from 'path'
import { defineEventHandler } from 'h3'

interface AdMetric {
  adId: number
  impressions: number
  clicks: number
  uniqueViews: number
  deviceType: string
  viewTimes: number[]
}

const adMetricsFilePath = resolve(process.cwd(), 'data', 'advertising', 'metrics.json')

export default defineEventHandler(async (event) => {
  try {
    const data = await fs.readFile(adMetricsFilePath, 'utf-8')
    const metrics: AdMetric[] = JSON.parse(data)

    // Calculate additional metrics
    const processedMetrics = Object.values(metrics).map((metric: AdMetric) => {
      const ctr = metric.impressions > 0 ? (metric.clicks / metric.impressions) * 100 : 0
      const frequency = metric.impressions / metric.uniqueViews
      const timeOfDay = metric.viewTimes.map((time) => new Date(time).getHours())

      return {
        ...metric,
        ctr: ctr.toFixed(2) + '%',
        frequency: frequency.toFixed(2),
        timeOfDay: timeOfDay.reduce(
          (acc, hour) => {
            acc[hour] = (acc[hour] || 0) + 1
            return acc
          },
          {} as Record<number, number>,
        ),
      }
    })

    return processedMetrics
  } catch (error) {
    console.error('Error reading ad metrics:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to read ad metrics',
    })
  }
})
