// tools/generators/dto/modules/transformers.ts
import { TransformationRule, FieldMetadata, ModelMetadata } from '../core/types'

/**
 * Transformation Generator Module
 * Handles the generation of transformation decorators and utility methods
 * for converting data between different formats and types.
 */
export class TransformationGenerator {
  /**
   * Generates transformation decorators for a field based on its metadata
   */
  generateTransformationDecorators(field: FieldMetadata): TransformationRule[] {
    const rules: TransformationRule[] = []

    // Add type-specific transformations
    rules.push(...this.getTypeTransformations(field))

    // Add case transformations if needed
    if (field.type === 'string') {
      rules.push(...this.getCaseTransformations(field))
    }

    // Add custom transformations from documentation
    rules.push(...this.parseCustomTransformations(field))

    return rules
  }

  /**
   * Determines specific transformation rules based on field type
   */
  private getTypeTransformations(field: FieldMetadata): TransformationRule[] {
    const rules: TransformationRule[] = []

    switch (field.type) {
      case 'Date':
        rules.push({
          type: 'toDate',
          params: ['ISO'],
        })
        break
      case 'number':
        rules.push({
          type: 'toNumber',
          params: [field.documentation.description.includes('@integer') ? 'integer' : 'float'],
        })
        break
      case 'boolean':
        rules.push({
          type: 'toBoolean',
        })
        break
    }

    return rules
  }

  /**
   * Generates case transformation rules for string fields
   */
  private getCaseTransformations(field: FieldMetadata): TransformationRule[] {
    const rules: TransformationRule[] = []
    const docs = field.documentation

    if (docs.description.includes('@lowercase')) {
      rules.push({
        type: 'custom',
        params: ['(value) => value?.toLowerCase()'],
      })
    }

    if (docs.description.includes('@uppercase')) {
      rules.push({
        type: 'custom',
        params: ['(value) => value?.toUpperCase()'],
      })
    }

    return rules
  }

  /**
   * Generates utility methods for transforming entire DTOs
   */
  generateTransformationMethods(model: ModelMetadata): string {
    return `
  /**
   * Transforms an entity to a DTO instance
   */
  static fromEntity(entity: Record<string, any>): ${model.name}DTO {
    return plainToClass(${model.name}DTO, entity, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true
    });
  }

  /**
   * Transforms a DTO instance to an entity
   */
  toEntity(): Record<string, any> {
    return classToPlain(this, {
      excludeExtraneousValues: true
    });
  }
`
  }
}
