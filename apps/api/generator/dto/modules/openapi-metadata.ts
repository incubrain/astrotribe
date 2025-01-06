// tools/generators/dto/modules/openapi-metadata.ts

import { TypeMapper } from '../utils/type-mapper'
import type { ModelMetadata, FieldMetadata, ValidationRule } from '../types'

/**
 * OpenAPIMetadataGenerator handles the creation of comprehensive OpenAPI/Swagger
 * decorators and metadata. It ensures our DTOs are properly documented for API
 * consumers with complete type information, examples, and security schemes.
 */
export class OpenAPIMetadataGenerator {
  constructor(private readonly typeMapper: TypeMapper) {}

  /**
   * Generates all OpenAPI decorators for a DTO class. This includes class-level
   * decorators for response types and field-level decorators for properties.
   */
  generateOpenAPIMetadata(model: ModelMetadata): string {
    const imports = this.generateSwaggerImports()
    const classDecorators = this.generateClassDecorators(model)
    const propertyDecorators = this.generatePropertyDecorators(model.fields)

    return `
${imports}

${classDecorators}
export class ${model.name}DTO {
${propertyDecorators}
}
`
  }

  /**
   * Generates necessary imports for OpenAPI decorators. We import everything we
   * need from @nestjs/swagger to support our enhanced documentation.
   */
  private generateSwaggerImports(): string {
    return `
        import {
        ApiProperty,
        ApiPropertyOptional,
        ApiExtraModels,
        ApiResponse,
        ApiResponseType,
        ApiTags,
        getSchemaPath,
        ApiBasicAuth,
        ApiBearerAuth,
        ApiOAuth2,
        ApiCookieAuth
        } from '@nestjs/swagger';
        `
  }

  /**
   * Generates class-level OpenAPI decorators including response types,
   * authentication requirements, and tags for API grouping.
   */
  private generateClassDecorators(model: ModelMetadata): string {
    const { documentation } = model

    // Build array of class decorators
    const decorators = [
      `@ApiTags('${model.name}')`,
      this.generateAuthDecorators(model),
      this.generateResponseDecorators(model),
      this.generateExtraModelsDecorator(model),
    ].filter(Boolean)

    return decorators.join('\n')
  }

  /**
   * Generates @ApiProperty decorators for each field with comprehensive
   * metadata including type information, examples, and validation rules.
   */
  private generatePropertyDecorators(fields: FieldMetadata[]): string {
    return fields
      .map((field) => {
        const propertyDecorator = field.isRequired ? '@ApiProperty' : '@ApiPropertyOptional'
        const options = this.buildPropertyOptions(field)

        return `  ${propertyDecorator}(${options})
  ${field.name}${field.isRequired ? '' : '?'}: ${this.typeMapper.mapPrismaToTypeScript(field)};`
      })
      .join('\n\n')
  }

  /**
   * Builds comprehensive options for @ApiProperty decorators including
   * type information, examples, and nested schema references.
   */
  private buildPropertyOptions(field: FieldMetadata): string {
    const options: Record<string, any> = {
      description: field.documentation.description,
      type: OpenAPIMetadataGenerator.getSwaggerType(field),
      example: this.generateExample(field),
    }

    // Add validation rules metadata
    if (field.validationRules.length > 0) {
      options.minimum = this.extractMinimum(field.validationRules)
      options.maximum = this.extractMaximum(field.validationRules)
      options.minLength = this.extractMinLength(field.validationRules)
      options.maxLength = this.extractMaxLength(field.validationRules)
      options.pattern = this.extractPattern(field.validationRules)
    }

    // Add enum values if applicable
    if (field.type === 'enum') {
      options.enum = this.extractEnumValues(field)
    }

    // Add nested schema references if needed
    if (this.isComplexType(field)) {
      options.schema = this.generateNestedSchema(field)
    }

    return this.serializeOptions(options)
  }

  /**
   * Generates authentication decorators based on security schemes
   * defined in the model's metadata.
   */
  private generateAuthDecorators(model: ModelMetadata): string {
    const authDecorators: string[] = []
    const securitySchemes = this.extractSecuritySchemes(model)

    securitySchemes.forEach((scheme) => {
      switch (scheme.type) {
        case 'bearer':
          authDecorators.push('@ApiBearerAuth()')
          break
        case 'basic':
          authDecorators.push('@ApiBasicAuth()')
          break
        case 'oauth2':
          authDecorators.push(`@ApiOAuth2(${JSON.stringify(scheme.flows)})`)
          break
        case 'cookie':
          authDecorators.push(`@ApiCookieAuth('${scheme.name}')`)
          break
      }
    })

    return authDecorators.join('\n')
  }

  /**
   * Generates response decorators with proper type information and
   * status codes. Handles both success and error responses.
   */
  private generateResponseDecorators(model: ModelMetadata): string {
    const responseDecorators: string[] = []

    // Success response
    responseDecorators.push(`
        @ApiResponse({
        status: 200,
        description: 'Successful operation',
        type: ${model.name}DTO
        })`)

    // Error responses
    responseDecorators.push(`
        @ApiResponse({
        status: 400,
        description: 'Bad request - validation error'
        })
        @ApiResponse({
        status: 401,
        description: 'Unauthorized - authentication required'
    })`)

    return responseDecorators.join('\n')
  }

  /**
   * Generates discriminator mapping for inheritance relationships,
   * allowing proper type discrimination in polymorphic responses.
   */
  private generateExtraModelsDecorator(model: ModelMetadata): string {
    if (!model.relationships.length) return ''

    const relatedModels = model.relationships.map((rel) => rel.type).filter(Boolean)

    if (relatedModels.length === 0) return ''

    return `@ApiExtraModels(${relatedModels.join(', ')})`
  }

  /**
   * Extracts security schemes from model metadata to determine
   * which authentication decorators to generate.
   */
  private extractSecuritySchemes(model: ModelMetadata): any[] {
    const securityMatch = model.documentation.description.match(/@security\s+({[\s\S]+?})/)
    if (!securityMatch) return []

    try {
      return JSON.parse(securityMatch[1])
    } catch {
      console.warn(`Invalid security scheme definition in ${model.name}`)
      return []
    }
  }

  /**
   * Generates example values for OpenAPI documentation. Tries to create
   * realistic examples based on field type and validation rules.
   */
  private generateExample(field: FieldMetadata): any {
    // First check if there's an explicit example in the documentation
    if (field.documentation.example !== undefined) {
      return field.documentation.example
    }

    // Generate example based on type and validation rules
    switch (field.type) {
      case 'string':
        return this.generateStringExample(field)
      case 'number':
        return this.generateNumberExample(field)
      case 'boolean':
        return true
      case 'Date':
        return new Date().toISOString()
      default:
        return undefined
    }
  }

  // Helper methods for example generation...
  private generateStringExample(field: FieldMetadata): string {
    const validationRules = field.validationRules
    if (validationRules.some((rule) => rule.decorator === 'IsEmail')) {
      return 'user@example.com'
    }
    if (validationRules.some((rule) => rule.decorator === 'IsUUID')) {
      return '123e4567-e89b-12d3-a456-426614174000'
    }
    return 'example'
  }

  private generateNumberExample(field: FieldMetadata): number {
    const min = this.extractMinimum(field.validationRules) ?? 0
    const max = this.extractMaximum(field.validationRules) ?? 100
    return Math.floor((min + max) / 2)
  }

  /**
   * Extracts minimum value from validation rules if present.
   */
  private extractMinimum(rules: ValidationRule[]): number | undefined {
    const minRule = rules.find((rule) => rule.decorator === 'IsInt' || rule.decorator === 'Min')
    return minRule?.params?.[0]
  }

  /**
   * Extracts maximum value from validation rules if present.
   */
  private extractMaximum(rules: ValidationRule[]): number | undefined {
    const maxRule = rules.find((rule) => rule.decorator === 'Max')
    return maxRule?.params?.[0]
  }

  /**
   * Extracts minimum length value from validation rules if present.
   */
  private extractMinLength(rules: ValidationRule[]): number | undefined {
    const minLengthRule = rules.find((rule) => rule.decorator === 'MinLength')
    return minLengthRule?.params?.[0]
  }

  /**
   * Extracts maximum length value from validation rules if present.
   */
  private extractMaxLength(rules: ValidationRule[]): number | undefined {
    const maxLengthRule = rules.find((rule) => rule.decorator === 'MaxLength')
    return maxLengthRule?.params?.[0]
  }

  /**
   * Extracts pattern value from validation rules if present.
   */
  private extractPattern(rules: ValidationRule[]): string | undefined {
    const patternRule = rules.find((rule) => rule.decorator === 'Matches')
    return patternRule?.params?.[0]
  }

  /**
   * Extracts enum values from field metadata if applicable.
   */

  private extractEnumValues(field: FieldMetadata): string[] {
    return field.validationRules.find((rule) => rule.decorator === 'IsEnum')?.params || []
  }

  /**
   * Determines if a field is a complex type that requires a nested schema.
   */
  private isComplexType(field: FieldMetadata): boolean {
    return field.type === 'object' || field.type === 'array'
  }

  /**
   * Generates nested schema references for complex types.
   */
  private generateNestedSchema(field: FieldMetadata): string {
    if (field.type === 'object') {
      return `() => ${field.name}DTO`
    }

    if (field.type === 'array') {
      return `() => [${this.typeMapper.mapPrismaToTypeScript(field.itemType)}]`
    }

    return ''
  }

  /**
   * Serializes options object into a string for decorator usage.
   */
  private serializeOptions(options: Record<string, any>): string {
    return JSON.stringify(options, null, 2)
      .replace(/"([^"]+)":/g, '$1:')
      .replace(/"/g, '')
      .replace(/,/g, ', ')
  }

  /**
   * Determines the correct Swagger type for a field based on its metadata.
   */
  public static getSwaggerType(field: FieldMetadata): string {
    switch (field.type) {
      case 'string':
        return 'string'
      case 'number':
        return 'number'
      case 'boolean':
        return 'boolean'
      case 'Date':
        return 'string'
      case 'enum':
        return 'string'
      default:
        return 'object'
    }
  }
}
