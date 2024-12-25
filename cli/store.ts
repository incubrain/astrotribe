// cli/store.ts

import fs from 'fs/promises'
import path from 'path'

export class FileStore {
  private storePath: string

  constructor(baseDir: string = '.cli-store') {
    this.storePath = path.join(process.cwd(), baseDir)
  }

  async save(key: string, data: any): Promise<void> {
    await fs.mkdir(this.storePath, { recursive: true })
    const filePath = path.join(this.storePath, `${key}.json`)
    await fs.writeFile(filePath, JSON.stringify(data, null, 2))
  }

  async load(key: string): Promise<any> {
    try {
      const filePath = path.join(this.storePath, `${key}.json`)
      const data = await fs.readFile(filePath, 'utf-8')
      return JSON.parse(data)
    } catch (error: any) {
      return null
    }
  }

  async clear(flowId?: string): Promise<void> {
    try {
      if (flowId) {
        // Remove all files starting with flowId
        const files = await fs.readdir(this.storePath)
        await Promise.all(
          files
            .filter((file) => file.startsWith(`${flowId}-`))
            .map((file) => fs.unlink(path.join(this.storePath, file))),
        )
      } else {
        // Remove the entire store directory
        await fs.rm(this.storePath, { recursive: true, force: true })
      }
    } catch (error: any) {
      // Ignore errors if directory doesn't exist
      if (error.code !== 'ENOENT') {
        throw error
      }
    }
  }
}
