import path from 'path'
import fs from 'fs'
import { constants } from 'fs'
import fsPromise from 'fs/promises'

interface FilePath {
  baseDir?: string
  dir: string
  file: string
  extension?: string
}

export function getFilePath({
  baseDir = './logs',
  dir,
  file,
  extension = '.json',
}: FilePath): string {
  return path.resolve(process.cwd(), baseDir, dir, `${file}${extension}`)
}

export function readJSONFile(filePath: string): any {
  if (fs.existsSync(filePath)) {
    const rawJSON = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(rawJSON).flat()
  } else {
    console.warn(`File not found: ${filePath}`)
    return null
  }
}

export async function ensureDirectoryExists(dirPath: string): Promise<void> {
  try {
    await fsPromise.access(dirPath, constants.F_OK)
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      try {
        await fsPromise.mkdir(dirPath, { recursive: true })
        console.log(`Created directory: ${dirPath}`)
      } catch (mkdirError) {
        console.error(`Error creating directory ${dirPath}:`, mkdirError)
        throw mkdirError
      }
    } else {
      console.error(`Error checking directory ${dirPath}:`, error)
      throw error
    }
  }
}
