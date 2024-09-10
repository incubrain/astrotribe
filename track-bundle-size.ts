import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

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
  largestFiles: Array<{ name: string; size: number }>
}

function getDirectorySize(directory: string): { size: number; fileCount: number } {
  let totalSize = 0
  let fileCount = 0
  const files = fs.readdirSync(directory)

  files.forEach((file) => {
    const filePath = path.join(directory, file)
    const stats = fs.statSync(filePath)

    if (stats.isFile()) {
      totalSize += stats.size
      fileCount++
    } else if (stats.isDirectory()) {
      const subDirStats = getDirectorySize(filePath)
      totalSize += subDirStats.size
      fileCount += subDirStats.fileCount
    }
  })

  return { size: totalSize, fileCount }
}

function bytesToMB(bytes: number): string {
  return (bytes / 1024 / 1024).toFixed(3)
}

function getLargestFiles(
  directory: string,
  top: number = 5,
): Array<{ name: string; size: number }> {
  const files = fs.readdirSync(directory)
  const fileSizes = files.map((file) => {
    const filePath = path.join(directory, file)
    const stats = fs.statSync(filePath)
    return { name: file, size: stats.size }
  })
  return fileSizes.sort((a, b) => b.size - a.size).slice(0, top)
}

function trackBundleSize(): void {
  const startTime = Date.now()

  const buildDir = path.join('.', '.output')
  const clientDir = path.join(buildDir, 'public')
  const serverDir = path.join(buildDir, 'server')

  const clientStats = getDirectorySize(clientDir)
  const serverStats = getDirectorySize(serverDir)
  const totalSize = clientStats.size + serverStats.size

  let gitCommit = 'unknown'
  try {
    gitCommit = execSync('git rev-parse HEAD').toString().trim()
  } catch (error) {
    console.warn('Unable to get Git commit hash:', error)
  }

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
    gzipClientSize: 0, // You'll need to implement gzip size calculation
    gzipServerSize: 0, // You'll need to implement gzip size calculation
    clientFileCount: clientStats.fileCount,
    serverFileCount: serverStats.fileCount,
    largestFiles: getLargestFiles(clientDir, 5),
  }

  let history: BundleSizeData[] = []
  const historyFile = path.join('bundle-size-history.json')

  if (fs.existsSync(historyFile)) {
    try {
      history = JSON.parse(fs.readFileSync(historyFile, 'utf8'))
    } catch (error) {
      console.warn('Error reading history file:', error)
    }
  }

  history.push(data)

  try {
    fs.writeFileSync(historyFile, JSON.stringify(history, null, 2))
    console.log('Bundle size tracked:', data)
  } catch (error) {
    console.error('Error writing history file:', error)
  }
}

trackBundleSize()
