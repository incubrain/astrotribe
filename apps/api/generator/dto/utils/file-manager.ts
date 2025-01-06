// tools/generators/dto/utils/file-manager.ts
import { mkdir, writeFile } from 'fs/promises'
import { join, dirname } from 'path'
import * as prettier from 'prettier'

/**
 * FileManager handles all file system operations for the generator.
 * It provides a consistent interface for file operations and ensures
 * proper formatting of generated code.
 */
export class FileManager {
  constructor(private readonly basePath: string) {}

  /**
   * Initializes the directory structure needed for generation.
   * Creates directories for different types of generated files.
   */
  async initializeDirectory(): Promise<void> {
    try {
      console.log(`Initializing directory: ${this.basePath}`)
      await mkdir(this.basePath, { recursive: true })
      console.log('Directory initialized successfully')
    } catch (error) {
      console.error('Failed to initialize directory:', error)
      throw error
    }
  }

  /**
   * Writes a file with proper formatting applied.
   * Handles different file types (TypeScript, Markdown, etc.) appropriately.
   */
  async writeFile(relativePath: string, content: string): Promise<void> {
    try {
      const fullPath = join(this.basePath, relativePath)
      console.log(`Writing file to: ${fullPath}`)
      await mkdir(dirname(fullPath), { recursive: true })
      await writeFile(fullPath, content, 'utf-8')
      console.log(`Successfully wrote file: ${relativePath}`)
    } catch (error) {
      console.error(`Failed to write file ${relativePath}:`, error)
      throw error
    }
  }
}
