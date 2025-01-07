// tools/generators/dto/modules/interface.generator.ts
import { TypeMapper } from '../utils/type-mapper'
import { DocumentationParser } from '../utils/documentation-parser'
import { TemplateEngine } from '../templates/template.engine'
import type { ModelMetadata, FieldMetadata, RelationshipMetadata, ValidationRule } from '../types'

/**
 * InterfaceGenerator creates TypeScript interfaces from model metadata
 * using a template-based approach.
 */
export class InterfaceGenerator {
  constructor(
    private readonly typeMapper: TypeMapper,
    private readonly documentationParser: DocumentationParser,
  ) {}

  /**
   * Generates a complete interface file from model metadata
   */
  generateInterface(metadata: ModelMetadata): string {
    if (metadata.isView) {
      return this.generateViewInterface(metadata)
    }
    return this.generateModelInterface(metadata)
  }

  /**
   * Generates an interface for a database model
   */
  private generateModelInterface(metadata: ModelMetadata): string {
    const context = {
      model: metadata,
      imports: this.prepareImports(metadata),
      fields: this.prepareFields(metadata.fields),
      relations: this.prepareRelations(metadata.relations),
      documentation: this.prepareDocumentation(metadata),
    }

    // Change from 'interface/model.interface.hbs' to 'interface/model.interface'
    return TemplateEngine.process('interface/model.interface', context)
  }

  /**
   * Generates an interface for a database view
   */
  private generateViewInterface(metadata: ModelMetadata): string {
    const context = {
      model: metadata,
      imports: this.prepareImports(metadata),
      fields: this.prepareFields(metadata.fields),
      computedColumns: metadata.viewMetadata?.computedColumns || [],
      documentation: this.prepareDocumentation(metadata),
    }

    return TemplateEngine.process('interface/view', context)
  }

  /**
   * Prepares imports for the interface
   */
  private prepareImports(metadata: ModelMetadata): string[] {
    const imports = ['BaseEntity']

    if (metadata.relations?.length) {
      // Add imports for related interfaces
      imports.push(...metadata.relations.map((rel) => `I${rel.type}`))
    }

    // Add any validation-related imports if needed
    if (metadata.fields.some((f) => f.validationRules?.length)) {
      imports.push('ValidationError')
    }

    return imports
  }

  /**
   * Prepares field metadata for the template
   */
  private prepareFields(fields: FieldMetadata[]): any[] {
    return fields.map((field) => ({
      ...field,
      tsType: this.typeMapper.mapFieldType(field),
      documentation: this.documentationParser.parseFieldDocumentation(field),
      validationDescription: this.formatValidationRules(field.validationRules),
    }))
  }

  /**
   * Prepares relation metadata for the template
   */
  private prepareRelations(relations: RelationshipMetadata[]): any[] {
    return relations.map((relation) => ({
      ...relation,
      interfaceType: `I${relation.type}`,
      isArray: relation.relationType.includes('many'),
      documentation: {
        description: `${relation.name} ${relation.relationType} ${relation.foreign.model}`,
      },
    }))
  }

  /**
   * Prepares documentation metadata for the template
   */
  private prepareDocumentation(metadata: ModelMetadata): any {
    const docs = metadata.documentation || {}

    if (metadata.isView) {
      return {
        ...docs,
        description: `Interface for ${metadata.name} database view\n${docs.description || ''}`,
        sourceQuery: metadata.viewMetadata?.sourceQuery,
      }
    }

    return {
      ...docs,
      description: `Interface for ${metadata.name} database model\n${docs.description || ''}`,
    }
  }

  /**
   * Formats validation rules into a readable string for documentation
   */
  private formatValidationRules(rules?: ValidationRule[]): string {
    if (!rules?.length) return ''

    return rules
      .map((rule) => {
        const params = rule.parameters ? `(${rule.parameters.join(', ')})` : ''
        return `@${rule.decorator}${params} - ${rule.message}`
      })
      .join('\n')
  }
}
