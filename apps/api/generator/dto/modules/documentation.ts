// tools/generators/dto/modules/documentation.ts

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

  /**
   * Main generation process that coordinates the creation of all
   * documentation artifacts. Each piece of documentation serves a
   * different purpose and audience.
   */
  async generate(): Promise<void> {
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
   * Generates controller-specific documentation including all endpoints,
   * request/response formats, and validation rules.
   */
  private generateControllerDocs(model: ModelMetadata): string {
    let doc = `## ${model.name} Controller\n\n`
    doc += `${model.documentation.description}\n\n`

    // Base path information
    doc += `**Base Path:** \`/${model.name.toLowerCase()}\`\n\n`

    // Document each endpoint
    const endpoints = this.getControllerEndpoints(model)
    endpoints.forEach((endpoint) => {
      doc += this.generateEndpointDocs(endpoint, model)
    })

    return doc
  }

  /**
   * Generates detailed endpoint documentation including request/response
   * formats, validation rules, and example usage.
   */
  private generateEndpointDocs(endpoint: EndpointMetadata, model: ModelMetadata): string {
    let doc = `### ${endpoint.description}\n\n`

    // Method and path
    doc += `\`${endpoint.method} ${endpoint.path}\`\n\n`

    // Authentication requirements
    if (endpoint.auth) {
      doc += '**Authentication Required**\n\n'
    }

    // Request body documentation
    if (endpoint.requestBody) {
      doc += '#### Request Body\n\n'
      doc += this.generateTypeTable(endpoint.requestBody)
      doc += '\n\n#### Example Request\n\n'
      doc += '```json\n' + JSON.stringify(endpoint.example.request, null, 2) + '\n```\n\n'
    }

    // Response documentation
    doc += '#### Response\n\n'
    doc += this.generateTypeTable(endpoint.response)
    doc += '\n\n#### Example Response\n\n'
    doc += '```json\n' + JSON.stringify(endpoint.example.response, null, 2) + '\n```\n\n'

    // Validation rules
    doc += '#### Validation Rules\n\n'
    doc += this.generateValidationTable(model.fields)

    return doc
  }

  /**
   * Generates OpenAPI/Swagger specification file that can be used
   * with Swagger UI or other API documentation tools.
   */
  private async generateOpenAPISpec(): Promise<void> {
    const spec = {
      openapi: '3.0.0',
      info: {
        title: this.options.documentation.title,
        version: this.options.documentation.version,
        description: this.options.documentation.description,
      },
      paths: {},
      components: {
        schemas: {},
        securitySchemes: this.generateSecuritySchemes(),
      },
    }

    // Generate paths and schemas for each model
    for (const model of this.models) {
      spec.paths = {
        ...spec.paths,
        ...this.generateOpenAPIPaths(model),
      }
      spec.components.schemas = {
        ...spec.components.schemas,
        ...this.generateOpenAPISchemas(model),
      }
    }

    await this.fileManager.writeFile('docs/openapi.json', JSON.stringify(spec, null, 2))
  }

  /**
   * Generates database documentation including table structures,
   * relationships, and constraints.
   */
  private async generateDatabaseDocs(): Promise<void> {
    let content = '# Database Documentation\n\n'

    // Overview of database structure
    content += this.generateDatabaseOverview()

    // Document each table/view
    for (const model of this.models) {
      content += this.generateTableDocs(model)
    }

    // Add sections for indexes and constraints
    content += this.generateIndexDocs()
    content += this.generateConstraintDocs()

    await this.fileManager.writeFile('docs/DATABASE.md', content)
  }

  /**
   * Generates relationship diagrams using Mermaid syntax to visualize
   * database structure and entity relationships.
   */
  private async generateRelationshipDiagrams(): Promise<void> {
    let diagram = 'erDiagram\n'

    // Add entities
    this.models.forEach((model) => {
      diagram += this.generateEntityBlock(model)
    })

    // Add relationships
    this.models.forEach((model) => {
      model.relationships.forEach((rel) => {
        diagram += this.generateRelationshipLine(model, rel)
      })
    })

    await this.fileManager.writeFile('docs/diagrams/relationships.mmd', diagram)
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
   * Helper method to generate a table of type information for
   * request/response documentation.
   */
  private generateTypeTable(fields: FieldMetadata[]): string {
    return `| Field | Type | Required | Description |
|-------|------|----------|-------------|
${fields
  .map(
    (field) =>
      `| ${field.name} | ${field.type} | ${field.isRequired ? 'Yes' : 'No'} | ${field.documentation.description} |`,
  )
  .join('\n')}`
  }

  /**
   * Helper method to generate a table of validation rules for
   * a set of fields.
   */
  private generateValidationTable(fields: FieldMetadata[]): string {
    return `| Field | Validation Rules |
|-------|------------------|
${fields
  .map((field) => `| ${field.name} | ${this.formatValidationRules(field.validationRules)} |`)
  .join('\n')}`
  }

  /**
   * Helper method to generate an entity block in Mermaid syntax
   * for the relationship diagram.
   */
  private generateEntityBlock(model: ModelMetadata): string {
    return `  ${model.name} {
${model.fields.map((field) => `    ${field.type} ${field.name}`).join('\n')}
  }\n`
  }

  /**
   * Helper method to generate a relationship line in Mermaid syntax
   * for the relationship diagram.
   */
  private generateRelationshipLine(
    model: ModelMetadata,
    relationship: RelationshipMetadata,
  ): string {
    const cardinality = this.getRelationshipCardinality(relationship)
    return `  ${model.name} ${cardinality} ${relationship.foreign.model}\n`
  }

  /**
   * Determines the cardinality symbol for relationship diagrams.
   * This helps visualize how entities are related to each other.
   */
  private getRelationshipCardinality(relationship: RelationshipMetadata): string {
    const cardinalityMap = {
      'one-to-one': '||--||',
      'one-to-many': '||--{',
      'many-to-one': '}--||',
      'many-to-many': '}--{',
    }

    return cardinalityMap[relationship.relationType] || '||--||'
  }

  /**
   * Formats validation rules into a human-readable string.
   * This makes validation requirements clear in the documentation.
   */
  private formatValidationRules(rules: ValidationRule[]): string {
    if (!rules.length) return 'No validation rules'

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
   * Generates documentation for database constraints including foreign keys,
   * unique constraints, and check constraints.
   */
  private generateConstraintDocs(): string {
    let docs = '## Database Constraints\n\n'

    // Foreign Key Constraints
    docs += '### Foreign Key Constraints\n\n'
    this.models.forEach((model) => {
      model.relationships.forEach((rel) => {
        docs += `- ${model.name}.${rel.name} → ${rel.foreign.model}.${rel.foreign.field}\n`
      })
    })

    // Unique Constraints
    docs += '\n### Unique Constraints\n\n'
    this.models.forEach((model) => {
      const uniqueConstraints = this.getUniqueConstraints(model)
      uniqueConstraints.forEach((constraint) => {
        docs += `- ${model.name}: (${constraint.fields.join(', ')})\n`
      })
    })

    // Check Constraints
    docs += '\n### Check Constraints\n\n'
    this.models.forEach((model) => {
      const checkConstraints = this.getCheckConstraints(model)
      checkConstraints.forEach((constraint) => {
        docs += `- ${model.name}.${constraint.field}: ${constraint.condition}\n`
      })
    })

    return docs
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
   * including its structure, constraints, and usage.
   */
  private generateTableDocs(model: ModelMetadata): string {
    let docs = `## ${model.name}\n\n`
    docs += `${model.documentation.description}\n\n`

    // Table structure
    docs += '### Columns\n\n'
    docs += this.generateColumnTable(model.fields)

    // Primary Key
    docs += '\n### Primary Key\n\n'
    docs += this.getPrimaryKeyInfo(model)

    // Foreign Keys
    docs += '\n### Foreign Keys\n\n'
    model.relationships.forEach((rel) => {
      docs += `- ${rel.name} → ${rel.foreign.model} (${rel.relationType})\n`
    })

    // Indexes
    docs += '\n### Indexes\n\n'
    const indexes = this.getModelIndexes(model)
    indexes.forEach((index) => {
      docs += `- ${index.name} (${index.type}): ${index.columns.join(', ')}\n`
    })

    return docs
  }

  /**
   * Generates an overview of the database structure including
   * its schema, major entities, and their relationships.
   */
  private generateDatabaseOverview(): string {
    let overview = '## Database Overview\n\n'

    // List all entities
    overview += '### Entities\n\n'
    this.models.forEach((model) => {
      overview += `- **${model.name}**: ${model.documentation.description}\n`
    })

    // Key relationships
    overview += '\n### Key Relationships\n\n'
    this.models.forEach((model) => {
      model.relationships.forEach((rel) => {
        overview += `- ${model.name} ${this.getRelationshipCardinality(rel)} ${rel.foreign.model}\n`
      })
    })

    // Database notes
    overview += '\n### Important Notes\n\n'
    overview += '- All timestamps are stored in UTC\n'
    overview += '- Soft deletes are implemented using `deleted_at` column\n'
    overview += '- Foreign keys are enforced at the database level\n'

    return overview
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
   * Creates a detailed example of creating a new entity.
   * This shows developers what fields are required and how to structure
   * their creation requests.
   */
  private generateCreateExample(model: ModelMetadata): string {
    const example = model.fields
      .filter((field) => !field.isComputed && field.name !== 'id')
      .reduce(
        (acc, field) => {
          acc[field.name] = this.generateExampleValue(field)
          return acc
        },
        {} as Record<string, any>,
      )

    return `// POST /${model.name.toLowerCase()}
const createPayload = ${JSON.stringify(example, null, 2)};

const response = await api.post('/${model.name.toLowerCase()}', createPayload);
`
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
   * Gets the unique constraints for a model.
   * This extracts unique constraints from model metadata to document
   * data integrity rules.
   */
  private getUniqueConstraints(model: ModelMetadata): Array<{ fields: string[] }> {
    const constraints: Array<{ fields: string[] }> = []

    // Single-field unique constraints
    model.fields
      .filter((field) => field.validationRules.some((rule) => rule.decorator === 'IsUnique'))
      .forEach((field) => {
        constraints.push({ fields: [field.name] })
      })

    // Composite unique constraints from model metadata
    const compositeUnique = model.documentation.description.match(/@unique\s+\[(.*?)\]/g)
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
   * Generates a formatted table of column information.
   * This creates a markdown table documenting all columns in a model.
   */
  private generateColumnTable(fields: FieldMetadata[]): string {
    let table = '| Column | Type | Nullable | Default | Description |\n'
    table += '|--------|------|----------|----------|-------------|\n'

    fields.forEach((field) => {
      table += `| ${field.name} | ${field.type} | ${field.isRequired ? 'No' : 'Yes'} | ${
        field.documentation.description.match(/@default\s+([^\s]+)/)?.[1] || 'NULL'
      } | ${field.documentation.description.split('.')[0]} |\n`
    })

    return table
  }

  /**
   * Gets primary key information for a model.
   * This documents the primary key structure and constraints.
   */
  private getPrimaryKeyInfo(model: ModelMetadata): string {
    const pkFields = model.fields.filter((field) =>
      field.validationRules.some((rule) => rule.decorator === 'IsPrimaryKey'),
    )

    if (pkFields.length === 0) {
      return 'Primary Key: id (auto-generated UUID)'
    }

    return `Primary Key: ${pkFields.map((field) => field.name).join(', ')}`
  }

  /**
   * Generates OpenAPI schema definitions for all our models.
   * These schemas define the structure and validation rules for our API's
   * data models in a format that OpenAPI tools can understand.
   */
  private generateOpenAPISchemas(model: ModelMetadata): Record<string, any> {
    const schemas: Record<string, any> = {}

    // Generate the main model schema
    schemas[model.name] = {
      type: 'object',
      description: model.documentation.description,
      properties: this.generateSchemaProperties(model.fields),
      required: this.getRequiredFields(model.fields),
    }

    // Generate schemas for nested types and related models
    model.relationships.forEach((relationship) => {
      if (!schemas[relationship.foreign.model]) {
        const relatedModel = this.findModelByName(relationship.foreign.model)
        if (relatedModel) {
          schemas[relationship.foreign.model] = {
            type: 'object',
            description: relatedModel.documentation.description,
            properties: this.generateSchemaProperties(relatedModel.fields),
            required: this.getRequiredFields(relatedModel.fields),
          }
        }
      }
    })

    return schemas
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
   * Helper method to generate schema properties from field metadata.
   * This converts our internal field definitions into OpenAPI-compatible
   * property definitions.
   */
  private generateSchemaProperties(fields: FieldMetadata[]): Record<string, any> {
    const properties: Record<string, any> = {}

    fields.forEach((field) => {
      properties[field.name] = {
        type: this.mapTypeToOpenAPI(field.type),
        description: field.documentation.description,
        example: field.documentation.example,
      }

      // Add format for special types
      if (field.type === 'Date') {
        properties[field.name].format = 'date-time'
      }

      // Add validation constraints
      if (field.validationRules.length > 0) {
        this.addValidationToSchema(properties[field.name], field.validationRules)
      }
    })

    return properties
  }

  /**
   * Helper method to find required fields in a model.
   * This helps generate accurate OpenAPI schemas that reflect
   * our data validation rules.
   */
  private getRequiredFields(fields: FieldMetadata[]): string[] {
    return fields.filter((field) => field.isRequired).map((field) => field.name)
  }

  /**
   * Helper method to map our internal types to OpenAPI types.
   * This ensures our API documentation uses standard OpenAPI type definitions.
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

    return typeMap[type] || 'string'
  }

  /**
   * Helper method to add validation rules to OpenAPI schemas.
   * This ensures our API documentation includes all validation constraints.
   */
  private addValidationToSchema(schema: any, rules: ValidationRule[]): void {
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
   * Helper method to find a model by its name.
   * Used when generating related model schemas.
   */
  private findModelByName(name: string): ModelMetadata | undefined {
    return this.models.find((model) => model.name === name)
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
    model.relationships.forEach((relationship) => {
      endpoints.push(this.generateRelationshipEndpoint(model, relationship))
    })

    return endpoints
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
   * Generates documentation for endpoints that handle relationships between models.
   * This creates documentation for nested resources and related entity endpoints,
   * showing how to access and manipulate related data.
   */
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
    } else {
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
  }

  /**
   * Generates an example of a single resource response.
   * This creates realistic example data for each field in the model,
   * helping developers understand what the API returns.
   */
  private generateSingleExample(model: ModelMetadata | undefined): any {
    if (!model) return {}

    const example: Record<string, any> = {}

    model.fields.forEach((field) => {
      // Use explicit example if provided in documentation
      if (field.documentation.example !== undefined) {
        example[field.name] = field.documentation.example
        return
      }

      // Generate sensible defaults based on field type
      example[field.name] = this.generateExampleValue(field)
    })

    return example
  }

  /**
   * Generates an example of a collection response.
   * This creates an array of example resources, showing how
   * list endpoints return multiple items.
   */
  private generateCollectionExample(model: ModelMetadata): any[] {
    // Generate three example items to show variation
    return [
      this.generateSingleExample(model),
      this.generateSingleExample(model),
      this.generateSingleExample(model),
    ].map((example, index) => ({
      ...example,
      id: index + 1, // Ensure unique IDs in collection
    }))
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
   * Helper method to generate realistic example values for different field types.
   * This creates appropriate sample data based on the field's type and validation rules.
   */
  private generateExampleValue(field: FieldMetadata): any {
    switch (field.type) {
      case 'string':
        return this.generateStringExample(field)
      case 'number':
        return this.generateNumberExample(field)
      case 'boolean':
        return true
      case 'Date':
        return new Date().toISOString()
      case 'object':
        return this.generateObjectExample(field)
      default:
        return null
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
      // Sorting parameter
      {
        name: 'sort',
        in: 'query',
        required: false,
        description: 'Sort order for results. Format: field:direction (e.g., createdAt:desc)',
        schema: {
          type: 'string',
          example: 'createdAt:desc',
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

    // Add include parameter for relationships
    if (model.relationships.length > 0) {
      parameters.push({
        name: 'include',
        in: 'query',
        required: false,
        description: 'Include related resources',
        schema: {
          type: 'string',
          example: model.relationships.map((rel) => rel.name).join(','),
        },
      })
    }

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
