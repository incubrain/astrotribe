import fs from 'fs/promises'
import path from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'
import zlib from 'zlib'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const execAsync = promisify(exec)
const gzipAsync = promisify(zlib.gzip)

interface BundleSizeData {
  date: string
  clientSize: number
  serverSize: number
  totalSize: number
  clientSizeMB: string
  serverSizeMB: string
  totalSizeMB: string
  gitCommit: string
  buildTime: number
  nodeVersion: string
  environment: string
  gzipClientSize: number
  gzipServerSize: number
  clientFileCount: number
  serverFileCount: number
  largestFiles: Array<{ name: string, size: number, path: string }>
}

async function getDirectorySize(directory: string): Promise<{ size: number, fileCount: number }> {
  let totalSize = 0
  let fileCount = 0
  const files = await fs.readdir(directory)

  for (const file of files) {
    const filePath = path.join(directory, file)
    const stats = await fs.stat(filePath)

    if (stats.isFile()) {
      totalSize += stats.size
      fileCount++
    } else if (stats.isDirectory()) {
      const subDirStats = await getDirectorySize(filePath)
      totalSize += subDirStats.size
      fileCount += subDirStats.fileCount
    }
  }

  return { size: totalSize, fileCount }
}

function bytesToMB(bytes: number): string {
  return (bytes / (1024 * 1024)).toFixed(3)
}

async function getAllFiles(
  directory: string,
): Promise<Array<{ name: string, size: number, path: string }>> {
  const files = await fs.readdir(directory)
  const fileInfos: Array<{ name: string, size: number, path: string }> = []

  for (const file of files) {
    const filePath = path.join(directory, file)
    const stats = await fs.stat(filePath)

    if (stats.isFile()) {
      fileInfos.push({ name: file, size: stats.size, path: filePath })
    } else if (stats.isDirectory()) {
      fileInfos.push(...(await getAllFiles(filePath)))
    }
  }

  return fileInfos
}

async function getLargestFiles(
  directory: string,
  top: number = 5,
): Promise<Array<{ name: string, size: number, path: string }>> {
  const allFiles = await getAllFiles(directory)
  return allFiles
    .sort((a, b) => b.size - a.size)
    .slice(0, top)
    .map((file) => ({
      ...file,
      path: path.relative(directory, file.path),
    }))
}

async function getGzipSize(filePath: string): Promise<number> {
  const content = await fs.readFile(filePath)
  const gzipped = await gzipAsync(content)
  return gzipped.length
}

async function getDirectoryGzipSize(directory: string): Promise<number> {
  let totalGzipSize = 0
  const files = await fs.readdir(directory)

  for (const file of files) {
    const filePath = path.join(directory, file)
    const stats = await fs.stat(filePath)

    if (stats.isFile()) {
      totalGzipSize += await getGzipSize(filePath)
    } else if (stats.isDirectory()) {
      totalGzipSize += await getDirectoryGzipSize(filePath)
    }
  }

  return totalGzipSize
}

async function trackBundleSize(): Promise<void> {
  const startTime = Date.now()

  const buildDir = path.join('.', '.output')
  const clientDir = path.join(buildDir, 'public')
  const serverDir = path.join(buildDir, 'server')

  try {
    const [clientStats, serverStats, gitCommit, largestFiles] = await Promise.all([
      getDirectorySize(clientDir),
      getDirectorySize(serverDir),
      execAsync('git rev-parse HEAD').then((res) => res.stdout.trim()),
      getLargestFiles(clientDir, 10), // Increased to top 10 files for more comprehensive view
    ])

    const totalSize = clientStats.size + serverStats.size

    const [gzipClientSize, gzipServerSize] = await Promise.all([
      getDirectoryGzipSize(clientDir),
      getDirectoryGzipSize(serverDir),
    ])

    const data: BundleSizeData = {
      date: new Date().toISOString(),
      clientSize: clientStats.size,
      serverSize: serverStats.size,
      totalSize,
      clientSizeMB: bytesToMB(clientStats.size),
      serverSizeMB: bytesToMB(serverStats.size),
      totalSizeMB: bytesToMB(totalSize),
      gitCommit,
      buildTime: Date.now() - startTime,
      nodeVersion: process.version,
      environment: process.env.NODE_ENV || 'development',
      gzipClientSize,
      gzipServerSize,
      clientFileCount: clientStats.fileCount,
      serverFileCount: serverStats.fileCount,
      largestFiles,
    }

    const reportsDir = path.join(__dirname, '..', 'reports', 'bundle-size')
    await fs.mkdir(reportsDir, { recursive: true })

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const reportFile = path.join(reportsDir, `bundle-size-${timestamp}.json`)

    await fs.writeFile(reportFile, JSON.stringify(data, null, 2))
    console.log(`Bundle size report saved: ${reportFile}`)

    const N = 20 // Keep only the last N reports
    const files = await fs.readdir(reportsDir)
    const sortedFiles = files.sort((a, b) => b.localeCompare(a)) // Sort in descending order

    for (const file of sortedFiles.slice(N)) {
      await fs.unlink(path.join(reportsDir, file))
    }

    console.log(`Keeping the last ${N} reports.`)
  } catch (error) {
    console.error('Error tracking bundle size:', error)
  }
}

trackBundleSize().catch(console.error)
