import { promises as fs } from 'fs'
import { resolve } from 'path'
import { defineEventHandler, readBody } from 'h3'

const adMetricsFilePath = resolve(process.cwd(), 'data', 'advertising', 'metrics.json')

interface AdMetric {
  adId: number
  impressions: number
  clicks: number
  uniqueViews: number
  deviceType: string
  viewTimes: number[]
}

let batchedMetrics: Record<number, AdMetric> = {}
let lastWriteTime = Date.now()
const WRITE_INTERVAL = 60000 // 1 minute

const writeMetricsToFile = async () => {
  try {
    let existingMetrics: Record<number, AdMetric> = {}
    try {
      const data = await fs.readFile(adMetricsFilePath, 'utf-8')
      existingMetrics = JSON.parse(data)
    } catch (error) {
      console.warn('No existing ad metrics found:', error)
      // File doesn't exist yet, start with empty object
    }

    // Merge batched metrics with existing metrics
    for (const [adId, metric] of Object.entries(batchedMetrics)) {
      if (!existingMetrics[adId]) {
        existingMetrics[adId] = metric
      } else {
        existingMetrics[adId].impressions += metric.impressions
        existingMetrics[adId].clicks += metric.clicks
        existingMetrics[adId].uniqueViews += metric.uniqueViews
        existingMetrics[adId].viewTimes.push(...metric.viewTimes)
      }
    }

    await fs.writeFile(adMetricsFilePath, JSON.stringify(existingMetrics, null, 2), 'utf-8')
    batchedMetrics = {} // Clear batched metrics after writing
    lastWriteTime = Date.now()
  } catch (error) {
    console.error('Error writing ad metrics:', error)
  }
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { metrics } = body as { metrics: Record<number, AdMetric> }

  if (!metrics) {
    return { success: false, message: 'No ad metrics received' }
  }

  console.log('Received ad metrics:', metrics)
  // Merge incoming metrics with batched metrics
  for (const [adId, metric] of Object.entries(metrics)) {
    if (!batchedMetrics[adId]) {
      batchedMetrics[adId] = metric
    } else {
      batchedMetrics[adId].impressions += metric.impressions
      batchedMetrics[adId].clicks += metric.clicks
      batchedMetrics[adId].uniqueViews += metric.uniqueViews
      batchedMetrics[adId].viewTimes.push(...metric.viewTimes)
    }
  }

  // Check if it's time to write to file
  if (Date.now() - lastWriteTime > WRITE_INTERVAL) {
    await writeMetricsToFile()
  }

  return { success: true, message: 'Ad metrics received and batched' }
})
