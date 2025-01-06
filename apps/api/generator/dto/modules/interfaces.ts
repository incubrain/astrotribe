// tools/generators/dto/modules/interfaces.ts
import { TypeMapper } from '../utils/type-mapper'
import { DocumentationParser } from '../utils/documentation-parser'
import { InterfaceTemplate } from '../template/interface.template'
import type { ModelMetadata, FieldMetadata, RelationshipMetadata, ValidationRule } from '../types'

/**
 * InterfaceGenerator creates TypeScript interfaces using a template-based approach.
 * This class transforms our model metadata into strongly-typed interfaces while
 * maintaining consistent formatting and documentation standards.
 */
export class InterfaceGenerator {
  constructor(
    private readonly typeMapper: TypeMapper,
    private readonly docParser: DocumentationParser,
  ) {}

  /**
   * Generates a complete interface file for a model, including all related
   * interfaces and type helpers. Uses templates to ensure consistency.
   */
  generateInterface(model: ModelMetadata): string {
    // First, we prepare all the components needed for our interface
    const context = {
      imports: this.prepareImports(model),
      documentation: this.prepareDocumentation(model),
      interfaceName: model.name,
      properties: this.prepareProperties(model.fields),
      relationInterfaces: this.prepareRelationInterfaces(model),
      typeHelpers: this.prepareTypeHelpers(model),
    }

    // Then we use our template to generate the final output
    return this.applyTemplate(InterfaceTemplate.MAIN_TEMPLATE, context)
  }

  /**
   * Prepares import statements based on model relationships and dependencies.
   * Groups imports by source for better organization.
   */
  private prepareImports(model: ModelMetadata): string {
    const imports = new Set<{ what: string; from: string }>()

    // Add base imports
    imports.add({ what: 'BaseEntity', from: '@core/base/entity' })

    // Add relationship imports
    model.relationships.forEach((relation) => {
      imports.add({
        what: `I${relation.type}`,
        from: `./${relation.type.toLowerCase()}.interface`,
      })
    })

    return this.applyTemplate(InterfaceTemplate.IMPORTS_TEMPLATE, { imports: Array.from(imports) })
  }

  /**
   * Generates comprehensive documentation for the interface using JSDoc format.
   * Includes description, examples, and deprecation notices if applicable.
   */
  private prepareDocumentation(model: ModelMetadata): string {
    const docs = model.documentation
    return this.applyTemplate(InterfaceTemplate.DOCUMENTATION_TEMPLATE, {
      description: docs.description,
      deprecated: docs.deprecated,
      example: docs.example,
      version: docs.version,
    })
  }

  /**
   * Generates property definitions with their respective types and documentation.
   * Handles both simple properties and complex types.
   */
  private prepareProperties(fields: FieldMetadata[]): string {
    return fields
      .map((field) => {
        return this.applyTemplate(InterfaceTemplate.PROPERTY_TEMPLATE, {
          description: field.documentation.description,
          example: field.documentation.example,
          validation: this.formatValidationRules(field.validationRules),
          name: field.name,
          required: field.isRequired,
          type: this.typeMapper.mapPrismaToTypeScript(field),
        })
      })
      .join('\n')
  }

  /**
   * Generates interfaces for handling relationships between models.
   * Creates extended interfaces that include related entities.
   */
  private prepareRelationInterfaces(model: ModelMetadata): string {
    return model.relationships
      .map((relation) => {
        return this.applyTemplate(InterfaceTemplate.RELATION_INTERFACE_TEMPLATE, {
          interfaceName: model.name,
          relationName: relation.name,
          relationProperty: relation.name,
          relationType: this.getRelationType(relation),
        })
      })
      .join('\n\n')
  }

  /**
   * Generates utility types for working with the interface.
   * Includes common type transformations like Partial and Required.
   */
  private prepareTypeHelpers(model: ModelMetadata): string {
    return this.applyTemplate(InterfaceTemplate.TYPE_HELPERS_TEMPLATE, {
      interfaceName: model.name,
    })
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

  /**
   * Determines the correct TypeScript type for a relationship.
   */
  private getRelationType(relation: RelationshipMetadata): string {
    const baseType = `I${relation.type}`
    return relation.isArray ? `${baseType}[]` : baseType
  }

  /**
   * Simple template engine that replaces placeholders with actual values.
   * In a production environment, you might want to use a more robust template engine.
   */
  private applyTemplate(template: string, context: Record<string, any>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (_, key) => context[key] || '')
  }
}
