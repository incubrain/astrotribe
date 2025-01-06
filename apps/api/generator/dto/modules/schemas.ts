// tools/generators/dto/modules/schemas.ts
import { TypeMapper } from '../utils/type-mapper'
import { DocumentationParser } from '../utils/documentation-parser'
import { SchemaTemplate } from '../template/schema.template'
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
      imports: this.prepareImports(model),
      documentation: this.prepareDocumentation(model),
      schemaName: `${model.name}Schema`,
      typeName: model.name,
      properties: this.prepareProperties(model.fields),
      validators: this.prepareValidators(model),
      utilities: this.prepareUtilities(model),
    }

    return this.applyTemplate(SchemaTemplate.MAIN_TEMPLATE, context)
  }

  /**
   * Prepares import statements, including Zod and any custom type imports.
   * Groups imports logically for better code organization.
   */
  private prepareImports(model: ModelMetadata): string {
    const customImports = new Set<{ what: string; from: string }>()

    // Add imports for related schemas
    model.relationships.forEach((relation) => {
      customImports.add({
        what: `${relation.type}Schema`,
        from: `./${relation.type.toLowerCase()}.schema`,
      })
    })

    return this.applyTemplate(SchemaTemplate.IMPORTS_TEMPLATE, {
      customImports: Array.from(customImports),
    })
  }

  /**
   * Generates schema documentation that explains validation rules and usage.
   * Includes examples and notes about runtime behavior.
   */
  private prepareDocumentation(model: ModelMetadata): string {
    const docs = model.documentation
    const docText = [
      '/**',
      ` * Zod schema for validating ${model.name} objects.`,
      ` * ${docs.description}`,
      ` * @see https://zod.dev/ for more information about Zod validation`,
      docs.deprecated ? ' * @deprecated' : '',
      docs.version ? ` * @version ${docs.version}` : '',
      ' */',
    ]
      .filter(Boolean)
      .join('\n')

    return docText
  }

  /**
   * Generates schema property definitions with their respective Zod validators.
   * Handles both basic validations and complex transformations.
   */
  private prepareProperties(fields: FieldMetadata[]): string {
    return fields
      .map((field) => {
        const context = {
          description: field.documentation.description,
          name: field.name,
          zodType: this.typeMapper.mapPrismaToZod(field),
          transforms: this.prepareTransforms(field.transformationRules),
          validations: this.prepareValidations(field.validationRules),
        }

        return this.applyTemplate(SchemaTemplate.PROPERTY_TEMPLATE, context)
      })
      .join('\n\n')
  }

  /**
   * Prepares transformation rules for a field, converting our metadata
   * into Zod-compatible transformations.
   */
  private prepareTransforms(rules: TransformationRule[]): Array<{ transform: string }> {
    return rules.map((rule) => {
      let transform: string
      switch (rule.type) {
        case 'toDate':
          transform = '(val) => new Date(val)'
          break
        case 'toString':
          transform = 'String'
          break
        case 'toNumber':
          transform =
            rule.params?.[0] === 'integer'
              ? '(val) => parseInt(String(val), 10)'
              : '(val) => Number(val)'
          break
        case 'toBoolean':
          transform = '(val) => Boolean(val)'
          break
        case 'custom':
          transform = rule.params?.[0] || 'identity'
          break
        default:
          transform = 'identity'
      }
      return { transform }
    })
  }

  /**
   * Converts validation rules into Zod-compatible validation chains.
   * Handles both standard and custom validation rules.
   */
  private prepareValidations(rules: ValidationRule[]): Array<{ validation: string }> {
    return rules.map((rule) => {
      let validation: string
      switch (rule.decorator) {
        case 'IsEmail':
          validation = 'email()'
          break
        case 'MinLength':
          validation = `min(${rule.params?.[0]})`
          break
        case 'MaxLength':
          validation = `max(${rule.params?.[0]})`
          break
        case 'IsInt':
          validation = 'int()'
          break
        case 'IsPositive':
          validation = 'positive()'
          break
        default:
          validation = `refine(${rule.params?.[0] || 'true'})`
      }
      return { validation }
    })
  }

  /**
   * Generates validator functions for the schema, including both
   * throwing and non-throwing variants for different use cases.
   */
  private prepareValidators(model: ModelMetadata): string {
    return this.applyTemplate(SchemaTemplate.VALIDATORS_TEMPLATE, {
      schemaName: `${model.name}Schema`,
      typeName: model.name,
    })
  }

  /**
   * Generates utility functions for working with the schema,
   * including helpers for common operations like creating partial schemas.
   */
  private prepareUtilities(model: ModelMetadata): string {
    return this.applyTemplate(SchemaTemplate.UTILITIES_TEMPLATE, {
      schemaName: `${model.name}Schema`,
      typeName: model.name,
    })
  }

  /**
   * Simple template engine that replaces placeholders with actual values.
   * For production use, consider using a more robust template engine.
   */
  private applyTemplate(template: string, context: Record<string, any>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (_, key) => context[key] || '')
  }

  /**
   * Formats validation rules into a readable string for documentation.
   */
  private formatValidationRules(rules: ValidationRule[]): string {
    if (!rules.length) return ''
    return rules
      .map((rule) => `@${rule.decorator}${rule.params ? `(${rule.params.join(', ')})` : ''}`)
      .join(', ')
  }
}
