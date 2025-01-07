// tools/generators/dto/utils/documentation-parser.ts
import { DMMF } from '@prisma/generator-helper'
import type { ValidationRule, TransformationRule, DocumentationMetadata } from '../types'

/**
 * DocumentationParser extracts and processes documentation from Prisma schema
 * comments and converts them into structured metadata that can be used
 * throughout the generator.
 */
export class DocumentationParser {
  /**
   * Parses model-level documentation, extracting metadata and special
   * directives that affect code generation.
   */
  parseModelDocumentation(model: DMMF.Model): DocumentationMetadata {
    const docs = model.documentation || ''

    return {
      description: this.extractDescription(docs),
      example: this.extractExample(docs),
      deprecated: this.isDeprecated(docs),
      version: this.extractVersion(docs),
      since: this.extractSince(docs),
    }
  }

  /**
   * Parses field-level documentation, extracting validation rules,
   * examples, and other metadata.
   */
  parseFieldDocumentation(field: DMMF.Field): DocumentationMetadata {
    const docs = field.documentation || ''

    return {
      description: this.extractDescription(docs),
      example: this.extractExample(docs),
      deprecated: this.isDeprecated(docs),
      version: this.extractVersion(docs),
      validationRules: this.extractValidationRules(docs, field),
      transformationRules: this.extractTransformationRules(docs),
    }
  }

  /**
   * Extracts the main description from a documentation string,
   * removing special directives and annotations.
   */
  private extractDescription(docs: string): string {
    // Remove all special annotations
    return docs
      .replace(/@\w+\([^)]*\)/g, '') // Remove @decorator(...) style annotations
      .replace(/@\w+/g, '') // Remove @tag style annotations
      .trim()
  }

  /**
   * Extracts example values from documentation.
   * Examples can be specified using @example annotation.
   */
  private extractExample(docs: string): any {
    const exampleMatch = docs.match(/@example\s+([^@]+)/)
    if (!exampleMatch) return undefined

    try {
      // Try to parse as JSON first
      return JSON.parse(exampleMatch[1].trim())
    } catch {
      // If not valid JSON, return as string
      return exampleMatch[1].trim()
    }
  }

  /**
   * Checks if an entity is marked as deprecated.
   */
  private isDeprecated(docs: string): boolean {
    return docs.includes('@deprecated')
  }

  /**
   * Extracts version information from documentation.
   */
  private extractVersion(docs: string): string | undefined {
    const versionMatch = docs.match(/@version\s+([^\s@]+)/)
    return versionMatch ? versionMatch[1] : undefined
  }

  /**
   * Extracts the version when a feature was introduced.
   */
  private extractSince(docs: string): string | undefined {
    const sinceMatch = docs.match(/@since\s+([^\s@]+)/)
    return sinceMatch ? sinceMatch[1] : undefined
  }

  /**
   * Extracts validation rules from documentation comments.
   * These can be specified using @validate annotation.
   */
  private extractValidationRules(docs: string, field: DMMF.Field): ValidationRule[] {
    const rules: ValidationRule[] = []
    const validationMatches = docs.matchAll(/@validate\s*\(([^)]+)\)/g)

    for (const match of validationMatches) {
      const [decorator, ...params] = match[1].split(',').map((param) => param.trim())

      rules.push({
        decorator,
        params: params.length ? params : undefined,
      })
    }

    return rules
  }

  /**
   * Extracts transformation rules from documentation comments.
   * These can be specified using @transform annotation.
   */
  private extractTransformationRules(docs: string): TransformationRule[] {
    const rules: TransformationRule[] = []
    const transformMatches = docs.matchAll(/@transform\s*\(([^)]+)\)/g)

    for (const match of transformMatches) {
      const [type, ...params] = match[1].split(',').map((param) => param.trim())

      rules.push({
        type: type as any,
        params: params.length ? params : undefined,
      })
    }

    return rules
  }
}
