import * as fs from 'fs'
import * as path from 'path'

// Configuration
const OUTPUT_FILE = 'tsconfig-collection.txt'
const TSCONFIG_PATTERN = /tsconfig.*\.json$/

function findTsConfigFiles(dir: string): string[] {
  const results: string[] = []

  const items = fs.readdirSync(dir)

  for (const item of items) {
    const fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      // Skip node_modules directories
      if (item === 'node_modules') continue

      // Recursively search subdirectories
      results.push(...findTsConfigFiles(fullPath))
    } else if (TSCONFIG_PATTERN.test(item)) {
      results.push(fullPath)
    }
  }

  return results
}

function collectTsConfigs(rootDir: string): void {
  try {
    // Find all tsconfig files
    const tsConfigFiles = findTsConfigFiles(rootDir)

    if (tsConfigFiles.length === 0) {
      console.log('No tsconfig files found!')
      return
    }

    // Create output content with file paths and contents
    const output = tsConfigFiles
      .map((filePath) => {
        const relativePath = path.relative(rootDir, filePath)
        const content = fs.readFileSync(filePath, 'utf8')

        return `
=== ${relativePath} ===
${content}
`
      })
      .join('\n')

    // Write to output file
    fs.writeFileSync(OUTPUT_FILE, output.trim())

    console.log(`Successfully collected ${tsConfigFiles.length} tsconfig files to ${OUTPUT_FILE}`)
    console.log('Found tsconfig files:')
    tsConfigFiles.forEach((file) => {
      console.log(`- ${path.relative(rootDir, file)}`)
    })
  } catch (error: any) {
    console.error('Error collecting tsconfig files:', error)
  }
}

// Get the root directory from command line argument or use current directory
const rootDir = process.argv[2] || process.cwd()
collectTsConfigs(rootDir)
