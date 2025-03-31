import fs from 'node:fs/promises'
import path from 'node:path'
import type { Plugin } from '../types.js'

/**
 * Plugin to remove all comments from TypeScript definition files
 * This version removes all comments including JSDoc for LLM processing
 */
export const commentRemoverPlugin: Plugin = {
  name: 'commentRemover',
  processFileContent: async (filePath, content, options) => {
    const originalLength = content.length
    const fileName = path.basename(filePath)

    if (options.debug) {
      console.log(`🔍 Comment remover processing: ${fileName}`)
      console.log(`   Original content length: ${originalLength} chars`)

      // Save original content for comparison
      const debugDir = path.join(process.cwd(), 'debug')
      try {
        await fs.mkdir(debugDir, { recursive: true })
        await fs.writeFile(path.join(debugDir, `${path.basename(filePath)}.original`), content)
      } catch (error: any) {
        console.error(`❌ Error saving debug file: ${error.message}`)
      }
    }

    // STEP 1: Remove all JSDoc multi-line comments (/**...*/)
    // This is the most common form of comment in type definitions
    if (options.debug) {
      console.log('   STEP 1: Removing JSDoc multi-line comments')

      // Count JSDoc comments for logging
      const jsdocMatches = content.match(/\/\*\*[\s\S]*?\*\//g) || []
      if (jsdocMatches.length > 0) {
        console.log(`   Found ${jsdocMatches.length} JSDoc comments to remove`)
        jsdocMatches.slice(0, 2).forEach((comment, i) => {
          // Show a preview truncated to 100 chars
          const preview = comment.length > 100 ? comment.substring(0, 97) + '...' : comment
          console.log(`     ${i + 1}. ${preview.replace(/\n/g, '\\n')}`)
        })
      } else {
        console.log('   No JSDoc comments found')
      }
    }

    let result = content.replace(/\/\*\*[\s\S]*?\*\//g, '')

    // STEP 2: Remove all other multi-line comments (/*...*/)
    if (options.debug) {
      console.log('   STEP 2: Removing other multi-line comments')

      // Count non-JSDoc multi-line comments
      const multilineMatches = result.match(/\/\*[\s\S]*?\*\//g) || []
      if (multilineMatches.length > 0) {
        console.log(`   Found ${multilineMatches.length} other multi-line comments to remove`)
        multilineMatches.slice(0, 2).forEach((comment, i) => {
          const preview = comment.length > 100 ? comment.substring(0, 97) + '...' : comment
          console.log(`     ${i + 1}. ${preview.replace(/\n/g, '\\n')}`)
        })
      } else {
        console.log('   No other multi-line comments found')
      }
    }

    result = result.replace(/\/\*[\s\S]*?\*\//g, '')

    // STEP 3: Remove all single-line comments (//)
    if (options.debug) {
      console.log('   STEP 3: Removing single-line comments')

      // Count single-line comments
      const singleLineMatches = result.match(/\/\/.*$/gm) || []
      if (singleLineMatches.length > 0) {
        console.log(`   Found ${singleLineMatches.length} single-line comments to remove`)
        singleLineMatches.slice(0, 3).forEach((comment, i) => {
          console.log(`     ${i + 1}. ${comment.trim()}`)
        })
      } else {
        console.log('   No single-line comments found')
      }
    }

    result = result.replace(/\/\/.*$/gm, '')

    // STEP 4: Clean up empty lines
    if (options.debug) {
      console.log('   STEP 4: Cleaning up empty lines')
    }

    // First pass: detect consecutive empty lines and convert to a single empty line
    result = result.replace(/\n\s*\n\s*\n/g, '\n\n')

    // Second pass: remove empty lines at the start of the file
    result = result.replace(/^\s*\n+/, '')

    // Third pass: clean up any remaining excessive whitespace lines
    result = result.replace(/\n\s*\n/g, '\n\n')

    // Final stats
    const newLength = result.length
    const percentRemoved = (((originalLength - newLength) / originalLength) * 100).toFixed(2)
    const tokensRemoved = Math.floor((originalLength - newLength) / 4)

    if (options.debug) {
      console.log('   Final Results:')
      console.log(`   - Original length: ${originalLength} chars`)
      console.log(`   - New length: ${newLength} chars`)
      console.log(`   - Removed: ${originalLength - newLength} chars (${percentRemoved}%)`)
      console.log(`   - Estimated tokens saved: ~${tokensRemoved} tokens`)

      // Save processed content for comparison
      try {
        await fs.writeFile(
          path.join(process.cwd(), 'debug', `${path.basename(filePath)}.processed`),
          result,
        )
      } catch (error: any) {
        console.error(`❌ Error saving debug file: ${error.message}`)
      }
    }

    return result
  },
}
