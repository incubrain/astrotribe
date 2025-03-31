import type { Plugin, ProcessStats, ExtractorOptions } from '../types.js'
import { truncateMiddle } from '../utils.js'

/**
 * Plugin to log the largest files by token count
 */
export const largestFilesPlugin: Plugin = {
  name: 'largestFiles',
  afterProcess: async (stats: ProcessStats, options: ExtractorOptions) => {
    console.log('📊 Top 15 files by token count:')

    // Convert fileStats to array and sort by token count
    const fileStatsArray = Array.from(stats.fileStats.entries())
      .map(([path, stats]) => ({
        path,
        tokens: stats.tokens,
      }))
      .sort((a, b) => b.tokens - a.tokens)

    // Take top 15
    const top15 = fileStatsArray.slice(0, 15)

    // Display table header
    console.log('┌─────────────────────────────────────────────────────────────────────────────┐')
    console.log('│ #  │ Tokens    │ File Path                                                  │')
    console.log('├─────────────────────────────────────────────────────────────────────────────┤')

    // Display each file
    top15.forEach((file, index) => {
      const num = (index + 1).toString().padStart(3)
      const tokens = file.tokens.toString().padStart(10)
      const pathDisplay = truncateMiddle(file.path, 60).padEnd(60)

      console.log(`│ ${num} │ ${tokens} │ ${pathDisplay} │`)
    })

    // Display table footer
    console.log('└─────────────────────────────────────────────────────────────────────────────┘')
  },
}
