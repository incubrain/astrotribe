// cli/store.ts
import fs from 'fs/promises'
import path from 'path'

export class FileStore implements CLIStore {
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
    } catch (error) {
      return null
    }
  }
}
