// tools/generators/dto/modules/transformers.ts
import { TemplateEngine } from '../templates/template.engine'
import type { ModelMetadata, FieldMetadata, TransformationRule, TransformationType } from '../types'

/**
 * TransformationGenerator handles the generation of transformation decorators
 * and utility methods for converting data between different formats and types.
 */
export class TransformationGenerator {
  /**
   * Generates transformation rules for a model
   */
  generateTransformationRules(model: ModelMetadata): TransformationRule[] {
    const context = {
      model,
      fields: this.prepareFields(model.fields),
    }

    return this.processTransformations(context)
  }

  /**
   * Prepare fields with their transformations
   */
  private prepareFields(fields: FieldMetadata[]): any[] {
    return fields.map((field) => ({
      ...field,
      transformations: [
        ...this.getTypeTransformations(field),
        ...this.getCaseTransformations(field),
        ...this.getCustomTransformations(field),
      ],
    }))
  }

  /**
   * Get type-specific transformations
   */
  private getTypeTransformations(field: FieldMetadata): TransformationRule[] {
    const rules: TransformationRule[] = []

    switch (field.type.toLowerCase()) {
      case 'date':
      case 'datetime':
        rules.push({
          type: 'toDate',
          params: ['ISO'],
          options: {
            format: 'ISO',
          },
        })
        break

      case 'number':
      case 'int':
      case 'float':
      case 'decimal':
        rules.push({
          type: 'toNumber',
          params: [field.documentation?.description?.includes('@integer') ? 'integer' : 'float'],
          options: {
            precision: field.documentation?.description?.includes('@precision')
              ? this.extractPrecision(field.documentation.description)
              : undefined,
          },
        })
        break

      case 'boolean':
        rules.push({
          type: 'toBoolean',
        })
        break

      case 'string':
        rules.push({
          type: 'toString',
          options: {
            nullIfEmpty: true,
          },
        })
        break
    }

    return rules
  }

  /**
   * Get case transformations for string fields
   */
  private getCaseTransformations(field: FieldMetadata): TransformationRule[] {
    const rules: TransformationRule[] = []
    const docs = field.documentation?.description || ''

    if (docs.includes('@lowercase')) {
      rules.push({
        type: 'custom',
        params: ['(value) => value?.toLowerCase()'],
        options: {
          preValidation: true,
        },
      })
    }

    if (docs.includes('@uppercase')) {
      rules.push({
        type: 'custom',
        params: ['(value) => value?.toUpperCase()'],
        options: {
          preValidation: true,
        },
      })
    }

    if (docs.includes('@trim')) {
      rules.push({
        type: 'custom',
        params: ['(value) => typeof value === "string" ? value.trim() : value'],
        options: {
          preValidation: true,
        },
      })
    }

    return rules
  }

  /**
   * Get custom transformations from documentation
   */
  private getCustomTransformations(field: FieldMetadata): TransformationRule[] {
    const rules: TransformationRule[] = []
    const docs = field.documentation?.description || ''

    // Parse @transform directives
    const transformMatches = docs.matchAll(/@transform\s*\((.*?)\)/g)
    for (const match of Array.from(transformMatches)) {
      const [type, ...params] = match[1].split(',').map((param) => param.trim())
      rules.push({
        type: type as TransformationType,
        params: params.length ? params : undefined,
      })
    }

    return rules
  }

  /**
   * Processes transformation rules into a template context
   */
  private processTransformations(context: any): TransformationRule[] {
    const templateResult = TemplateEngine.process('schema/transform', context)
    return this.parseTransformationContent(templateResult)
  }

  /**
   * Parse transformation content from template result
   */
  private parseTransformationContent(content: string): TransformationRule[] {
    // This would need to parse the generated content back into rules
    // For now, return empty array as this needs to be implemented based on
    // the specific template format used
    return []
  }

  /**
   * Extract precision from documentation
   */
  private extractPrecision(docs: string): number | undefined {
    const match = docs.match(/@precision\((\d+)\)/)
    return match ? parseInt(match[1], 10) : undefined
  }

  /**
   * Generates utility methods for transforming entire DTOs
   */
  generateTransformationMethods(model: ModelMetadata): string {
    const context = {
      model,
      hasRelations: model.relationships?.length > 0,
    }

    return TemplateEngine.process('schema/transform.methods', context)
  }
}
