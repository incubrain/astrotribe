// tools/generators/dto/core/base.generator.ts
import { FileManager } from '../utils/file-manager'
import { FieldParser } from '../utils/field-parser'
import { DocumentationParser } from '../utils/documentation-parser'
import { TypeMapper } from '../utils/type-mapper'
import { OpenAPIMetadataGenerator } from '../modules/openapi-metadata'
import { ValidationGenerator } from '../modules/validators'
import type {
  GeneratorOptions,
  ModelMetadata,
  GeneratedFile,
  RelationshipMetadata,
  ViewMetadata,
  ComputedColumnMetadata,
  ValidationRule,
} from '../types'
import type { DMMF } from '@prisma/generator-helper'

/**
 * Base generator class that orchestrates the DTO generation process.
 * This class coordinates between different modules while maintaining
 * separation of concerns.
 */
export abstract class BaseGenerator {
  protected fileManager: FileManager
  protected fieldParser: FieldParser
  protected documentationParser: DocumentationParser
  protected typeMapper: TypeMapper
  protected openApiGenerator: OpenAPIMetadataGenerator

  constructor(
    protected readonly dmmf: DMMF.Document,
    protected readonly options: GeneratorOptions,
  ) {
    this.fileManager = new FileManager(options.outputPath)
    this.documentationParser = new DocumentationParser()
    this.typeMapper = new TypeMapper()
    this.openApiGenerator = new OpenAPIMetadataGenerator(this.typeMapper)
    this.fieldParser = new FieldParser()
  }

  /**
   * Main generation process that coordinates all generator modules.
   * Each step is isolated and can be enabled/disabled via options.
   */
  async generate(): Promise<void> {
    // Create necessary directories
    await this.fileManager.initializeDirectory()

    // Process each model
    for (const model of this.dmmf.datamodel.models) {
      const metadata = await this.processModel(model)

      // Generate different artifacts based on options
      const files: GeneratedFile[] = []

      if (this.options.typescript.generateInterfaces) {
        files.push(await this.generateInterface(metadata))
      }

      if (this.options.validation.enabled) {
        files.push(await this.generateValidatedDTO(metadata))
      }

      if (this.options.typescript.generateTypeGuards) {
        files.push(await this.generateTypeGuard(metadata))
      }

      if (this.options.validation.useZod) {
        files.push(await this.generateZodSchema(metadata))
      }

      // Write all generated files
      await Promise.all(files.map((file) => this.fileManager.writeFile(file.path, file.content)))
    }

    // Generate auxiliary files
    if (this.options.documentation.enabled) {
      await this.generateDocumentation()
    }

    await this.generateIndexFile()
    await this.generateUtilityFiles()
  }

  /**
   * Processes a Prisma model into our internal metadata format, now with view support.
   * This method examines model attributes to determine if it represents a view and
   * extracts view-specific metadata when applicable.
   */
  protected async processModel(model: DMMF.Model): Promise<ModelMetadata> {
    const documentation = this.documentationParser.parseModelDocumentation(model)
    const fields = await Promise.all(
      model.fields.map((field) => this.fieldParser.parseField(field)),
    )

    // Determine if this model represents a view by checking Prisma metadata
    const isView = this.isModelAView(model)
    let viewMetadata: ViewMetadata | undefined

    if (isView) {
      viewMetadata = await this.extractViewMetadata(model)
    }

    return {
      name: model.name,
      documentation,
      fields,
      relationships: this.processRelationships(model),
      isView,
      viewMetadata,
    }
  }

  /**
   * Determines if a Prisma model represents a database view by examining
   * its attributes and documentation.
   */
  private isModelAView(model: DMMF.Model): boolean {
    // Check for view-specific markers in the model's documentation
    const viewMarker = model.documentation?.includes('@view')

    // Check for Prisma-specific view attributes
    const hasViewAttribute =
      model.documentation?.includes('@view') || model.documentation?.includes('@@view')

    return viewMarker || hasViewAttribute || false
  }

  /**
   * Extracts detailed metadata about a view from its Prisma model definition.
   * This includes the view's source query, dependencies, and computed columns.
   */
  private async extractViewMetadata(model: DMMF.Model): Promise<ViewMetadata> {
    const viewMetadata: ViewMetadata = {
      sourceQuery: this.extractSourceQuery(model),
      materialized: this.isViewMaterialized(model),
      updatable: this.isViewUpdatable(model),
      dependencies: this.extractViewDependencies(model),
      computedColumns: [],
    }

    // Process computed columns
    viewMetadata.computedColumns = await this.extractComputedColumns(model)

    return viewMetadata
  }

  /**
   * Extracts the SQL query that defines a view from model documentation.
   * This is typically specified in a special documentation comment.
   */
  private extractSourceQuery(model: DMMF.Model): string {
    const queryMatch = model.documentation?.match(/@view-query\s+{([^}]+)}/)
    return queryMatch ? queryMatch[1].trim() : ''
  }

  /**
   * Determines if a view is materialized by checking its attributes.
   */
  private isViewMaterialized(model: DMMF.Model): boolean {
    return model.documentation?.includes('@materialized') || false
  }

  /**
   * Checks if a view is updatable based on its definition and constraints.
   */
  private isViewUpdatable(model: DMMF.Model): boolean {
    return model.documentation?.includes('@updatable') || false
  }

  /**
   * Extracts a list of tables and views that this view depends on.
   */
  private extractViewDependencies(model: DMMF.Model): string[] {
    const dependencyMatch = model.documentation?.match(/@dependencies\s+\[(.*?)\]/)
    if (!dependencyMatch) return []

    return dependencyMatch[1]
      .split(',')
      .map((dep) => dep.trim())
      .filter(Boolean)
  }

  /**
   * Extracts information about computed columns in the view.
   */
  private async extractComputedColumns(model: DMMF.Model): Promise<ComputedColumnMetadata[]> {
    const computedColumns: ComputedColumnMetadata[] = []

    for (const field of model.fields) {
      if (this.isComputedColumn(field)) {
        computedColumns.push({
          name: field.name,
          expression: this.extractComputedExpression(field),
          dependsOn: this.extractColumnDependencies(field),
          returnType: field.type,
        })
      }
    }

    return computedColumns
  }

  /**
   * Determines if a field represents a computed column.
   */
  private isComputedColumn(field: DMMF.Field): boolean {
    return field.documentation?.includes('@computed') || false
  }

  /**
   * Extracts the SQL expression that computes a column's value.
   */
  private extractComputedExpression(field: DMMF.Field): string {
    const expressionMatch = field.documentation?.match(/@computed-expression\s+{([^}]+)}/)
    return expressionMatch ? expressionMatch[1].trim() : ''
  }

  /**
   * Extracts the list of fields that a computed column depends on.
   */
  private extractColumnDependencies(field: DMMF.Field): string[] {
    const dependencyMatch = field.documentation?.match(/@depends-on\s+\[(.*?)\]/)
    if (!dependencyMatch) return []

    return dependencyMatch[1]
      .split(',')
      .map((dep) => dep.trim())
      .filter(Boolean)
  }

  /**
   * Generates validation rules appropriate for a view-based DTO.
   * Views require special handling as some fields may be computed
   * or derived from complex expressions.
   */
  protected generateViewValidationRules(metadata: ModelMetadata): ValidationRule[] {
    const rules: ValidationRule[] = []

    if (!metadata.isView) return rules

    // Add view-specific validation rules
    rules.push({
      decorator: 'IsViewDTO',
      message: `This DTO represents a view: ${metadata.name}`,
    })

    // Handle computed columns differently
    metadata.viewMetadata?.computedColumns.forEach((column) => {
      rules.push({
        decorator: 'IsComputed',
        params: [column.name],
        message: `${column.name} is a computed field`,
      })
    })

    return rules
  }

  /**
   * Abstract methods that must be implemented by specific generators
   */
  protected abstract generateInterface(metadata: ModelMetadata): Promise<GeneratedFile>
  protected abstract generateValidatedDTO(metadata: ModelMetadata): Promise<GeneratedFile>
  protected abstract generateTypeGuard(metadata: ModelMetadata): Promise<GeneratedFile>
  protected abstract generateZodSchema(metadata: ModelMetadata): Promise<GeneratedFile>
  protected abstract generateDocumentation(): Promise<void>
  protected abstract generateIndexFile(): Promise<void>
  protected abstract generateUtilityFiles(): Promise<void>

  /**
   * Processes model relationships to build a complete picture
   * of how models are connected
   */
  private processRelationships(model: DMMF.Model): RelationshipMetadata[] {
    return model.fields
      .filter((field) => field.relationName)
      .map((field) => ({
        name: field.name,
        type: field.type,
        relationType: this.determineRelationType(field),
        isRequired: field.isRequired,
        foreign: {
          model: field.type,
          field: field.relationFromFields?.[0] || '',
        },
      }))
  }

  private determineRelationType(field: DMMF.Field): RelationshipMetadata['relationType'] {
    if (field.isList) {
      return field.relationToFields?.length ? 'many-to-many' : 'one-to-many'
    }
    return field.relationToFields?.length ? 'many-to-one' : 'one-to-one'
  }
}
