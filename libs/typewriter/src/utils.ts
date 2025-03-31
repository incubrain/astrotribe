import path from 'node:path'
import fs from 'node:fs/promises'
import { existsSync } from 'node:fs'

/**
 * Estimates the number of tokens in a text string
 * Using rough approximation of 4 characters per token
 */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}

/**
 * Truncates a string in the middle if it's too long
 */
export function truncateMiddle(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str

  const ellipsis = '...'
  const charsToShow = maxLength - ellipsis.length
  const frontChars = Math.ceil(charsToShow / 2)
  const backChars = Math.floor(charsToShow / 2)

  return str.substring(0, frontChars) + ellipsis + str.substring(str.length - backChars)
}

/**
 * Compares two arrays for equality
 */
export function arraysEqual(a: any[], b: any[]): boolean {
  if (a.length !== b.length) return false
  return a.every((val, index) => val === b[index])
}

/**
 * Generates an output filename from a package name
 */
export function generateOutputFilename(packageName: string): string {
  let filename = packageName.startsWith('@') ? packageName.substring(1) : packageName
  filename = filename.replace(/\//g, '-')
  return `${filename}-types.txt`
}

/**
 * Lists directory contents for debugging
 */
export async function listDirectoryContents(dir: string, debug: boolean, depth = 1): Promise<void> {
  if (!debug) return

  try {
    console.log(`📂 Contents of ${dir}:`)
    const entries = await fs.readdir(dir, { withFileTypes: true })

    for (const entry of entries) {
      const indent = '  '.repeat(depth)
      const prefix = entry.isDirectory() ? '📁' : '📄'
      console.log(`${indent}${prefix} ${entry.name}`)

      if (entry.isDirectory() && depth < 2) {
        await listDirectoryContents(path.join(dir, entry.name), debug, depth + 1)
      }
    }
  } catch (error: any) {
    if (debug) {
      console.error(`❌ Cannot read directory ${dir}: ${error.message}`)
    }
  }
}

/**
 * Find package in pnpm store
 */
export async function findInPnpmStore(packageName: string, debug: boolean): Promise<string | null> {
  try {
    const isPnpm = existsSync(path.resolve('./pnpm-lock.yaml'))
    if (!isPnpm) {
      if (debug) console.log('📦 Not a pnpm workspace')
      return null
    }

    if (debug) console.log('📦 Detected pnpm workspace, checking virtual store...')

    const pnpmStorePath = path.resolve('./node_modules/.pnpm')

    if (!existsSync(pnpmStorePath)) {
      if (debug) console.log('❓ No .pnpm directory found in node_modules')
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
      if (debug) console.log(`❓ No matching packages found for ${packageName} in pnpm store`)
      return null
    }

    for (const entry of matchingEntries) {
      const potentialPath = path.join(pnpmStorePath, entry.name, 'node_modules', packageName)

      if (existsSync(potentialPath)) {
        console.log(`✅ Found package in pnpm store: ${potentialPath}`)
        return potentialPath
      }
    }

    if (debug) console.log(`❓ Package ${packageName} not found in any matching pnpm store entries`)
    return null
  } catch (error: any) {
    console.error(`❌ Error searching pnpm store: ${error.message}`)
    return null
  }
}

/**
 * Resolve package root path
 */
export async function resolvePackageRoot(packageName: string, debug: boolean): Promise<string> {
  try {
    console.log(`🔍 Attempting to resolve package: ${packageName}`)

    const directPath = path.resolve('./node_modules', packageName)
    if (existsSync(directPath)) {
      console.log(`✅ Found package directly in node_modules: ${directPath}`)
      return directPath
    }

    const pnpmPath = await findInPnpmStore(packageName, debug)
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
      if (debug) console.error(`❌ require.resolve failed: ${error.message}`)
    }

    console.error('❌ Could not resolve package through any method')

    if (debug) {
      console.log('🔍 Checking workspace structure...')
      await listDirectoryContents('./node_modules', debug, 1)

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
