// tools/generators/dto/modules/interfaces.ts
import { TypeMapper } from '../utils/type-mapper'
import { DocumentationParser } from '../utils/documentation-parser'
import { TemplateEngine } from '../utils/template-engine'
import { readFileSync } from 'fs'
import { join } from 'path'
import { registerHandlebarsHelpers } from '../utils/handlebars-helpers'
import type { ModelMetadata, FieldMetadata, RelationshipMetadata, ValidationRule } from '../types'

/**
 * InterfaceGenerator creates TypeScript interfaces using a template-based approach.
 * This class transforms our model metadata into strongly-typed interfaces while
 * maintaining consistent formatting and documentation standards.
 */
export class InterfaceGenerator {
  private readonly templates: {
    interface: string
    imports: string
    documentation: string
    property: string
    relation: string
    typeHelpers: string
  }

  constructor(
    private readonly typeMapper: TypeMapper,
    private readonly docParser: DocumentationParser,
  ) {
    // Register Handlebars helpers
    registerHandlebarsHelpers()

    // Load the template file
    const templatesDir = join(__dirname, '../templates')
    this.templates = {
      interface: readFileSync(join(templatesDir, 'interface.hbs'), 'utf-8'),
      imports: readFileSync(join(templatesDir, 'imports.hbs'), 'utf-8'),
      documentation: readFileSync(join(templatesDir, 'documentation.hbs'), 'utf-8'),
      property: readFileSync(join(templatesDir, 'property.hbs'), 'utf-8'),
      relation: readFileSync(join(templatesDir, 'relation.hbs'), 'utf-8'),
      typeHelpers: readFileSync(join(templatesDir, 'type-helpers.hbs'), 'utf-8'),
    }
  }

  /**
   * Generates a complete interface file for a model, including all related
   * interfaces and type helpers. Uses templates to ensure consistency.
   */
  generateInterface(model: ModelMetadata): string {
    const context = {
      imports: this.prepareImports(model),
      documentation: this.prepareDocumentation(model),
      properties: this.prepareProperties(model.fields),
      relations: this.prepareRelationInterfaces(model),
      typeHelpers: this.prepareTypeHelpers(model),
      model: {
        name: model.name,
        documentation: model.documentation,
        fields: model.fields.map((field) => ({
          name: field.name,
          type: field.type,
          isRequired: field.isRequired,
          isList: field.isList,
          documentation: field.documentation,
          kind: field.kind,
          validationRules: this.formatValidationRules(field.validationRules),
          tsType: this.typeMapper.mapPrismaToTypeScript(field),
        })),
        relations: model.relations,
      },
    }

    return TemplateEngine.process(this.templates.interface, context)
  }

  private prepareImports(model: ModelMetadata): string {
    const imports = new Set<{ what: string; from: string }>()
    imports.add({ what: 'BaseEntity', from: '@core/base/entity' })

    model.relationships.forEach((relation) => {
      imports.add({
        what: `I${relation.type}`,
        from: `./${relation.type.toLowerCase()}.interface`,
      })
    })

    return TemplateEngine.process(this.templates.imports, { imports: Array.from(imports) })
  }

  /**
   * Generates comprehensive documentation for the interface using JSDoc format.
   * Includes description, examples, and deprecation notices if applicable.
   */
  private prepareDocumentation(model: ModelMetadata): string {
    const docs = model.documentation
    return TemplateEngine.process(this.templates.documentation, {
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
        return TemplateEngine.process(this.templates.property, {
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
        return TemplateEngine.process(this.templates.relation, {
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
    return TemplateEngine.process(this.templates.typeHelpers, {
      interfaceName: model.name,
    })
  }

  private formatValidationRules(rules: ValidationRule[]): string {
    if (!rules.length) return ''
    return rules
      .map((rule) => `@${rule.decorator}${rule.params ? `(${rule.params.join(', ')})` : ''}`)
      .join(', ')
  }

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
