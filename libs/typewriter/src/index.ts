import path from 'node:path'
import fs from 'node:fs/promises'
import { createWriteStream, existsSync } from 'node:fs'
import { argv } from 'node:process'
import minimist from 'minimist'
import micromatch from 'micromatch'

import type { ExtractorOptions, ProcessStats } from './types.js'

import { estimateTokens, generateOutputFilename, resolvePackageRoot } from './utils.js'

import {
  tokenCalculatorPlugin,
  commentRemoverPlugin,
  importRemoverPlugin,
  fileTreePlugin,
  largestFilesPlugin,
} from './plugins'

/**
 * Find all .d.ts files in a directory
 */
async function findAllDTSFiles(
  dir: string,
  stats: ProcessStats,
  options: ExtractorOptions,
): Promise<string[]> {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    const filesPromises = entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name)

      const relativePath = path.relative(process.cwd(), fullPath)
      if (options.exclude.length > 0 && micromatch.isMatch(relativePath, options.exclude)) {
        if (options.debug) console.log(`🚫 Excluded: ${relativePath}`)
        stats.skippedFiles++
        return []
      }

      if (entry.isDirectory()) {
        return findAllDTSFiles(fullPath, stats, options)
      }

      if (entry.isFile() && entry.name.endsWith('.d.ts')) {
        for (const plugin of options.plugins) {
          if (plugin.shouldProcessFile) {
            const shouldProcess = await plugin.shouldProcessFile(fullPath, options)
            if (!shouldProcess) {
              if (options.debug) console.log(`🔌 Plugin ${plugin.name} excluded: ${relativePath}`)
              stats.skippedFiles++
              return []
            }
          }
        }

        return [fullPath]
      }

      return []
    })

    const files = await Promise.all(filesPromises)
    return files.flat()
  } catch (error: any) {
    console.error(`❌ Error finding .d.ts files in ${dir}: ${error.message}`)
    return []
  }
}

/**
 * Main extraction function
 */
async function dumpTypesToFile(options: ExtractorOptions) {
  const stats: ProcessStats = {
    totalFiles: 0,
    processedFiles: 0,
    skippedFiles: 0,
    totalTokens: 0,
    fileStats: new Map(),
  }

  try {
    console.log(`🚀 Starting extraction for package: ${options.packageName}`)

    // Create debug directory if debug is enabled
    if (options.debug) {
      const debugDir = path.join(process.cwd(), 'debug')
      await fs.mkdir(debugDir, { recursive: true })
      console.log(`🔍 Debug mode enabled, files will be saved to ${debugDir}`)
    }

    // Run beforeProcess hooks
    for (const plugin of options.plugins) {
      if (plugin.beforeProcess) {
        await plugin.beforeProcess(options)
      }
    }

    // Resolve package root
    const root = await resolvePackageRoot(options.packageName, options.debug)
    console.log(`🔍 Looking for .d.ts files in: ${root}`)

    // Find all .d.ts files
    const dtsFiles = await findAllDTSFiles(root, stats, options)
    stats.totalFiles = dtsFiles.length + stats.skippedFiles

    if (dtsFiles.length === 0) {
      console.warn('⚠️ No .d.ts files found for this package (or all were excluded)')
      return
    }

    console.log(
      `📝 Found ${dtsFiles.length} .d.ts files (${stats.skippedFiles} skipped), writing to ${options.outputPath}`,
    )

    // Create placeholder file
    const stream = createWriteStream(options.outputPath, { encoding: 'utf-8' })
    stream.write(`/* Types extracted from ${options.packageName} */\n`)
    stream.write(`/* Extraction date: ${new Date().toISOString()} */\n`)
    stream.write(`/* Total files: ${dtsFiles.length} */\n\n`)
    stream.end()

    // Process all files in memory
    for (const file of dtsFiles) {
      const relPath = path.relative(root, file)

      try {
        // Read file content
        let content = await fs.readFile(file, 'utf-8')
        const originalSize = Buffer.byteLength(content, 'utf8')

        if (options.debug) {
          console.log(`\n🔍 Processing file: ${relPath}`)
          console.log(`   Original size: ${originalSize} bytes`)
        }

        // Apply content processing plugins
        for (const plugin of options.plugins) {
          if (plugin.processFileContent) {
            content = await plugin.processFileContent(file, content, options)
          }
        }

        // Calculate tokens on the processed content
        const tokens = estimateTokens(content)
        stats.totalTokens += tokens

        if (options.debug) {
          console.log(`   Final token count: ~${tokens} tokens`)
        }

        // Store file stats with the content for later use
        stats.fileStats.set(relPath, {
          path: relPath,
          originalPath: file,
          size: originalSize,
          tokens,
          content,
        })

        stats.processedFiles++
      } catch (error: any) {
        console.error(`❌ Error processing file ${file}: ${error.message}`)
      }
    }

    console.log(`✅ Successfully processed ${dtsFiles.length} type files`)
    console.log(`✅ Total token estimation: ~${stats.totalTokens} tokens`)

    // Run afterProcess hooks - this will take care of writing all content to the file
    for (const plugin of options.plugins) {
      if (plugin.afterProcess) {
        await plugin.afterProcess(stats, options)
      }
    }
  } catch (error: any) {
    console.error(`❌ Extraction failed: ${error.message}`)
    process.exit(1)
  }
}

/**
 * Main function
 */
async function main() {
  // Parse command line arguments
  const args = minimist(argv.slice(2), {
    string: ['exclude'],
    boolean: ['debug'],
    alias: {
      e: 'exclude',
      d: 'debug',
    },
    default: {
      exclude: [],
      debug: false,
    },
  })

  console.log('Raw arguments:', argv.slice(2)) // Debug log for arguments

  // Fix for arguments when passed through pnpm scripts
  // When arguments are passed like: pnpm typewriter -- @pkg/name --exclude="..." --debug
  // They might come in as ["--", "@pkg/name", "--exclude=...", "--debug"]
  const processedArgs = [...argv.slice(2)]
  if (processedArgs[0] === '--') {
    processedArgs.shift() // Remove the first '--'
  }

  // Re-parse with the fixed arguments if necessary
  const fixedArgs = minimist(processedArgs, {
    string: ['exclude'],
    boolean: ['debug'],
    alias: {
      e: 'exclude',
      d: 'debug',
    },
    default: {
      exclude: [],
      debug: false,
    },
  })

  console.log('Processed arguments:', fixedArgs) // Debug log for fixed arguments

  // Allow comma-separated exclude patterns
  const excludePatterns = Array.isArray(fixedArgs.exclude)
    ? fixedArgs.exclude
    : typeof fixedArgs.exclude === 'string'
      ? fixedArgs.exclude.split(',')
      : []

  if (fixedArgs._.length < 1) {
    console.error(
      '❌ Usage: tsx extract-types.ts <package-name> [--exclude=pattern1,pattern2] [--debug]',
    )
    process.exit(1)
  }

  const pkgName = fixedArgs._[0]
  const outputFile = generateOutputFilename(pkgName)

  // Initialize options
  const options: ExtractorOptions = {
    packageName: pkgName,
    outputPath: outputFile,
    exclude: excludePatterns,
    plugins: [
      tokenCalculatorPlugin,
      commentRemoverPlugin,
      importRemoverPlugin,
      fileTreePlugin,
      largestFilesPlugin,
    ],
    debug: fixedArgs.debug,
  }

  console.log('🔧 Type extraction utility starting...')
  console.log(`📦 Target package: ${options.packageName}`)
  console.log(`📄 Output file: ${options.outputPath}`)
  console.log(
    `🔍 Exclude patterns: ${options.exclude.length > 0 ? options.exclude.join(', ') : 'None'}`,
  )

  try {
    await dumpTypesToFile(options)
  } catch (error: any) {
    console.error(`❌ Extraction failed: ${error.message}`)
    process.exit(1)
  }
}

// Run the program
main().catch((error) => {
  console.error(`❌ Fatal error: ${error.message}`)
  process.exit(1)
})
