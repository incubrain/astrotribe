import path from 'node:path'
import fs from 'node:fs/promises'
import type { Plugin } from '../types.js'

/**
 * Plugin to remove import statements from type definition files
 */
export const importRemoverPlugin: Plugin = {
  name: 'importRemover',
  processFileContent: async (filePath, content, options) => {
    const originalLength = content.length
    const fileName = path.basename(filePath)

    if (options.debug) {
      console.log(`🔍 Import remover processing: ${fileName}`)
      console.log(`   Original content length: ${originalLength} chars`)
    }

    // Pattern to match import statements
    const importPattern =
      /import\s+(?:(?:[^{}\s,]+)\s*,?\s*)?(?:{[^{}]*})?\s*from\s+['"][^'"]+['"];?\s*/g

    // Collect import statements for debugging
    const importStatements: string[] = []
    let match

    // Find all import statements for logging
    while ((match = importPattern.exec(content)) !== null) {
      importStatements.push(match[0])
    }

    if (options.debug && importStatements.length > 0) {
      console.log(`   Found ${importStatements.length} import statements to remove`)
      console.log('   Import statements to remove:')
      importStatements.forEach((importStmt, i) => {
        console.log(`     ${i + 1}. ${importStmt.trim()}`)
      })
    }

    // Remove import statements
    let result = content.replace(importPattern, '')

    // Remove empty lines created by import removal
    const emptyLinesPattern = /^\s*[\r\n]/gm
    result = result.replace(emptyLinesPattern, '')

    const newLength = result.length
    const percentRemoved = (((originalLength - newLength) / originalLength) * 100).toFixed(2)

    if (options.debug) {
      console.log(`   New content length: ${newLength} chars (${percentRemoved}% removed)`)

      // Save processed content for comparison if debug is on
      const debugDir = path.join(process.cwd(), 'debug')
      try {
        await fs.mkdir(debugDir, { recursive: true })
        await fs.writeFile(
          path.join(debugDir, `${path.basename(filePath)}.imports-removed`),
          result,
        )
      } catch (error: any) {
        console.error(`❌ Error saving debug file: ${error.message}`)
      }
    }

    return result
  },
}
