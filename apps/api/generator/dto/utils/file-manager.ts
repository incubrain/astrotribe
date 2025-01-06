// tools/generators/dto/utils/file-manager.ts
import { mkdir, writeFile, readFile } from 'fs/promises'
import { join, dirname } from 'path'
import * as prettier from 'prettier'
import { TemplateEngine } from './template-engine'
import type { ModelMetadata } from '../types'

/**
 * FileManager handles all file system operations for the generator.
 * It provides a consistent interface for file operations and ensures
 * proper formatting of generated code.
 */
export class FileManager {
  constructor(
    private readonly basePath: string,
    private readonly prettierConfig?: prettier.Options,
  ) {}

  /**
   * Initializes the directory structure needed for generation.
   * Creates directories for different types of generated files.
   */
  async initializeDirectory(): Promise<void> {
    const directories = ['dto', 'interfaces', 'schemas', 'documentation', 'examples', 'guards']

    await Promise.all(
      directories.map((dir) => mkdir(join(this.basePath, dir), { recursive: true })),
    )
  }

  /**
   * Writes a file with proper formatting applied.
   * Handles different file types (TypeScript, Markdown, etc.) appropriately.
   */
  async writeFile(relativePath: string, content: string): Promise<void> {
    const fullPath = join(this.basePath, relativePath)
    await mkdir(dirname(fullPath), { recursive: true })

    // Format the content based on file type
    const formattedContent = await this.formatContent(relativePath, content)

    await writeFile(fullPath, formattedContent, 'utf8')
  }

  /**
   * Reads a template file from the templates directory.
   */
  async readTemplate(templateName: string): Promise<string> {
    const templatePath = join(__dirname, '../templates', templateName)
    return readFile(templatePath, 'utf8')
  }

  /**
   * Formats content using Prettier with appropriate config.
   */
  private async formatContent(filepath: string, content: string): Promise<string> {
    // Skip formatting for template files
    if (filepath.endsWith('.hbs')) {
      return content
    }

    // Only format TypeScript files that don't contain Handlebars templates
    if (filepath.endsWith('.ts') && !content.includes('{{')) {
      try {
        return prettier.format(content, {
          ...this.prettierConfig,
          parser: 'typescript',
        })
      } catch (error) {
        console.warn(`Warning: Could not format ${filepath}`, error)
        return content
      }
    }

    return content
  }

  /**
   * Writes a template-based file with proper formatting and organization
   */
  async writeTemplateFile(
    relativePath: string,
    template: string,
    context: Record<string, any>,
  ): Promise<void> {
    // Process the template first
    const processedContent = TemplateEngine.process(template, context)

    // Write the processed content
    await this.writeFile(relativePath, processedContent)
  }

  /**
   * Creates a complete set of related files for a model
   */
  async writeModelFiles(model: ModelMetadata): Promise<void> {
    const templates = await Promise.all([
      this.readTemplate('interface.hbs'),
      this.readTemplate('schema.hbs'),
    ])

    await Promise.all([
      this.writeTemplateFile(`interfaces/${model.name.toLowerCase()}.interface.ts`, templates[0], {
        model,
      }),
      this.writeTemplateFile(`schemas/${model.name.toLowerCase()}.schema.ts`, templates[1], {
        model,
      }),
    ])
  }
}
