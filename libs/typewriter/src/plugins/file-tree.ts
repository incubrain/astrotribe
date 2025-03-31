import path from 'node:path'
import fs from 'node:fs/promises'
import type { Plugin, ExtractorOptions, ProcessStats } from '../types.js'

/**
 * Plugin to generate a file tree and place it at the top of the output file
 */
export const fileTreePlugin: Plugin = {
  name: 'fileTree',
  beforeProcess: async () => {
    console.log('🌲 File tree generator plugin activated')
  },
  afterProcess: async (stats: ProcessStats, options: ExtractorOptions) => {
    console.log('🌲 Generating file tree...')

    // Create tree structure
    const tree: Record<string, any> = {}
    const sortedFiles = Array.from(stats.fileStats.entries()).sort(([pathA], [pathB]) =>
      pathA.localeCompare(pathB),
    )

    // Build the tree hierarchy
    for (const [filePath, fileStats] of sortedFiles) {
      const parts = filePath.split(path.sep)
      let current = tree

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i]
        if (i === parts.length - 1) {
          // Leaf node (file)
          current[part] = {
            tokens: fileStats.tokens,
          }
        } else {
          // Directory
          if (!current[part]) {
            current[part] = {}
          }
          current = current[part]
        }
      }
    }

    // Start generating the tree output as string
    let treeOutput = '/* FILE TREE WITH TOKEN ESTIMATIONS */\n'

    // Recursive function to print the tree
    function printTree(node: Record<string, any>, prefix = '', isLast = true, depth = 0) {
      Object.entries(node).forEach(([key, value], index, array) => {
        const isLastItem = index === array.length - 1
        const newPrefix = prefix + (isLast ? '    ' : '│   ')

        if (typeof value === 'object' && value !== null && !('tokens' in value)) {
          // Directory
          treeOutput += `${prefix}${isLastItem ? '└── ' : '├── '}📁 ${key}\n`
          printTree(value, newPrefix, isLastItem, depth + 1)
        } else {
          // File
          const tokens = value.tokens
          treeOutput += `${prefix}${isLastItem ? '└── ' : '├── '}📄 ${key} (~${tokens} tokens)\n`
        }
      })
    }

    // Generate the tree output
    printTree(tree)
    treeOutput += '\n/* END FILE TREE */\n\n'

    // Create summary section
    let summaryOutput = '/* SUMMARY INFORMATION */\n'
    summaryOutput += `Package: ${options.packageName}\n`
    summaryOutput += `Extraction Date: ${new Date().toISOString()}\n`
    summaryOutput += `Total Files: ${stats.processedFiles}\n`
    summaryOutput += `Total Tokens: ~${stats.totalTokens}\n\n`

    // Generate the top 15 largest files by token count
    let top15Output = '/* TOP 15 FILES BY TOKEN COUNT */\n'
    const fileStatsArray = Array.from(stats.fileStats.entries())
      .map(([path, stats]) => ({
        path,
        tokens: stats.tokens,
      }))
      .sort((a, b) => b.tokens - a.tokens)
      .slice(0, 15)

    fileStatsArray.forEach((file, index) => {
      top15Output += `${index + 1}. ${file.path} (~${file.tokens} tokens)\n`
    })

    top15Output += '\n/* END SUMMARY */\n\n'

    // Now construct the full output file content
    let fullOutput = summaryOutput + top15Output + treeOutput

    // Add all file contents
    for (const [filePath, fileStats] of sortedFiles) {
      fullOutput += `\n/* --- ${filePath} --- */\n`
      fullOutput += fileStats.content
      fullOutput += '\n\n' // Add extra line breaks for separation
    }

    // Write to the output file
    await fs.writeFile(options.outputPath, fullOutput)

    console.log(`✅ Summary information and all file contents written to ${options.outputPath}`)
  },
}
