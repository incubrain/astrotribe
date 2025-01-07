// tools/generators/dto/index.ts
import { join } from 'path'
import { Command } from 'commander'
import { PrismaClient, Prisma } from '@prisma/client'
import { getDMMF } from '@prisma/internals'
import { DMMF } from '@prisma/generator-helper'
import { Chalk } from 'chalk'
import { ConfigurationManager } from './config'
import { BaseGenerator } from './core/base.generator'
import { FileManager } from './utils/file-manager'
import { DocumentationGenerator } from './modules/documentation'
import { ValidationGenerator } from './modules/validators'
import { TransformationGenerator } from './modules/transformers'
import { InterfaceGenerator } from './modules/interfaces'
import { SchemaGenerator } from './modules/schemas'
import { TypeGuardGenerator } from './modules/type-guard'
import { TypeMapper } from './utils/type-mapper'
import { OpenAPIMetadataGenerator } from './modules/openapi-metadata'
import type { GeneratorOptions, ModelMetadata, GeneratedFile, FieldMetadata } from './types'
import { readFile } from 'fs/promises'
import { TemplateEngine } from './templates/template.engine'

const chalk = new Chalk()

/**
 * Main entry point for the DTO generator.
 * Handles CLI interface, configuration loading, and orchestrates
 * the generation process.
 */

function withInitialization<T extends (...args: any[]) => any>(
  method: T,
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  return async function (
    this: { isReady: boolean; initialize: () => Promise<void> },
    ...args: any[]
  ) {
    if (!this.isReady) {
      console.log('Initialization required. Running initialize()...')
      await this.initialize()
    }
    return method.apply(this, args)
  }
}

export async function main() {
  const program = new Command()

  program
    .name('dtogen')
    .description('Generate DTOs from Prisma schema')
    .version('1.0.0')
    .option('-o, --output <path>', 'Output directory for generated files')
    .option('--no-validation', 'Disable validation decorators')
    .option('--no-documentation', 'Disable documentation generation')
    .parse(process.argv)

  const options = program.opts()
  const __dirname = new URL('.', import.meta.url).pathname

  try {
    // Load and validate configuration
    const config: GeneratorOptions = {
      outputPath: join(__dirname, 'src', 'generated'),
      typescript: {
        strict: true,
        generateInterfaces: true,
        generateTypeGuards: true,
      },
      validation: {
        enabled: true,
        useClassValidator: true,
        useZod: true,
      },
      documentation: {
        enabled: true,
        outputFormat: 'markdown' as const,
        includeExamples: true,
      },
    }
    ConfigurationManager.validateConfiguration(config)

    // Get DMMF directly from schema file
    const prisma = new PrismaClient()

    // Initialize generators
    const schemaPath = join(__dirname, '..', '..', '..', '..', 'prisma', 'schema.prisma')
    const fileManager = new FileManager(config.outputPath)
    const dmmf: DMMF.Document = await getDMMF({
      datamodelPath: schemaPath,
    })

    const generator = new DTOGenerator(dmmf, config, prisma, fileManager)

    // Generate all artifacts
    console.log(chalk.blue('Starting DTO generation...'))
    await generator.generate()
    console.log(chalk.green('DTO generation completed successfully!'))
  } catch (error) {
    console.error(chalk.red('Error during generation:'), error)
    process.exit(1)
  }
}

class DTOGenerator extends BaseGenerator {
  private documentationGenerator: DocumentationGenerator
  private validationGenerator: ValidationGenerator
  private transformationGenerator: TransformationGenerator

  constructor(
    dmmf: DMMF.Document,
    options: GeneratorOptions,
    prisma: PrismaClient,
    fileManager: FileManager,
  ) {
    super(dmmf, options)

    // Initialize type mapper as other generators depend on it
    this.typeMapper = new TypeMapper()

    // Initialize generators with template manager
    this.validationGenerator = new ValidationGenerator()
    this.transformationGenerator = new TransformationGenerator()
    this.documentationGenerator = new DocumentationGenerator([], options, this.fileManager)
  }

  override async initialize(): Promise<void> {
    await super.initialize() // Initialize the template engine
    await this.initializeDocumentationGenerator() // Any subclass-specific initialization
  }

  private async initializeDocumentationGenerator(): Promise<void> {
    const processedModels = await Promise.all(
      this.dmmf.datamodel.models.map((model) => this.processModel(model)),
    )

    this.documentationGenerator = new DocumentationGenerator(
      processedModels,
      this.options,
      this.fileManager,
    )
  }

  protected async generateInterface(metadata: ModelMetadata): Promise<GeneratedFile> {
    await this.ensureInitialized()

    const templateName = metadata.isView ? 'interface/view.interface' : 'interface/model.interface'
    const templatePath = join(__dirname, 'templates', `${templateName}.hbs`)
    console.log(`${templatePath} with dirname ${__dirname}`)

    const content = TemplateEngine.process(templatePath, {
      model: metadata,
      imports: this.getInterfaceImports(metadata),
      typeMapper: this.typeMapper,
    })

    return {
      path: `interfaces/${metadata.name.toLowerCase()}.interface.ts`,
      content,
    }
  }

  protected async generateValidatedDTO(metadata: ModelMetadata): Promise<GeneratedFile> {
    await this.ensureInitialized()

    const hasValidation = metadata.fields.some((f) => f.validationRules?.length)
    const hasTransform = metadata.fields.some((f) => f.transformationRules?.length)

    // Process fields
    const fields = metadata.fields.map((field) => ({
      ...field,
      type: this.typeMapper.mapFieldType(field),
      documentation: {
        description: field.documentation?.description || `The ${field.name} field`,
      },
      validationRules: this.processValidationRules(field),
      example: this.generateExample(field),
      default: this.getDefaultValue(field),
    }))

    const templateContext = {
      name: metadata.name,
      documentation: metadata.documentation,
      fields,
      hasValidation,
      hasTransform,
    }

    const content = TemplateEngine.process('dto/model.dto', templateContext)

    return {
      path: `dto/${metadata.name.toLowerCase()}.dto.ts`,
      content,
    }
  }

  private processValidationRules(field: FieldMetadata): string[] {
    const rules: string[] = []

    // Add type validation
    switch (field.type.toLowerCase()) {
      case 'string':
        rules.push('IsString')
        break
      case 'number':
        rules.push('IsNumber')
        break
      case 'boolean':
        rules.push('IsBoolean')
        break
      case 'date':
        rules.push('IsDate')
        break
      case 'uuid':
        rules.push('IsUUID')
        break
    }

    // Add additional validations from metadata
    field.validationRules?.forEach((rule) => {
      if (!rules.includes(rule.decorator)) {
        rules.push(rule.decorator)
      }
    })

    return rules
  }

  private generateExample(field: FieldMetadata): any {
    if (field.documentation?.example !== undefined) {
      return field.documentation.example
    }

    // Generate sensible examples based on type
    switch (field.type.toLowerCase()) {
      case 'string':
        return 'example'
      case 'number':
        return 1
      case 'boolean':
        return true
      case 'date':
        return new Date().toISOString()
      case 'uuid':
        return '00000000-0000-0000-0000-000000000000'
      default:
        return undefined
    }
  }

  private getDefaultValue(field: FieldMetadata): any {
    if (field.hasDefaultValue) {
      return field.default
    }
    return undefined
  }

  protected async generateTypeGuard(metadata: ModelMetadata): Promise<GeneratedFile> {
    await this.ensureInitialized()

    const content = TemplateEngine.process('guard/type.guard.hbs', {
      ...metadata,
      imports: this.getTypeGuardImports(metadata),
    })

    return {
      path: `guards/${metadata.name.toLowerCase()}.guard.ts`,
      content,
    }
  }

  protected async generateZodSchema(metadata: ModelMetadata): Promise<GeneratedFile> {
    await this.ensureInitialized()

    const content = TemplateEngine.process('schema/model.schema.hbs', {
      ...metadata,
      imports: this.getSchemaImports(metadata),
      zodTypes: this.getZodTypes(metadata),
    })

    return {
      path: `schemas/${metadata.name.toLowerCase()}.schema.ts`,
      content,
    }
  }

  protected async generateDocumentation(): Promise<void> {
    if (!this.documentationGenerator) {
      await this.initializeDocumentationGenerator()
    }
    await this.documentationGenerator.generate()
  }

  protected async generateIndexFile(): Promise<void> {
    await this.ensureInitialized()

    const content = TemplateEngine.process('index.hbs', {
      models: this.dmmf.datamodel.models.map((model) => ({
        name: model.name.toLowerCase(),
        hasInterface: this.options.typescript?.generateInterfaces,
        hasTypeGuard: this.options.typescript?.generateTypeGuards,
        hasSchema: this.options.validation?.useZod,
      })),
    })

    await this.fileManager.writeFile('index.ts', content)
  }

  protected async generateUtilityFiles(): Promise<void> {
    await this.ensureInitialized()
    // Generate base types
    const baseTypesTemplate = TemplateEngine.process('base/type-helpers.hbs', {})
    await this.fileManager.writeFile('base/base-types.ts', baseTypesTemplate)

    // Generate helpers
    const helpersTemplate = TemplateEngine.process('base/helpers.hbs', {})
    await this.fileManager.writeFile('base/helpers.ts', helpersTemplate)
  }

  // Helper methods for template context
  private getInterfaceImports(metadata: ModelMetadata): string[] {
    const imports = ['BaseEntity']
    if (metadata.relations?.length) {
      imports.push(...metadata.relations.map((rel) => `I${rel.type}`))
    }
    return imports
  }

  private getDTOImports(metadata: ModelMetadata): string[] {
    const imports = ['ApiProperty']
    if (metadata.fields.some((f) => f.validationRules?.length)) {
      imports.push('IsNotEmpty', 'IsOptional')
    }
    if (metadata.fields.some((f) => f.transformationRules?.length)) {
      imports.push('Transform')
    }
    return imports
  }

  private getTypeGuardImports(metadata: ModelMetadata): string[] {
    return [`I${metadata.name}`, `${metadata.name}Schema`]
  }

  private getSchemaImports(metadata: ModelMetadata): string[] {
    const imports = ['z']
    if (metadata.relations?.length) {
      imports.push(...metadata.relations.map((rel) => `${rel.type}Schema`))
    }
    return imports
  }

  private getSwaggerTypes(metadata: ModelMetadata): Record<string, string> {
    return Object.fromEntries(
      metadata.fields.map((field) => [field.name, this.getSwaggerType(field)]),
    )
  }

  private getZodTypes(metadata: ModelMetadata): Record<string, string> {
    return Object.fromEntries(
      metadata.fields.map((field) => [field.name, this.typeMapper.mapToZodType(field)]),
    )
  }

  private getSwaggerType(field: FieldMetadata): string {
    switch (field.type) {
      case 'String':
        return 'String'
      case 'Int':
      case 'Float':
      case 'Decimal':
        return 'Number'
      case 'Boolean':
        return 'Boolean'
      case 'DateTime':
        return 'Date'
      case 'Json':
        return 'Object'
      default:
        if (field.kind === 'enum') {
          return field.type
        }
        return 'String'
    }
  }
}

// Run the generator if called directly
if (require.main === module) {
  main()
}
