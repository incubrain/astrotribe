import { readdir, rename, readFile, writeFile } from 'fs/promises'
import { join, extname } from 'path'

const targetDir = './'
const dryRun = false

const EXCLUDE_DIRS = new Set([
  'node_modules',
  'supabase',
  '.output',
  '.nuxt',
  'output',
  'dist',
  'logs',
  'migrations',
  'generated',
  'build',
  '.pnpm',
  'pnpm-store',
  'vendor',
  'coverage',
  'tmp',
  '.git',
])
const EXCLUDE_FILES = new Set(['.DS_Store', '.env'])
const EXCLUDE_EXTENSIONS = new Set(['.sql', '.sqlite'])
const REFERENCE_FILE_EXTENSIONS = ['.ts', '.js', '.vue', '.json', '.yml', '.md']

// STAGE 1 → Find files with underscores

async function findFilesWithUnderscores(dir: string, found: string[] = []) {
  const entries = await readdir(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = join(dir, entry.name)

    if (entry.isDirectory()) {
      if (EXCLUDE_DIRS.has(entry.name)) {
        continue
      }
      await findFilesWithUnderscores(fullPath, found)
      continue
    }

    if (EXCLUDE_FILES.has(entry.name)) {
      continue
    }

    const ext = extname(entry.name)
    if (EXCLUDE_EXTENSIONS.has(ext)) {
      continue
    }

    if (entry.name.includes('_')) {
      found.push(fullPath)
    }
  }

  return found
}

// STAGE 2 → Rename + Scan

async function renameAndScan(files: string[]) {
  for (const file of files) {
    const ext = extname(file)
    const dir = file.slice(0, file.lastIndexOf('/'))
    const fileName = file.slice(file.lastIndexOf('/') + 1)
    const newName = fileName.replace(/_/g, '-')
    const newPath = join(dir, newName)
    const baseNameNoExt = fileName.replace(ext, '')

    if (newName !== fileName) {
      if (dryRun) {
        console.log(`[DRY RUN] Rename: ${file} → ${newPath}`)
      } else {
        console.log(`Renaming: ${file} → ${newPath}`)
        await rename(file, newPath)
      }
    }

    // Scan for references
    console.log(`🔎 Scanning for references to ${baseNameNoExt}...`)
    await scanReferences(targetDir, baseNameNoExt)
  }
}

async function scanReferences(dir: string, search: string) {
  const entries = await readdir(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = join(dir, entry.name)

    if (entry.isDirectory()) {
      if (EXCLUDE_DIRS.has(entry.name)) {
        continue
      }
      await scanReferences(fullPath, search)
      continue
    }

    const ext = extname(entry.name)
    if (!REFERENCE_FILE_EXTENSIONS.includes(ext)) {
      continue
    }

    const content = await readFile(fullPath, 'utf8')
    if (content.includes(search)) {
      console.log(`🚨 Reference found in: ${fullPath}`)

      const regex = new RegExp(`\\b${search}\\b`, 'g')
      const updatedContent = content.replace(regex, search.replace(/_/g, '-'))

      if (content !== updatedContent) {
        if (dryRun) {
          console.log(`[DRY RUN] Would update references in: ${fullPath}`)
        } else {
          await writeFile(fullPath, updatedContent, 'utf8')
          console.log(`✏️ Updated references in: ${fullPath}`)
        }
      }
    }
  }
}

// MAIN EXECUTION

async function main() {
  console.log(`📦 Scanning for files with underscores in: ${targetDir}`)
  const files = await findFilesWithUnderscores(targetDir)

  console.log(`\n✅ Found ${files.length} files with underscores:`)
  for (const file of files) {
    console.log(`→ ${file}`)
  }

  if (files.length === 0) {
    console.log('No files to process.')
    return
  }

  console.log('\n🚀 Starting rename + reference scan...')
  await renameAndScan(files)

  console.log('\n✅ Done processing.')
}

main().catch((err) => console.error('❌ Error:', err))
