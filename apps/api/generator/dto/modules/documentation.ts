// tools/generators/dto/modules/documentation.ts
import fs from 'fs'

import type {
  ModelMetadata,
  DocumentationMetadata,
  FieldMetadata,
  GeneratorOptions,
  EndpointMetadata,
  ValidationRule,
  RelationshipMetadata,
} from '../types'
import { FileManager } from '../utils/file-manager'

/**
 * Enhanced DocumentationGenerator that creates comprehensive documentation
 * covering API usage, database structure, and OpenAPI specifications.
 */
export class DocumentationGenerator {
  constructor(
    private readonly models: ModelMetadata[],
    private readonly options: GeneratorOptions,
    private readonly fileManager: FileManager,
  ) {}

  private writeModelStructureToFile(
    models: ModelMetadata[],
    filePath: string = 'models-metadata.json',
  ): void {
    fs.writeFileSync(filePath, JSON.stringify(models, null, 2), 'utf-8')
  }

  /**
   * Main generation process that coordinates the creation of all
   * documentation artifacts. Each piece of documentation serves a
   * different purpose and audience.
   */
  async generate(): Promise<void> {
    this.writeModelStructureToFile(this.models)
    // Create the main API documentation
    await this.generateAPIDocumentation()

    // Create OpenAPI specification
    await this.generateOpenAPISpec()

    // Generate database documentation
    await this.generateDatabaseDocs()

    // Generate relationship diagrams
    await this.generateRelationshipDiagrams()

    // Generate example usage documentation
    await this.generateExampleDocs()
  }

  /**
   * Generates comprehensive API documentation including controller
   * usage, endpoint descriptions, and request/response examples.
   */
  private async generateAPIDocumentation(): Promise<void> {
    let content = '# API Documentation\n\n'

    // Add overview section
    content += this.generateOverview()

    // Generate documentation for each controller
    for (const model of this.models) {
      content += this.generateControllerDocs(model)
    }

    // Add authentication and error handling sections
    content += this.generateAuthenticationDocs()
    content += this.generateErrorHandlingDocs()

    await this.fileManager.writeFile('docs/API.md', content)
  }

  /**
   * Generates relationship diagrams using Mermaid syntax
   */
  private async generateRelationshipDiagrams(): Promise<void> {
    let diagram = 'erDiagram\n'

    if (this.models && Array.isArray(this.models)) {
      // Add entities
      this.models.forEach((model) => {
        try {
          if (model?.name) {
            diagram += this.generateEntityBlock(model)
          }
        } catch (error) {
          console.error(`Error generating entity block for model ${model.name}:`, error)
        }
      })

      // Add relationships
      this.models.forEach((model) => {
        try {
          if (model?.relations && Array.isArray(model.relations)) {
            model.relations.forEach((rel) => {
              if (rel && rel.foreign?.model) {
                diagram += this.generateRelationshipLine(model, rel)
              }
            })
          }
        } catch (error) {
          console.error(`Error generating relationships for model ${model.name}:`, error)
        }
      })
    }

    // Write diagram to file
    try {
      await this.fileManager.writeFile('docs/diagrams/relationships.mmd', diagram)
    } catch (error) {
      console.error('Error writing MermaidJS diagram to file:', error)
    }
  }

  /**
   * Generates an entity block in Mermaid syntax
   */
  private generateEntityBlock(model: ModelMetadata): string {
    if (!model.fields || !Array.isArray(model.fields)) {
      return `  ${model.name} {}\n`
    }

    let entityBlock = `  ${model.name} {\n`

    // Add fields
    model.fields.forEach((field) => {
      let type = field.type || 'unknown'
      const name = field.name || 'unnamed'

      // Replace complex types with a placeholder
      if (
        !['string', 'number', 'boolean', 'Date', 'object', 'array'].includes(type.toLowerCase())
      ) {
        type = 'string' // Fallback for unsupported types
      }

      entityBlock += `    ${type} ${name}\n`
    })

    entityBlock += '  }\n'
    return entityBlock
  }

  /**
   * Generates a relationship line in Mermaid syntax
   */
  private generateRelationshipLine(
    model: ModelMetadata,
    relationship: RelationshipMetadata,
  ): string {
    if (!model?.name || !relationship?.foreign?.model) {
      return ''
    }

    const name = relationship.name.replace(/[^a-zA-Z0-9_]/g, '_') // Replace invalid characters
    const cardinality = this.getRelationshipCardinality(relationship)
    return `  ${model.name} ${cardinality} ${relationship.foreign.model} : "${name}"\n`
  }

  private getRelationshipCardinality(relationship: RelationshipMetadata): string {
    const cardinalityMap: Record<string, string> = {
      'one-to-one': '||--||',
      'one-to-many': '||--|{',
      'many-to-one': '}|--||',
      'many-to-many': '}|--|{',
    }

    return cardinalityMap[relationship.relationType] || '||--||' // Default to one-to-one
  }

  /**
   * Generates detailed usage examples including common scenarios,
   * edge cases, and error handling.
   */
  private async generateExampleDocs(): Promise<void> {
    for (const model of this.models) {
      const examples = this.generateModelExamples(model)
      await this.fileManager.writeFile(`docs/examples/${model.name.toLowerCase()}.md`, examples)
    }
  }

  /**
   * Generates a type table for request/response documentation.
   */
  private generateTypeTable(fields: FieldMetadata[] | undefined): string {
    if (!fields || !Array.isArray(fields) || fields.length === 0) {
      return 'No fields defined'
    }

    return `| Field | Type | Required | Description |
|-------|------|----------|-------------|
${fields
  .map((field) => {
    const description = field.documentation?.description || ''
    const type = field.type || 'unknown'
    const required = field.isRequired ? 'Yes' : 'No'
    return `| ${field.name} | ${type} | ${required} | ${description} |`
  })
  .join('\n')}`
  }

  /**
   * Generates detailed endpoint documentation.
   */
  private generateEndpointDocs(endpoint: EndpointMetadata, model: ModelMetadata): string {
    if (!endpoint) {
      return ''
    }

    let doc = `### ${endpoint.description || 'Unnamed Endpoint'}\n\n`

    // Method and path
    doc += `\`${endpoint.method || 'GET'} ${endpoint.path || '/'}\`\n\n`

    // Authentication requirements
    if (endpoint.auth) {
      doc += '**Authentication Required**\n\n'
    }

    // Request body documentation
    if (endpoint.requestBody) {
      doc += '#### Request Body\n\n'
      const requestFields = this.extractFieldsFromModel(endpoint.requestBody)
      doc += this.generateTypeTable(requestFields)
      doc += '\n\n#### Example Request\n\n'
      doc += '```json\n' + JSON.stringify(endpoint.example?.request || {}, null, 2) + '\n```\n\n'
    }

    // Response documentation
    doc += '#### Response\n\n'
    const responseFields = this.extractFieldsFromModel(endpoint.response)
    doc += this.generateTypeTable(responseFields)
    doc += '\n\n#### Example Response\n\n'
    doc += '```json\n' + JSON.stringify(endpoint.example?.response || {}, null, 2) + '\n```\n\n'

    // Validation rules
    doc += '#### Validation Rules\n\n'
    doc += this.generateValidationTable(model.fields || [])

    return doc
  }

  /**
   * Extracts fields from a model for documentation.
   */
  private extractFieldsFromModel(model: any): FieldMetadata[] {
    if (!model) return []

    if (Array.isArray(model.fields)) {
      return model.fields
    }

    if (typeof model === 'object' && model.type === 'array' && model.items) {
      return this.extractFieldsFromModel(model.items)
    }

    if (model.properties) {
      return Object.entries(model.properties).map(([name, prop]: [string, any]) => ({
        name,
        type: prop.type,
        isRequired: prop.required || false,
        documentation: {
          description: prop.description || '',
        },
      }))
    }

    return []
  }

  /**
   * Generates the validation table for fields.
   */
  private generateValidationTable(fields: FieldMetadata[]): string {
    if (!fields || !Array.isArray(fields) || fields.length === 0) {
      return 'No validation rules defined'
    }

    return `| Field | Validation Rules |
|-------|------------------|
${fields
  .map((field) => {
    const rules = this.formatValidationRules(field.validationRules || [])
    return `| ${field.name} | ${rules} |`
  })
  .join('\n')}`
  }

  /**
   * Formats validation rules into a readable string.
   */
  private formatValidationRules(rules: ValidationRule[]): string {
    if (!Array.isArray(rules) || rules.length === 0) {
      return 'None'
    }

    return rules
      .map((rule) => {
        if (rule.params) {
          return `${rule.decorator}(${rule.params.join(', ')})`
        }
        return rule.decorator
      })
      .join(', ')
  }

  /**
   * Generates API documentation for a controller.
   */
  private generateControllerDocs(model: ModelMetadata): string {
    if (!model) {
      return ''
    }

    let doc = `## ${model.name} Controller\n\n`
    doc += `${model.documentation?.description || ''}\n\n`

    // Base path information
    doc += `**Base Path:** \`/${model.name.toLowerCase()}\`\n\n`

    // Document each endpoint
    const endpoints = this.getControllerEndpoints(model)
    if (Array.isArray(endpoints)) {
      endpoints.forEach((endpoint) => {
        doc += this.generateEndpointDocs(endpoint, model)
      })
    }

    return doc
  }

  /**
   * Generates comprehensive examples for a model, including common use cases
   * and edge cases that demonstrate proper usage.
   */
  private generateModelExamples(model: ModelMetadata): string {
    let examples = `# ${model.name} Examples\n\n`

    // Create example
    examples += `## Creating a ${model.name}\n\n`
    examples += '```typescript\n'
    examples += this.generateCreateExample(model)
    examples += '\n```\n\n'

    // Update example
    examples += `## Updating a ${model.name}\n\n`
    examples += '```typescript\n'
    examples += this.generateUpdateExample(model)
    examples += '\n```\n\n'

    // Query examples
    examples += `## Querying ${model.name}s\n\n`
    examples += '```typescript\n'
    examples += this.generateQueryExamples(model)
    examples += '\n```\n\n'

    // Error handling examples
    examples += `## Error Handling\n\n`
    examples += '```typescript\n'
    examples += this.generateErrorHandlingExamples(model)
    examples += '\n```\n'

    return examples
  }

  /**
   * Generates documentation for database indexes including
   * their types, covered columns, and purposes.
   */
  private generateIndexDocs(): string {
    let docs = '## Database Indexes\n\n'

    this.models.forEach((model) => {
      docs += `### ${model.name} Indexes\n\n`

      const indexes = this.getModelIndexes(model)
      indexes.forEach((index) => {
        docs += `#### ${index.name}\n\n`
        docs += `- **Type:** ${index.type}\n`
        docs += `- **Columns:** ${index.columns.join(', ')}\n`
        docs += `- **Purpose:** ${index.purpose}\n\n`
      })
    })

    return docs
  }

  /**
   * Generates detailed documentation for a database table/view
   */
  private generateTableDocs(model: ModelMetadata): string {
    if (!model || !model.name) {
      return ''
    }

    let docs = `## ${model.name}\n\n`

    // Add description if available
    if (model.documentation?.description) {
      docs += `${model.documentation.description}\n\n`
    }

    // Table structure
    docs += '### Columns\n\n'
    if (model.fields && Array.isArray(model.fields)) {
      docs += this.generateColumnTable(model.fields)
    } else {
      docs += 'No columns defined\n'
    }

    // Foreign Keys / Relations
    docs += '\n### Relationships\n\n'
    if (model.relations && Array.isArray(model.relations) && model.relations.length > 0) {
      model.relations.forEach((rel) => {
        const relationType = this.getRelationshipType(rel)
        docs += `- ${rel.name}: ${relationType} relationship with ${rel.foreign.model}\n`
      })
    } else {
      docs += 'No relationships defined\n'
    }

    // Validation Rules
    docs += '\n### Validation Rules\n\n'
    if (model.fields && Array.isArray(model.fields)) {
      model.fields.forEach((field) => {
        if (field.validationRules && field.validationRules.length > 0) {
          docs += `#### ${field.name}\n`
          field.validationRules.forEach((rule) => {
            docs += `- ${rule.decorator}${rule.message ? `: ${rule.message}` : ''}\n`
          })
        }
      })
    }

    return docs
  }

  /**
   * Generates an overview of the database structure
   */
  private generateDatabaseOverview(): string {
    let overview = '## Database Overview\n\n'

    // List all entities
    overview += '### Entities\n\n'
    if (this.models && Array.isArray(this.models)) {
      this.models.forEach((model) => {
        overview += `- **${model.name}**: ${model.documentation?.description || 'No description available'}\n`
      })
    }

    // Key relationships
    overview += '\n### Key Relationships\n\n'
    if (this.models && Array.isArray(this.models)) {
      this.models.forEach((model) => {
        if (model.relations && Array.isArray(model.relations)) {
          model.relations.forEach((rel) => {
            if (rel && rel.foreign) {
              overview += `- ${model.name} ${this.getRelationshipCardinality(rel)} ${rel.foreign.model}\n`
            }
          })
        }
      })
    }

    // Database notes
    overview += '\n### Important Notes\n\n'
    overview += '- All timestamps are stored in UTC\n'
    overview += '- Soft deletes are implemented using `deleted_at` column where applicable\n'
    overview += '- Foreign keys are enforced at the database level\n'

    return overview
  }

  /**
   * Generates database documentation
   */
  private async generateDatabaseDocs(): Promise<void> {
    let content = '# Database Documentation\n\n'

    // Overview of database structure
    content += this.generateDatabaseOverview()

    // Document each table/view
    if (this.models && Array.isArray(this.models)) {
      for (const model of this.models) {
        content += this.generateTableDocs(model)
      }
    }

    // Add sections for indexes and constraints
    content += this.generateIndexDocs()
    content += this.generateConstraintDocs()

    await this.fileManager.writeFile('docs/DATABASE.md', content)
  }

  /**
   * Generates documentation for database constraints
   */
  private generateConstraintDocs(): string {
    let docs = '## Database Constraints\n\n'

    // Foreign Key Constraints
    docs += '### Foreign Key Constraints\n\n'
    if (this.models && Array.isArray(this.models)) {
      this.models.forEach((model) => {
        if (model.relations && Array.isArray(model.relations)) {
          model.relations.forEach((rel) => {
            if (rel && rel.foreign) {
              docs += `- ${model.name}.${rel.name} → ${rel.foreign.model}.${rel.foreign.field}\n`
            }
          })
        }
      })
    }

    // Unique Constraints
    docs += '\n### Unique Constraints\n\n'
    if (this.models && Array.isArray(this.models)) {
      this.models.forEach((model) => {
        const uniqueConstraints = this.getUniqueConstraints(model)
        uniqueConstraints.forEach((constraint) => {
          docs += `- ${model.name}: (${constraint.fields.join(', ')})\n`
        })
      })
    }

    return docs
  }

  /**
   * Gets unique constraints for a model
   */
  private getUniqueConstraints(model: ModelMetadata): Array<{ fields: string[] }> {
    const constraints: Array<{ fields: string[] }> = []

    // Add single-field unique constraints
    if (model.fields && Array.isArray(model.fields)) {
      model.fields
        .filter((field) => field.validationRules?.some((rule) => rule.decorator === 'IsUnique'))
        .forEach((field) => {
          constraints.push({ fields: [field.name] })
        })
    }

    // Add composite unique constraints
    const docs = model.documentation?.description || ''
    const compositeUnique = docs.match(/@unique\s+\[(.*?)\]/g)
    if (compositeUnique) {
      compositeUnique.forEach((constraint) => {
        const fields = constraint
          .replace('@unique [', '')
          .replace(']', '')
          .split(',')
          .map((field) => field.trim())
        constraints.push({ fields })
      })
    }

    return constraints
  }

  /**
   * Generates OpenAPI parameter definition for ID parameters.
   * This is commonly used in endpoints that operate on specific resources.
   */
  private generateIdParameter(): any {
    return {
      name: 'id',
      in: 'path',
      required: true,
      description: 'Unique identifier of the resource',
      schema: {
        type: 'string',
        format: 'uuid',
      },
    }
  }

  /**
   * Creates a detailed example of updating an existing entity.
   * This demonstrates how to modify existing resources through the API.
   */
  private generateUpdateExample(model: ModelMetadata): string {
    const example = model.fields
      .filter((field) => !field.isComputed && !field.isRequired && field.name !== 'id')
      .reduce(
        (acc, field) => {
          acc[field.name] = this.generateExampleValue(field)
          return acc
        },
        {} as Record<string, any>,
      )

    return `// PATCH /${model.name.toLowerCase()}/{id}
const updatePayload = ${JSON.stringify(example, null, 2)};

const response = await api.patch('/${model.name.toLowerCase()}/123', updatePayload);
`
  }

  /**
   * Creates examples of different query operations.
   * This shows how to filter, sort, and paginate results.
   */
  private generateQueryExamples(model: ModelMetadata): string {
    return `// Basic query - Get all ${model.name}s
const allItems = await api.get('/${model.name.toLowerCase()}');

// Pagination
const pagedItems = await api.get('/${model.name.toLowerCase()}', {
params: {
  page: 1,
  limit: 10
}
});

// Filtering
const filteredItems = await api.get('/${model.name.toLowerCase()}', {
params: {
  filter: {
    ${model.fields[0].name}: 'value'
  }
}
});

// Sorting
const sortedItems = await api.get('/${model.name.toLowerCase()}', {
params: {
  sort: '${model.fields[0].name}:desc'
}
});
`
  }

  /**
   * Creates examples of error handling scenarios.
   * This helps developers understand how to handle various error cases.
   */
  private generateErrorHandlingExamples(model: ModelMetadata): string {
    return `// Handle validation errors
try {
const response = await api.post('/${model.name.toLowerCase()}', {});
} catch (error) {
if (error.response?.status === 422) {
  const validationErrors = error.response.data.errors;
  console.error('Validation failed:', validationErrors);
}
}

// Handle not found errors
try {
const response = await api.get('/${model.name.toLowerCase()}/nonexistent');
} catch (error) {
if (error.response?.status === 404) {
  console.error('Resource not found');
}
}

// Handle authentication errors
try {
const response = await api.get('/${model.name.toLowerCase()}');
} catch (error) {
if (error.response?.status === 401) {
  console.error('Authentication required');
}
}
`
  }

  /**
   * Gets the check constraints for a model.
   * This extracts check constraints from model metadata to document
   * business rules enforced at the database level.
   */
  private getCheckConstraints(model: ModelMetadata): Array<{ field: string; condition: string }> {
    const constraints: Array<{ field: string; condition: string }> = []

    model.fields.forEach((field) => {
      const checkConstraint = field.documentation.description.match(/@check\s+{([^}]+)}/)
      if (checkConstraint) {
        constraints.push({
          field: field.name,
          condition: checkConstraint[1].trim(),
        })
      }
    })

    return constraints
  }

  /**
   * Gets the indexes defined for a model.
   * This extracts index information from model metadata to document
   * performance optimization structures.
   */
  private getModelIndexes(model: ModelMetadata): Array<{
    name: string
    type: string
    columns: string[]
    purpose: string
  }> {
    const indexes: Array<{
      name: string
      type: string
      columns: string[]
      purpose: string
    }> = []

    // Extract index information from model metadata
    const indexMatches = model.documentation.description.match(/@index\s+{([^}]+)}/g)
    if (indexMatches) {
      indexMatches.forEach((indexStr) => {
        const [name, type, columnsStr, purpose] = indexStr
          .replace('@index {', '')
          .replace('}', '')
          .split('|')
          .map((s) => s.trim())

        indexes.push({
          name,
          type,
          columns: columnsStr.split(',').map((c) => c.trim()),
          purpose,
        })
      })
    }

    return indexes
  }

  /**
   * Generates a formatted table of column information
   */
  private generateColumnTable(fields: FieldMetadata[]): string {
    let table = '| Column | Type | Required | Default | Description |\n'
    table += '|--------|------|----------|----------|-------------|\n'

    fields.forEach((field) => {
      const type = field.isArray ? `${field.type}[]` : field.type
      const required = field.isRequired ? 'Yes' : 'No'
      const description = field.documentation?.description || ''
      const defaultValue = field.hasDefaultValue ? String(field.default) : '-'

      table += `| ${field.name} | ${type} | ${required} | ${defaultValue} | ${description} |\n`
    })

    return table
  }

  /**
   * Gets a human-readable relationship type description
   */
  private getRelationshipType(relationship: RelationshipMetadata): string {
    switch (relationship.relationType) {
      case 'one-to-one':
        return 'One-to-One'
      case 'one-to-many':
        return 'One-to-Many'
      case 'many-to-one':
        return 'Many-to-One'
      case 'many-to-many':
        return 'Many-to-Many'
      default:
        return 'Unknown'
    }
  }

  /**
   * Generates OpenAPI schema definitions for all models
   */
  private generateOpenAPISchemas(model: ModelMetadata): Record<string, any> {
    const schemas: Record<string, any> = {}

    // Generate the main model schema
    schemas[model.name] = {
      type: 'object',
      description: model.documentation?.description || '',
      properties: this.generateSchemaProperties(model.fields || []),
      required: this.getRequiredFields(model.fields || []),
    }

    // Generate schemas for nested types and related models
    if (model.relations && Array.isArray(model.relations)) {
      model.relations.forEach((relationship) => {
        if (!schemas[relationship.foreign.model]) {
          const relatedModel = this.findModelByName(relationship.foreign.model)
          if (relatedModel) {
            schemas[relationship.foreign.model] = {
              type: 'object',
              description: relatedModel.documentation?.description || '',
              properties: this.generateSchemaProperties(relatedModel.fields || []),
              required: this.getRequiredFields(relatedModel.fields || []),
            }
          }
        }
      })
    }

    return schemas
  }

  /**
   * Generates OpenAPI/Swagger specification
   */
  private async generateOpenAPISpec(): Promise<void> {
    const spec = {
      openapi: '3.0.0',
      info: {
        title: this.options.documentation?.title || 'API Documentation',
        version: this.options.documentation?.version || '1.0.0',
        description: this.options.documentation?.description || '',
      },
      paths: {},
      components: {
        schemas: {},
        securitySchemes: this.generateSecuritySchemes(),
      },
    }

    // Generate paths and schemas for each model
    for (const model of this.models) {
      try {
        spec.paths = {
          ...spec.paths,
          ...this.generateOpenAPIPaths(model),
        }
        spec.components.schemas = {
          ...spec.components.schemas,
          ...this.generateOpenAPISchemas(model),
        }
      } catch (error) {
        console.warn(`Warning: Error generating OpenAPI spec for model ${model.name}:`, error)
        // Continue with other models even if one fails
      }
    }

    await this.fileManager.writeFile('docs/openapi.json', JSON.stringify(spec, null, 2))
  }

  /**
   * Generates schema properties from field metadata
   */
  private generateSchemaProperties(fields: FieldMetadata[]): Record<string, any> {
    const properties: Record<string, any> = {}

    fields.forEach((field) => {
      properties[field.name] = {
        type: this.mapTypeToOpenAPI(field.type || 'string'),
        description: field.documentation?.description || '',
        example: field.documentation?.example,
      }

      // Add format for special types
      if (field.type === 'Date') {
        properties[field.name].format = 'date-time'
      }

      // Add validation constraints
      if (field.validationRules && field.validationRules.length > 0) {
        this.addValidationToSchema(properties[field.name], field.validationRules)
      }
    })

    return properties
  }

  /**
   * Gets required fields from a model's fields
   */
  private getRequiredFields(fields: FieldMetadata[]): string[] {
    return fields.filter((field) => field.isRequired).map((field) => field.name)
  }

  /**
   * Maps internal types to OpenAPI types
   */
  private mapTypeToOpenAPI(type: string): string {
    const typeMap: Record<string, string> = {
      string: 'string',
      number: 'number',
      boolean: 'boolean',
      Date: 'string',
      Object: 'object',
      Array: 'array',
    }

    const mappedType = typeMap[type] || typeMap[type.toLowerCase()]
    return mappedType || 'string' // Default to string if type is unknown
  }

  /**
   * Adds validation rules to OpenAPI schema
   */
  private addValidationToSchema(schema: any, rules: ValidationRule[]): void {
    if (!Array.isArray(rules)) return

    rules.forEach((rule) => {
      switch (rule.decorator) {
        case 'MinLength':
          schema.minLength = rule.params?.[0]
          break
        case 'MaxLength':
          schema.maxLength = rule.params?.[0]
          break
        case 'Min':
          schema.minimum = rule.params?.[0]
          break
        case 'Max':
          schema.maximum = rule.params?.[0]
          break
        case 'Pattern':
          schema.pattern = rule.params?.[0]
          break
      }
    })
  }

  /**
   * Helper method to find a model by its name
   */
  private findModelByName(name: string): ModelMetadata | undefined {
    if (!this.models || !Array.isArray(this.models)) return undefined
    return this.models.find((model) => model.name === name)
  }

  /**
   * Generates OpenAPI path definitions for our API endpoints.
   * This includes all the CRUD operations and their request/response
   * specifications, making our API self-documenting.
   */
  private generateOpenAPIPaths(model: ModelMetadata): Record<string, any> {
    const basePath = `/${model.name.toLowerCase()}`
    const paths: Record<string, any> = {}

    // GET collection endpoint
    paths[basePath] = {
      get: {
        summary: `Get all ${model.name}s`,
        description: `Retrieves a list of ${model.name} entities`,
        tags: [model.name],
        parameters: this.generateQueryParameters(model),
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: `#/components/schemas/${model.name}` },
                },
              },
            },
          },
          ...this.generateCommonResponses(),
        },
      },
      post: {
        summary: `Create a new ${model.name}`,
        description: `Creates a new ${model.name} entity`,
        tags: [model.name],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: `#/components/schemas/${model.name}` },
            },
          },
        },
        responses: {
          '201': {
            description: 'Created successfully',
            content: {
              'application/json': {
                schema: { $ref: `#/components/schemas/${model.name}` },
              },
            },
          },
          ...this.generateCommonResponses(),
        },
      },
    }

    // Individual resource endpoints
    paths[`${basePath}/{id}`] = {
      get: {
        summary: `Get a specific ${model.name}`,
        description: `Retrieves a single ${model.name} entity by ID`,
        tags: [model.name],
        parameters: [this.generateIdParameter()],
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: { $ref: `#/components/schemas/${model.name}` },
              },
            },
          },
          ...this.generateCommonResponses(),
        },
      },
      patch: {
        summary: `Update a ${model.name}`,
        description: `Updates an existing ${model.name} entity`,
        tags: [model.name],
        parameters: [this.generateIdParameter()],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: `#/components/schemas/${model.name}` },
            },
          },
        },
        responses: {
          '200': {
            description: 'Updated successfully',
            content: {
              'application/json': {
                schema: { $ref: `#/components/schemas/${model.name}` },
              },
            },
          },
          ...this.generateCommonResponses(),
        },
      },
      delete: {
        summary: `Delete a ${model.name}`,
        description: `Deletes a ${model.name} entity`,
        tags: [model.name],
        parameters: [this.generateIdParameter()],
        responses: {
          '204': {
            description: 'Deleted successfully',
          },
          ...this.generateCommonResponses(),
        },
      },
    }

    return paths
  }

  /**
   * Generates security scheme definitions for our API.
   * This tells API consumers how to authenticate their requests,
   * whether through JWT tokens, API keys, or other methods.
   */
  private generateSecuritySchemes(): Record<string, any> {
    return {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT token authentication',
      },
      apiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'X-API-KEY',
        description: 'API key authentication',
      },
    }
  }

  /**
   * Retrieves all available endpoints for a given controller.
   * This method analyzes the model metadata to determine what
   * endpoints should be available based on the model's properties
   * and relationships.
   */
  private getControllerEndpoints(model: ModelMetadata): EndpointMetadata[] {
    const basePath = `/${model.name.toLowerCase()}`
    const endpoints: EndpointMetadata[] = [
      // GET collection endpoint
      {
        method: 'GET',
        path: basePath,
        description: `Retrieve all ${model.name}s`,
        auth: true,
        response: {
          type: 'array',
          items: model,
        },
        example: {
          request: null,
          response: this.generateCollectionExample(model),
        },
      },
      // POST create endpoint
      {
        method: 'POST',
        path: basePath,
        description: `Create a new ${model.name}`,
        auth: true,
        requestBody: model,
        response: model,
        example: {
          request: this.generateCreateExample(model),
          response: this.generateSingleExample(model),
        },
      },
      // GET single item endpoint
      {
        method: 'GET',
        path: `${basePath}/:id`,
        description: `Retrieve a single ${model.name} by ID`,
        auth: true,
        response: model,
        example: {
          request: null,
          response: this.generateSingleExample(model),
        },
      },
      // PATCH update endpoint
      {
        method: 'PATCH',
        path: `${basePath}/:id`,
        description: `Update an existing ${model.name}`,
        auth: true,
        requestBody: model,
        response: model,
        example: {
          request: this.generateUpdateExample(model),
          response: this.generateSingleExample(model),
        },
      },
      // DELETE endpoint
      {
        method: 'DELETE',
        path: `${basePath}/:id`,
        description: `Delete a ${model.name}`,
        auth: true,
        response: null,
        example: {
          request: null,
          response: null,
        },
      },
    ]

    // Add relationship endpoints if they exist
    if (model.relations?.length > 0) {
      model.relations.forEach((relationship) => {
        endpoints.push(this.generateRelationshipEndpoint(model, relationship))
      })
    }

    return endpoints
  }

  private generateCreateExample(model: ModelMetadata): any {
    if (!model?.fields) return {}

    return model.fields
      .filter((field) => !field.isComputed && field.name !== 'id')
      .reduce(
        (acc, field) => {
          acc[field.name] = this.generateExampleValue(field)
          return acc
        },
        {} as Record<string, any>,
      )
  }

  private generateSingleExample(model: ModelMetadata | undefined): any {
    if (!model?.fields) return {}

    const example: Record<string, any> = {}

    model.fields.forEach((field) => {
      // Use explicit example if provided in documentation
      if (field.documentation?.example !== undefined) {
        example[field.name] = field.documentation.example
        return
      }

      // Generate sensible defaults based on field type
      example[field.name] = this.generateExampleValue(field)
    })

    return example
  }

  private generateRelationshipEndpoint(
    model: ModelMetadata,
    relationship: RelationshipMetadata,
  ): EndpointMetadata {
    const basePath = `/${model.name.toLowerCase()}`
    const relationPath = relationship.name.toLowerCase()

    // The structure changes based on the relationship type
    if (
      relationship.relationType === 'one-to-many' ||
      relationship.relationType === 'many-to-many'
    ) {
      return {
        method: 'GET',
        path: `${basePath}/:id/${relationPath}`,
        description: `Retrieve all ${relationship.name} for a ${model.name}`,
        auth: true,
        response: {
          type: 'array',
          items: {
            type: relationship.foreign.model,
          },
        },
        example: {
          request: null,
          response: this.generateRelationshipExample(relationship),
        },
      }
    }

    return {
      method: 'GET',
      path: `${basePath}/:id/${relationPath}`,
      description: `Retrieve the ${relationship.name} for a ${model.name}`,
      auth: true,
      response: {
        type: relationship.foreign.model,
      },
      example: {
        request: null,
        response: this.generateSingleExample(this.findModelByName(relationship.foreign.model)),
      },
    }
  }

  private generateExampleValue(field: FieldMetadata): any {
    switch (field.type?.toLowerCase()) {
      case 'string':
        return this.generateStringExample(field)
      case 'number':
        return this.generateNumberExample(field)
      case 'boolean':
        return true
      case 'date':
        return new Date().toISOString()
      case 'object':
        return this.generateObjectExample(field)
      default:
        return null
    }
  }

  private generateCollectionExample(model: ModelMetadata): any[] {
    if (!model) return []

    // Generate three example items to show variation
    return [
      this.generateSingleExample(model),
      this.generateSingleExample(model),
      this.generateSingleExample(model),
    ].map((example, index) => ({
      ...example,
      id: `${index + 1}`, // Ensure unique IDs in collection
    }))
  }

  /**
   * Generates the documentation for error handling across the API.
   * This includes standard error responses, validation errors,
   * and business logic errors.
   */
  private generateErrorHandlingDocs(): string {
    let docs = '## Error Handling\n\n'
    docs +=
      'This API uses conventional HTTP response codes to indicate the success or failure of requests.\n\n'

    // Standard error codes
    docs += '### HTTP Status Codes\n\n'
    docs += '| Code | Description |\n'
    docs += '|------|-------------|\n'
    docs += '| 200  | Success - The request was processed successfully |\n'
    docs += '| 201  | Created - A new resource was created successfully |\n'
    docs +=
      '| 400  | Bad Request - The request could not be understood or was missing required parameters |\n'
    docs += '| 401  | Unauthorized - Authentication failed or user lacks necessary permissions |\n'
    docs += '| 404  | Not Found - Resource not found |\n'
    docs += '| 422  | Validation Error - Request validation failed |\n'
    docs += '| 500  | Server Error - Something went wrong on our end |\n\n'

    // Validation errors
    docs += '### Validation Errors\n\n'
    docs +=
      'When a request fails validation, the response will include detailed error information:\n\n'
    docs += '```json\n'
    docs += `{
  "statusCode": 422,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Must be a valid email address"
    }
  ]
}\n`
    docs += '```\n\n'

    // Business logic errors
    docs += '### Business Logic Errors\n\n'
    docs += 'These errors occur when a request violates business rules:\n\n'
    docs += '```json\n'
    docs += `{
  "statusCode": 400,
  "message": "Cannot delete an active subscription",
  "code": "ACTIVE_SUBSCRIPTION"
}\n`
    docs += '```\n'

    return docs
  }

  /**
   * Generates documentation about authentication mechanisms
   * and security requirements for the API.
   */
  private generateAuthenticationDocs(): string {
    let docs = '## Authentication\n\n'
    docs +=
      'This API uses JWT Bearer token authentication. All authenticated endpoints require a valid JWT token.\n\n'

    // Token acquisition
    docs += '### Obtaining a Token\n\n'
    docs += 'To obtain a token, make a POST request to the authentication endpoint:\n\n'
    docs += '```bash\n'
    docs += 'curl -X POST /auth/login \\\n'
    docs += '  -H "Content-Type: application/json" \\\n'
    docs += '  -d \'{"email": "user@example.com", "password": "yourpassword"}\'\n'
    docs += '```\n\n'

    // Using tokens
    docs += '### Using the Token\n\n'
    docs += 'Include the token in the Authorization header of your requests:\n\n'
    docs += '```bash\n'
    docs += 'curl -X GET /api/resource \\\n'
    docs += '  -H "Authorization: Bearer your.jwt.token"\n'
    docs += '```\n\n'

    // Token refresh
    docs += '### Token Refresh\n\n'
    docs += 'Tokens expire after 24 hours. Use the refresh endpoint to obtain a new token:\n\n'
    docs += '```bash\n'
    docs += 'curl -X POST /auth/refresh \\\n'
    docs += '  -H "Authorization: Bearer your.refresh.token"\n'
    docs += '```\n'

    return docs
  }

  /**
   * Generates a high-level overview of the API, including its
   * purpose, main features, and general usage guidelines.
   */
  private generateOverview(): string {
    let overview = '## Overview\n\n'
    overview += 'This API provides a RESTful interface for managing application resources. '
    overview += 'It follows REST principles and uses standard HTTP methods for operations.\n\n'

    // Base URL
    overview += '### Base URL\n\n'
    overview += '```\n'
    overview += 'https://api.example.com/v1\n'
    overview += '```\n\n'

    // Versioning
    overview += '### API Versioning\n\n'
    overview += 'The API version is included in the URL path. The current version is `v1`.\n\n'

    // Content Types
    overview += '### Content Types\n\n'
    overview += 'The API accepts and returns JSON data. All requests must include:\n\n'
    overview += '```\n'
    overview += 'Content-Type: application/json\n'
    overview += 'Accept: application/json\n'
    overview += '```\n\n'

    // Rate Limiting
    overview += '### Rate Limiting\n\n'
    overview +=
      'Requests are limited to 100 per minute per API key. Rate limit information is included in response headers:\n\n'
    overview += '```\n'
    overview += 'X-RateLimit-Limit: 100\n'
    overview += 'X-RateLimit-Remaining: 95\n'
    overview += 'X-RateLimit-Reset: 1623456789\n'
    overview += '```\n'

    return overview
  }

  /**
   * Generates common response definitions used across multiple endpoints.
   * This includes standard error responses and validation failures that
   * might occur in any endpoint.
   */
  private generateCommonResponses(): Record<string, any> {
    return {
      '400': {
        description: 'Bad Request - The request could not be understood',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                statusCode: {
                  type: 'number',
                  example: 400,
                },
                message: {
                  type: 'string',
                  example: 'Invalid request parameters',
                },
                errors: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      field: {
                        type: 'string',
                      },
                      message: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '401': {
        description: 'Unauthorized - Authentication is required',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                statusCode: {
                  type: 'number',
                  example: 401,
                },
                message: {
                  type: 'string',
                  example: 'Authentication required',
                },
              },
            },
          },
        },
      },
      '403': {
        description: 'Forbidden - Insufficient permissions',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                statusCode: {
                  type: 'number',
                  example: 403,
                },
                message: {
                  type: 'string',
                  example: 'Insufficient permissions to access this resource',
                },
              },
            },
          },
        },
      },
      '404': {
        description: 'Not Found - The requested resource does not exist',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                statusCode: {
                  type: 'number',
                  example: 404,
                },
                message: {
                  type: 'string',
                  example: 'Resource not found',
                },
              },
            },
          },
        },
      },
    }
  }

  /**
   * Helper method to generate example strings based on field context.
   */
  private generateStringExample(field: FieldMetadata): string {
    // Use field name to generate contextual examples
    if (field.name.includes('email')) {
      return 'user@example.com'
    }
    if (field.name.includes('name')) {
      return 'John Doe'
    }
    if (field.name.includes('phone')) {
      return '+1 (555) 123-4567'
    }
    return 'example'
  }

  /**
   * Helper method to generate example numbers based on field context.
   */
  private generateNumberExample(field: FieldMetadata): number {
    // Use validation rules to generate appropriate numbers
    const min = field.validationRules.find((rule) => rule.decorator === 'Min')?.params?.[0] ?? 0
    const max = field.validationRules.find((rule) => rule.decorator === 'Max')?.params?.[0] ?? 100
    return Math.floor((min + max) / 2)
  }

  /**
   * Helper method to generate example objects for complex fields.
   */
  private generateObjectExample(field: FieldMetadata): Record<string, any> {
    // If we have a nested type definition, use it
    if (field.nestedType) {
      return this.generateSingleExample(this.findModelByName(field.nestedType))
    }
    return {}
  }

  /**
   * Generates OpenAPI parameter definitions for query parameters.
   * This method creates documentation for common query parameters like
   * pagination, filtering, and sorting that can be used to customize
   * API responses.
   */
  private generateQueryParameters(model: ModelMetadata): any[] {
    const parameters = [
      // Pagination parameters
      {
        name: 'page',
        in: 'query',
        required: false,
        description: 'Page number for paginated results',
        schema: {
          type: 'integer',
          minimum: 1,
          default: 1,
        },
      },
      {
        name: 'limit',
        in: 'query',
        required: false,
        description: 'Number of items per page',
        schema: {
          type: 'integer',
          minimum: 1,
          maximum: 100,
          default: 10,
        },
      },
    ]

    // Add filter parameters based on filterable fields
    model.fields
      .filter((field) => this.isFilterableField(field))
      .forEach((field) => {
        parameters.push({
          name: `filter[${field.name}]`,
          in: 'query',
          required: false,
          description: `Filter results by ${field.name}`,
          schema: {
            type: this.mapTypeToOpenAPI(field.type),
          },
        })
      })

    return parameters
  }

  /**
   * Generates example responses for relationship endpoints.
   * This method creates realistic example data for related entities,
   * showing how relationship data is structured in API responses.
   */
  private generateRelationshipExample(relationship: RelationshipMetadata): any {
    // Find the related model
    const relatedModel = this.findModelByName(relationship.foreign.model)
    if (!relatedModel) {
      return []
    }

    // For one-to-many or many-to-many relationships, generate an array of examples
    if (
      relationship.relationType === 'one-to-many' ||
      relationship.relationType === 'many-to-many'
    ) {
      return [
        this.generateRelatedEntityExample(relatedModel, relationship),
        this.generateRelatedEntityExample(relatedModel, relationship),
      ]
    }

    // For one-to-one or many-to-one relationships, generate a single example
    return this.generateRelatedEntityExample(relatedModel, relationship)
  }

  /**
   * Helper method to generate an example of a related entity.
   * This creates realistic example data while maintaining referential integrity
   * in the examples.
   */
  private generateRelatedEntityExample(
    model: ModelMetadata,
    relationship: RelationshipMetadata,
  ): any {
    const example = this.generateSingleExample(model)

    // Add relationship-specific fields
    if (relationship.foreign.field) {
      example[relationship.foreign.field] = this.generateExampleId()
    }

    return example
  }

  /**
   * Helper method to determine if a field should be available for filtering.
   * Not all fields make sense as filter parameters, so we need to be selective.
   */
  private isFilterableField(field: FieldMetadata): boolean {
    // Don't allow filtering on computed fields or complex objects
    if (field.isComputed || field.type === 'object') {
      return false
    }

    // Don't allow filtering on sensitive fields
    const sensitiveFields = ['password', 'token', 'secret']
    if (sensitiveFields.includes(field.name)) {
      return false
    }

    // Allow filtering on basic types that make sense to filter by
    const filterableTypes = ['string', 'number', 'boolean', 'Date']
    return filterableTypes.includes(field.type)
  }

  /**
   * Helper method to generate example IDs for relationships.
   * This ensures our examples use consistent ID formats.
   */
  private generateExampleId(): string {
    // Generate a UUID-like string for example IDs
    return '123e4567-e89b-12d3-a456-426614174000'
  }
}
