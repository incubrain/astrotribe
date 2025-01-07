// tools/generators/dto/modules/schemas.ts
import { TypeMapper } from '../utils/type-mapper'
import { DocumentationParser } from '../utils/documentation-parser'
import { TemplateEngine } from '../templates/template.engine'
import type { ModelMetadata, FieldMetadata, ValidationRule, TransformationRule } from '../types'

/**
 * SchemaGenerator creates Zod validation schemas using a template-based approach.
 * This class transforms our model metadata into runtime validation schemas while
 * maintaining consistent formatting and comprehensive validation rules.
 */
export class SchemaGenerator {
  constructor(
    private readonly typeMapper: TypeMapper,
    private readonly docParser: DocumentationParser,
  ) {}

  /**
   * Generates a complete schema file for a model, including validation rules,
   * transformations, and utility functions for runtime type checking.
   */
  generateSchema(model: ModelMetadata): string {
    const context = {
      model: {
        ...model,
        schemaName: `${model.name}Schema`,
        typeName: model.name,
      },
      imports: this.prepareImports(model),
      fields: this.prepareFields(model.fields),
      documentation: this.docParser.parseModelDocumentation(model),
    }

    return TemplateEngine.process('schema/base', context)
  }

  /**
   * Prepares import statements, including Zod and any custom type imports.
   */
  private prepareImports(model: ModelMetadata): string[] {
    const imports = ['z']

    // Add imports for related schemas
    model.relationships?.forEach((relation) => {
      imports.push(`${relation.type}Schema`)
    })

    return imports
  }

  /**
   * Prepares field definitions with their respective Zod validators
   */
  private prepareFields(fields: FieldMetadata[]): any[] {
    return fields.map((field) => ({
      ...field,
      zodType: this.getZodType(field),
      transformations: this.prepareTransforms(field.transformationRules),
      validations: this.prepareValidations(field.validationRules),
      documentation: this.docParser.parseFieldDocumentation(field),
    }))
  }

  /**
   * Maps a field to its Zod type
   */
  private getZodType(field: FieldMetadata): string {
    let zodType = this.typeMapper.mapPrismaToZod(field.type)

    if (field.enum?.length) {
      zodType = `enum([${field.enum.map((v) => `'${v}'`).join(', ')}])`
    }

    if (field.isArray) {
      zodType = `array(z.${zodType}())`
    }

    if (!field.isRequired) {
      zodType = `${zodType}.nullable()`
    }

    return zodType
  }

  /**
   * Prepares transformation rules for a field
   */
  private prepareTransforms(rules?: TransformationRule[]): any[] {
    if (!rules?.length) return []

    return rules.map((rule) => {
      switch (rule.type) {
        case 'toDate':
          return {
            transform: '(val) => new Date(val)',
            description: 'Convert to Date',
          }
        case 'toString':
          return {
            transform: 'String',
            description: 'Convert to string',
          }
        case 'toNumber':
          return {
            transform:
              rule.params?.[0] === 'integer'
                ? '(val) => parseInt(String(val), 10)'
                : '(val) => Number(val)',
            description: `Convert to ${rule.params?.[0] || 'number'}`,
          }
        case 'toBoolean':
          return {
            transform: '(val) => Boolean(val)',
            description: 'Convert to boolean',
          }
        case 'custom':
          return {
            transform: rule.params?.[0] || 'identity',
            description: 'Custom transformation',
          }
        default:
          return {
            transform: 'identity',
            description: 'Identity transformation',
          }
      }
    })
  }

  /**
   * Prepares validation rules for a field
   */
  private prepareValidations(rules?: ValidationRule[]): any[] {
    if (!rules?.length) return []

    return rules.map((rule) => {
      switch (rule.decorator) {
        case 'IsEmail':
          return {
            validation: 'email()',
            description: 'Must be a valid email',
          }
        case 'MinLength':
          return {
            validation: `min(${rule.params?.[0]})`,
            description: `Minimum length: ${rule.params?.[0]}`,
          }
        case 'MaxLength':
          return {
            validation: `max(${rule.params?.[0]})`,
            description: `Maximum length: ${rule.params?.[0]}`,
          }
        case 'IsInt':
          return {
            validation: 'int()',
            description: 'Must be an integer',
          }
        case 'IsPositive':
          return {
            validation: 'positive()',
            description: 'Must be positive',
          }
        default:
          const refinement = rule.params?.[0] || 'true'
          return {
            validation: `refine(${refinement})`,
            description: rule.message || 'Custom validation',
          }
      }
    })
  }
}
