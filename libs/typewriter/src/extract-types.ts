import path from 'node:path'
import fs from 'node:fs/promises'
import { existsSync, createWriteStream, statSync } from 'node:fs'
import { argv } from 'node:process'
import minimist from 'minimist'
import micromatch from 'micromatch'

interface Plugin {
  name: string
  beforeProcess?: (options: ExtractorOptions) => Promise<void> | void
  shouldProcessFile?: (filePath: string, options: ExtractorOptions) => Promise<boolean> | boolean
  processFileContent?: (
    filePath: string,
    content: string,
    options: ExtractorOptions,
  ) => Promise<string> | string
  afterProcess?: (stats: ProcessStats, options: ExtractorOptions) => Promise<void> | void
}

interface FileStats {
  path: string
  size: number
  tokens: number
  content: string // Store the processed content
}

interface ProcessStats {
  totalFiles: number
  processedFiles: number
  skippedFiles: number
  totalTokens: number
  fileStats: Map<string, FileStats>
}

interface ExtractorOptions {
  packageName: string
  outputPath: string
  exclude: string[]
  plugins: Plugin[]
  debug: boolean
}

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

const excludePatterns = Array.isArray(args.exclude)
  ? args.exclude
  : typeof args.exclude === 'string'
    ? args.exclude.split(',')
    : []

if (args._.length < 1) {
  console.error(
    '❌ Usage: tsx extract-types.ts <package-name> [--exclude=pattern1,pattern2] [--debug]',
  )
  process.exit(1)
}

const pkgName = args._[0]

function generateOutputFilename(packageName: string): string {
  let filename = packageName.startsWith('@') ? packageName.substring(1) : packageName
  filename = filename.replace(/\//g, '-')
  return `${filename}-types.txt`
}

const outputFile = generateOutputFilename(pkgName)

const options: ExtractorOptions = {
  packageName: pkgName,
  outputPath: outputFile,
  exclude: excludePatterns,
  plugins: [],
  debug: args.debug,
}

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}

const tokenCalculatorPlugin: Plugin = {
  name: 'tokenCalculator',
  processFileContent: (filePath, content) => {
    return content
  },
}

// Plugin to remove comments (keeping deprecation notices and JSDoc comments)
const commentRemoverPlugin: Plugin = {
  name: 'commentRemover',
  processFileContent: (filePath, content) => {
    // We'll keep all JSDoc comments and @deprecated comments
    // Only remove basic comments that aren't documentation

    // Remove single-line comments that are not JSDoc or @deprecated
    // This only removes comments that start with // and don't contain @deprecated
    const singleLinePattern = /(?<!\*)\/\/(?!.*@deprecated).*$/gm

    // First pass: remove single-line comments that aren't special
    let result = content.replace(singleLinePattern, '')

    // Remove empty lines created by comment removal
    result = result.replace(/^\s*[\r\n]/gm, '')

    return result
  },
}

// Plugin to remove imports
const importRemoverPlugin: Plugin = {
  name: 'importRemover',
  processFileContent: (filePath, content) => {
    // Pattern to match import statements
    const importPattern =
      /import\s+(?:(?:[^{}\s,]+)\s*,?\s*)?(?:{[^{}]*})?\s*from\s+['"][^'"]+['"];?\s*/g

    // Remove import statements
    let result = content.replace(importPattern, '')

    // Remove empty lines created by import removal
    result = result.replace(/^\s*[\r\n]/gm, '')

    return result
  },
}

const fileTreePlugin: Plugin = {
  name: 'fileTree',
  beforeProcess: async () => {
    console.log('🌲 File tree generator plugin activated')
  },
  afterProcess: async (stats, options) => {
    console.log('🌲 Generating file tree...')

    const tree: Record<string, any> = {}
    const sortedFiles = Array.from(stats.fileStats.entries()).sort(([pathA], [pathB]) =>
      pathA.localeCompare(pathB),
    )

    for (const [filePath, fileStats] of sortedFiles) {
      const parts = filePath.split(path.sep)
      let current = tree

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i]
        if (i === parts.length - 1) {
          current[part] = {
            tokens: fileStats.tokens,
          }
        } else {
          if (!current[part]) {
            current[part] = {}
          }
          current = current[part]
        }
      }
    }

    let treeOutput = '/* FILE TREE WITH TOKEN ESTIMATIONS */\n'

    function printTree(node: Record<string, any>, prefix = '', isLast = true, depth = 0) {
      Object.entries(node).forEach(([key, value], index, array) => {
        const isLastItem = index === array.length - 1
        const newPrefix = prefix + (isLast ? '    ' : '│   ')

        if (typeof value === 'object' && value !== null && !('tokens' in value)) {
          treeOutput += `${prefix}${isLastItem ? '└── ' : '├── '}📁 ${key}\n`
          printTree(value, newPrefix, isLastItem, depth + 1)
        } else {
          const tokens = value.tokens
          treeOutput += `${prefix}${isLastItem ? '└── ' : '├── '}📄 ${key} (~${tokens} tokens)\n`
        }
      })
    }

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

    // Now write everything to the output file from scratch
    let fullOutput = summaryOutput + top15Output + treeOutput

    // Add all file contents
    for (const [filePath, fileStats] of sortedFiles) {
      fullOutput += `\n/* --- ${filePath} --- */\n`
      fullOutput += fileStats.content
      fullOutput += '\n\n' // Add extra line breaks for separation
    }

    // Write the complete file
    await fs.writeFile(options.outputPath, fullOutput)

    console.log(`✅ Summary information and all file contents written to ${options.outputPath}`)
  },
}

const largestFilesPlugin: Plugin = {
  name: 'largestFiles',
  afterProcess: async (stats, options) => {
    console.log('📊 Top 15 files by token count:')

    const fileStatsArray = Array.from(stats.fileStats.entries())
      .map(([path, stats]) => ({
        path,
        tokens: stats.tokens,
      }))
      .sort((a, b) => b.tokens - a.tokens)

    const top15 = fileStatsArray.slice(0, 15)

    console.log('┌─────────────────────────────────────────────────────────────────────────────┐')
    console.log('│ #  │ Tokens    │ File Path                                                  │')
    console.log('├─────────────────────────────────────────────────────────────────────────────┤')

    top15.forEach((file, index) => {
      const num = (index + 1).toString().padStart(3)
      const tokens = file.tokens.toString().padStart(10)
      const pathDisplay = truncateMiddle(file.path, 60).padEnd(60)

      console.log(`│ ${num} │ ${tokens} │ ${pathDisplay} │`)
    })

    console.log('└─────────────────────────────────────────────────────────────────────────────┘')
  },
}

function truncateMiddle(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str

  const ellipsis = '...'
  const charsToShow = maxLength - ellipsis.length
  const frontChars = Math.ceil(charsToShow / 2)
  const backChars = Math.floor(charsToShow / 2)

  return str.substring(0, frontChars) + ellipsis + str.substring(str.length - backChars)
}

function arraysEqual(a: any[], b: any[]): boolean {
  if (a.length !== b.length) return false
  return a.every((val, index) => val === b[index])
}

options.plugins.push(tokenCalculatorPlugin)
options.plugins.push(commentRemoverPlugin)
options.plugins.push(importRemoverPlugin)
options.plugins.push(fileTreePlugin)
options.plugins.push(largestFilesPlugin)

async function listDirectoryContents(dir: string, depth = 1): Promise<void> {
  if (!options.debug) return

  try {
    console.log(`📂 Contents of ${dir}:`)
    const entries = await fs.readdir(dir, { withFileTypes: true })

    for (const entry of entries) {
      const indent = '  '.repeat(depth)
      const prefix = entry.isDirectory() ? '📁' : '📄'
      console.log(`${indent}${prefix} ${entry.name}`)

      if (entry.isDirectory() && depth < 2) {
        await listDirectoryContents(path.join(dir, entry.name), depth + 1)
      }
    }
  } catch (error: any) {
    if (options.debug) {
      console.error(`❌ Cannot read directory ${dir}: ${error.message}`)
    }
  }
}

async function findInPnpmStore(packageName: string): Promise<string | null> {
  try {
    const isPnpm = existsSync(path.resolve('./pnpm-lock.yaml'))
    if (!isPnpm) {
      if (options.debug) console.log('📦 Not a pnpm workspace')
      return null
    }

    if (options.debug) console.log('📦 Detected pnpm workspace, checking virtual store...')

    const pnpmStorePath = path.resolve('./node_modules/.pnpm')

    if (!existsSync(pnpmStorePath)) {
      if (options.debug) console.log('❓ No .pnpm directory found in node_modules')
      return null
    }

    const packageNameWithoutScope = packageName.split('/').pop() || packageName

    const entries = await fs.readdir(pnpmStorePath, { withFileTypes: true })

    const matchingEntries = entries
      .filter((entry) => entry.isDirectory())
      .filter(
        (entry) =>
          entry.name.startsWith(packageName.replace('/', '+')) ||
          entry.name.startsWith(packageNameWithoutScope + '@'),
      )

    if (matchingEntries.length === 0) {
      if (options.debug)
        console.log(`❓ No matching packages found for ${packageName} in pnpm store`)
      return null
    }

    for (const entry of matchingEntries) {
      const potentialPath = path.join(pnpmStorePath, entry.name, 'node_modules', packageName)

      if (existsSync(potentialPath)) {
        console.log(`✅ Found package in pnpm store: ${potentialPath}`)
        return potentialPath
      }
    }

    if (options.debug)
      console.log(`❓ Package ${packageName} not found in any matching pnpm store entries`)
    return null
  } catch (error: any) {
    console.error(`❌ Error searching pnpm store: ${error.message}`)
    return null
  }
}

async function resolvePackageRoot(packageName: string): Promise<string> {
  try {
    console.log(`🔍 Attempting to resolve package: ${packageName}`)

    const directPath = path.resolve('./node_modules', packageName)
    if (existsSync(directPath)) {
      console.log(`✅ Found package directly in node_modules: ${directPath}`)
      return directPath
    }

    const pnpmPath = await findInPnpmStore(packageName)
    if (pnpmPath) {
      return pnpmPath
    }

    try {
      const { createRequire } = (await import('module')).default
      const require = createRequire(import.meta.url)
      const resolved = require.resolve(packageName)

      console.log(`✅ Resolved package using require.resolve: ${resolved}`)

      let dir = path.dirname(resolved)
      while (true) {
        const pkgJson = path.join(dir, 'package.json')
        if (existsSync(pkgJson)) {
          console.log(`📂 Found package root at: ${dir}`)
          return dir
        }

        const parent = path.dirname(dir)
        if (parent === dir) break
        dir = parent
      }
    } catch (error: any) {
      if (options.debug) console.error(`❌ require.resolve failed: ${error.message}`)
    }

    console.error('❌ Could not resolve package through any method')

    if (options.debug) {
      console.log('🔍 Checking workspace structure...')
      await listDirectoryContents('./node_modules', 1)

      try {
        const pkgJson = JSON.parse(await fs.readFile('./package.json', 'utf-8'))
        const hasDependency = !!(
          pkgJson.dependencies?.[packageName] ||
          pkgJson.devDependencies?.[packageName] ||
          pkgJson.peerDependencies?.[packageName]
        )

        console.log(`📦 Package ${hasDependency ? 'is' : 'is NOT'} listed in package.json`)

        if (hasDependency) {
          console.log(
            `📦 Version specified: ${
              pkgJson.dependencies?.[packageName] ||
              pkgJson.devDependencies?.[packageName] ||
              pkgJson.peerDependencies?.[packageName]
            }`,
          )
        }
      } catch (error: any) {
        console.error(`❌ Error reading package.json: ${error.message}`)
      }
    }

    throw new Error(`Could not resolve package: ${packageName}`)
  } catch (error: any) {
    console.error(`❌ Error resolving package root: ${error.message}`)
    throw error
  }
}

async function findAllDTSFiles(dir: string, stats: ProcessStats): Promise<string[]> {
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
        return findAllDTSFiles(fullPath, stats)
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

    for (const plugin of options.plugins) {
      if (plugin.beforeProcess) {
        await plugin.beforeProcess(options)
      }
    }

    const root = await resolvePackageRoot(options.packageName)
    console.log(`🔍 Looking for .d.ts files in: ${root}`)

    const dtsFiles = await findAllDTSFiles(root, stats)
    stats.totalFiles = dtsFiles.length + stats.skippedFiles

    if (dtsFiles.length === 0) {
      console.warn('⚠️ No .d.ts files found for this package (or all were excluded)')
      return
    }

    console.log(
      `📝 Found ${dtsFiles.length} .d.ts files (${stats.skippedFiles} skipped), writing to ${options.outputPath}`,
    )

    // Create write stream for temporary initial data
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

        // Apply content processing plugins
        for (const plugin of options.plugins) {
          if (plugin.processFileContent) {
            content = await plugin.processFileContent(file, content, options)
          }
        }

        // Calculate tokens on the processed content
        const tokens = estimateTokens(content)
        stats.totalTokens += tokens

        // Store file stats with the content for later use
        stats.fileStats.set(relPath, {
          path: relPath,
          size: originalSize,
          tokens,
          content,
        })

        stats.processedFiles++
      } catch (error: any) {
        console.error(`❌ Error reading file ${file}: ${error.message}`)
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

try {
  console.log('🔧 Type extraction utility starting...')
  console.log(`📦 Target package: ${options.packageName}`)
  console.log(`📄 Output file: ${options.outputPath}`)
  console.log(
    `🔍 Exclude patterns: ${options.exclude.length > 0 ? options.exclude.join(', ') : 'None'}`,
  )

  dumpTypesToFile(options).catch((error) => {
    console.error(`❌ Extraction process failed: ${error.message}`)
    process.exit(1)
  })
} catch (error: any) {
  console.error(`❌ Fatal error: ${error.message}`)
  process.exit(1)
}
