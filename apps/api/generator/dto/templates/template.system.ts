// tools/generators/dto/templates/template.system.ts

import type { ModelMetadata, FieldMetadata, NestedTypeMetadata } from '../types'
import { TemplateEngine } from './template.engine'

/**
 * Enhanced template system that provides a flexible and extensible way to generate
 * different types of DTOs and related classes. This system supports inheritance,
 * custom decorators, and specialized NestJS features.
 */
export class TemplateSystem {
  /**
   * Maintains a registry of custom decorators that can be applied to
   * DTOs and their properties. This allows for easy extension of the
   * template system with new decorators.
   */
  private static customDecorators: Map<string, DecoratorDefinition> = new Map()

  /**
   * Registers a custom decorator for use in templates. This allows users
   * to extend the system with their own decorators while maintaining
   * type safety and documentation.
   */
  static registerDecorator(name: string, definition: DecoratorDefinition): void {
    this.customDecorators.set(name, definition)
  }

  /**
   * Generates a complete DTO class with all necessary imports, decorators,
   * and class members. This is the main entry point for template generation.
   */
  static generateDTO(model: ModelMetadata, options: DTOGenerationOptions): string {
    // Use template engine directly
    const context = {
      model,
      options,
      imports: this.generateImports(model, options),
      classDecorators: this.generateClassDecorators(model, options),
      methods: this.generateMethods(model, options),
    }

    return TemplateEngine.process(options.isView ? 'dto/view.dto' : 'dto/model.dto', context)
  }

  /**
   * Generates imports based on the features being used in the DTO.
   * This includes framework imports, custom decorators, and base classes.
   */
  private static generateImports(model: ModelMetadata, options: DTOGenerationOptions): string {
    const imports = new Set<string>()

    // Add base NestJS imports
    imports.add(`import { ApiProperty } from '@nestjs/swagger'`)

    // Add validation imports if needed
    if (options.useValidation) {
      imports.add(`import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator'`)
    }

    // Add transformation imports if needed
    if (options.useTransformation) {
      imports.add(`import { Transform } from 'class-transformer'`)
    }

    // Add inheritance-related imports
    if (options.extends) {
      imports.add(`import { ${options.extends} } from '../base'`)
    }

    // Add custom decorator imports
    this.customDecorators.forEach((decorator) => {
      if (decorator.importStatement) {
        imports.add(decorator.importStatement)
      }
    })

    return Array.from(imports).join('\n')
  }

  /**
   * Generates class-level decorators including custom decorators,
   * API documentation, and validation rules.
   */
  private static generateClassDecorators(
    model: ModelMetadata,
    options: DTOGenerationOptions,
  ): string {
    const decorators = []

    // Add API documentation decorators
    decorators.push(`@ApiTags('${model.name}')`)

    // Add response type decorators for controllers
    if (options.isResponse) {
      decorators.push(this.generateResponseDecorators(model))
    }

    // Add custom class-level decorators
    model.decorators?.forEach((decorator) => {
      const customDecorator = this.customDecorators.get(decorator.name)
      if (customDecorator) {
        decorators.push(customDecorator.generate(decorator.params))
      }
    })

    return decorators.join('\n')
  }

  /**
   * Generates response type decorators for OpenAPI documentation.
   * This method creates decorators that describe the structure and
   * possible status codes of API responses.
   */
  private static generateResponseDecorators(model: ModelMetadata): string {
    const decorators = [
      `@ApiResponse({
        status: 200,
        description: 'Successful response',
        type: ${model.name}DTO
      })`,
      `@ApiResponse({
        status: 400,
        description: 'Bad request - validation error'
      })`,
      `@ApiResponse({
        status: 401,
        description: 'Unauthorized - authentication required'
      })`,
    ]

    // Add specific error responses if defined in model metadata
    if (model.errorResponses) {
      model.errorResponses.forEach((error) => {
        decorators.push(`@ApiResponse({
          status: ${error.status},
          description: '${error.description}'
        })`)
      })
    }

    return decorators.join('\n')
  }

  /**
   * Generates class methods based on the DTO type and options.
   * This includes transformation methods, validation methods,
   * and any custom business logic methods.
   */
  private static generateMethods(model: ModelMetadata, options: DTOGenerationOptions): string {
    const methods = []

    // Add toEntity transformation method
    if (options.useTransformation) {
      methods.push(`
  /**
   * Transforms this DTO to its corresponding entity
   */
  toEntity(): Record<string, any> {
    return {
      ${model.fields.map((field) => `${field.name}: this.${field.name}`).join(',\n      ')}
    }
  }`)
    }

    // Add validation method if needed
    if (options.useValidation) {
      methods.push(`
  /**
   * Validates this DTO instance
   */
  async validate(): Promise<ValidationError[]> {
    return validate(this)
  }`)
    }

    // Add custom business logic methods from metadata
    if (model.methods) {
      model.methods.forEach((method) => {
        methods.push(
          TemplateEngine.process(method.template, {
            methodName: method.name,
            params: method.parameters,
            returnType: method.returnType,
            body: method.body,
          }),
        )
      })
    }

    return methods.join('\n\n')
  }

  /**
   * Generates property decorators for a field including validation,
   * transformation, and documentation decorators.
   */
  private static generatePropertyDecorators(
    field: FieldMetadata,
    options: DTOGenerationOptions,
  ): string {
    const decorators = []

    // Add API documentation decorator
    decorators.push(this.generateApiPropertyDecorator(field))

    // Add validation decorators if enabled
    if (options.useValidation) {
      decorators.push(...this.generateValidationDecorators(field))
    }

    // Add transformation decorators if enabled
    if (options.useTransformation) {
      decorators.push(...this.generateTransformationDecorators(field))
    }

    // Add custom decorators from field metadata
    field.decorators?.forEach((decorator) => {
      const customDecorator = this.customDecorators.get(decorator.name)
      if (customDecorator) {
        decorators.push(customDecorator.generate(decorator.params))
      }
    })

    return decorators.join('\n  ')
  }

  /**
   * Generates the TypeScript type definition for a field,
   * handling arrays, nested types, and generics.
   */
  private static generateTypeDefinition(field: FieldMetadata): string {
    let type = field.type

    // Handle array types
    if (field.isArray) {
      type = `${type}[]`
    }

    // Handle generic types
    if (field.genericParams) {
      type = `${type}<${field.genericParams.join(', ')}>`
    }

    // Handle nested types
    if (field.nestedType) {
      type = this.generateNestedTypeDefinition(field.nestedType)
    }

    return type
  }

  /**
   * Helper method to generate API property decorator with complete metadata.
   */
  private static generateApiPropertyDecorator(field: FieldMetadata): string {
    const options = {
      description: field.documentation.description,
      required: field.isRequired,
      type: () => field.type,
      isArray: field.isArray,
      example: field.documentation.example,
    }

    return `@ApiProperty(${JSON.stringify(options, null, 2)})`
  }

  /**
   * Helper method to generate validation decorators for a field.
   */
  private static generateValidationDecorators(field: FieldMetadata): string[] {
    const decorators = []

    if (field.isRequired) {
      decorators.push('@IsNotEmpty()')
    } else {
      decorators.push('@IsOptional()')
    }

    // Add type-specific validation
    switch (field.type) {
      case 'string':
        decorators.push('@IsString()')
        break
      case 'number':
        decorators.push('@IsNumber()')
        break
      case 'boolean':
        decorators.push('@IsBoolean()')
        break
      // Add more type validations as needed
    }

    return decorators
  }

  /**
   * Helper method to generate transformation decorators for a field.
   */
  private static generateTransformationDecorators(field: FieldMetadata): string[] {
    const decorators = []

    if (field.transformationRules) {
      field.transformationRules.forEach((rule) => {
        decorators.push(`@Transform(${rule.transformer})`)
      })
    }

    return decorators
  }

  /**
   * Generates type definitions for nested types within our DTOs.
   * This method handles complex object structures, allowing us to properly
   * represent nested data in our TypeScript types.
   */
  private static generateNestedTypeDefinition(nestedType: NestedTypeMetadata): string {
    // If it's a simple nested type, just return its name
    if (typeof nestedType === 'string') {
      return nestedType
    }

    // For object types, generate an inline interface
    if (nestedType.type === 'object') {
      const properties = nestedType.properties.map((prop) => {
        const type = this.generateTypeDefinition(prop)
        return `${prop.name}${prop.isRequired ? '' : '?'}: ${type}`
      })

      return `{
        ${properties.join(';\n        ')}
      }`
    }

    // For enums, generate a union type
    if (nestedType.type === 'enum') {
      return nestedType.values.map((value) => `'${value}'`).join(' | ')
    }

    // For nested arrays, recursively generate the item type
    if (nestedType.type === 'array') {
      const itemType = this.generateTypeDefinition(nestedType.itemType)
      return `${itemType}[]`
    }

    // Default to any if we can't determine the type
    return 'any'
  }

  /**
   * Generates the class definition including inheritance if specified.
   * This supports both single and multiple inheritance through mixins.
   */
  private static generateClassDefinition(
    model: ModelMetadata,
    options: DTOGenerationOptions,
  ): string {
    let definition = `export class ${model.name}DTO`

    // Handle inheritance
    if (options.extends) {
      definition += ` extends ${options.extends}`
    }

    // Handle mixins if any
    if (options.mixins?.length) {
      const mixinChain = options.mixins.join(', ')
      definition += ` implements ${mixinChain}`
    }

    return definition
  }

  /**
   * Generates the complete class body including properties, methods,
   * and any additional features required by the DTO type.
   */
  private static generateClassBody(model: ModelMetadata, options: DTOGenerationOptions): string {
    const properties = this.generateProperties(model.fields, options)
    const methods = this.generateMethods(model, options)
    const pipes = options.usePipes ? this.generatePipes(model) : ''

    return `{
  ${properties}

  ${methods}

  ${pipes}
}`
  }

  /**
   * Generates property declarations with appropriate decorators
   * for validation, transformation, and documentation.
   */
  private static generateProperties(
    fields: FieldMetadata[],
    options: DTOGenerationOptions,
  ): string {
    return fields
      .map((field) => {
        const decorators = this.generatePropertyDecorators(field, options)
        const typeDefinition = this.generateTypeDefinition(field)

        return `${decorators}
  ${field.name}${field.isRequired ? '' : '?'}: ${typeDefinition}`
      })
      .join('\n\n')
  }

  /**
   * Generates NestJS pipes for request validation and transformation.
   * These pipes can be used in controllers to automatically validate
   * and transform incoming requests.
   */
  private static generatePipes(model: ModelMetadata): string {
    return `
  /**
   * Creates a validation pipe for this DTO
   */
  static createValidationPipe(): ValidationPipe {
    return new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  }

  /**
   * Creates a transformation pipe for this DTO
   */
  static createTransformationPipe(): ParseDTO<${model.name}DTO> {
    return new ParseDTO(${model.name}DTO)
  }`
  }
}

/**
 * Options for customizing DTO generation including feature flags
 * and inheritance configuration.
 */
interface DTOGenerationOptions {
  useValidation: boolean
  useTransformation: boolean
  usePipes: boolean
  isRequest: boolean
  isResponse: boolean
  extends?: string
  mixins?: string[]
}

/**
 * Definition of a custom decorator including its import statement
 * and generation logic.
 */
interface DecoratorDefinition {
  importStatement?: string
  generate: (params?: any[]) => string
}
