// tools/generators/dto/utils/type-mapper.ts
import type { FieldMetadata } from '../types'

/**
 * Maps Prisma types to TypeScript types
 */
export class TypeMapper {
  private readonly typeMap: Record<string, string> = {
    // Prisma scalar types
    'String': 'string',
    'string': 'string',
    'Boolean': 'boolean',
    'boolean': 'boolean',
    'Int': 'number',
    'Float': 'number',
    'number': 'number',
    'BigInt': 'bigint',
    'bigint': 'bigint',
    'Decimal': 'number',
    'decimal': 'number',
    'DateTime': 'Date',
    'Date': 'Date',
    'date': 'Date',
    'Json': 'Record<string, any>',
    'json': 'Record<string, any>',
    'Bytes': 'Buffer',
    'bytes': 'Buffer',

    // Special types
    'Record<string, any>': 'Record<string, any>',
    'unknown': 'unknown',
    'any': 'any',
  }

  /**
   * Maps a field to its TypeScript type, handling arrays and optional types
   */
  mapFieldType(field: FieldMetadata): string {
    let baseType = this.mapType(field.type)

    if (field.enum?.length) {
      baseType = field.enum.map((v) => `'${v}'`).join(' | ')
    }

    if (field.isArray) {
      baseType = `${baseType}[]`
    }

    return baseType
  }

  /**
   * Maps a Prisma type to a TypeScript type
   */
  mapType(type: string): string {
    // Try exact match first
    const mappedType = this.typeMap[type]
    if (mappedType) {
      return mappedType
    }

    // Try case-insensitive match
    const lowerType = type.toLowerCase()
    for (const [key, value] of Object.entries(this.typeMap)) {
      if (key.toLowerCase() === lowerType) {
        return value
      }
    }

    // Handle unknown types
    console.warn(`Unknown type: ${type}, defaulting to 'unknown'`)
    return 'unknown'
  }

  // ZOD TYPES

  private readonly zodTypeMap: Record<string, string> = {
    String: 'string',
    string: 'string',
    Boolean: 'boolean',
    boolean: 'boolean',
    Int: 'number',
    Float: 'number',
    number: 'number',
    BigInt: 'bigint',
    bigint: 'bigint',
    Decimal: 'number',
    decimal: 'number',
    DateTime: 'date',
    Date: 'date',
    date: 'date',
    Json: 'record(z.unknown())',
    json: 'record(z.unknown())',
    Bytes: 'instanceof(Buffer)',
    bytes: 'instanceof(Buffer)',
  }

  /**
   * Maps a field to its Zod type, handling arrays and optional types
   */
  mapToZodType(field: FieldMetadata): string {
    let baseType = this.getZodType(field.type)

    // Handle enums
    if (field.enum?.length) {
      baseType = `enum([${field.enum.map((v) => `'${v}'`).join(', ')}])`
    }

    // Handle arrays
    if (field.isArray) {
      baseType = `array(z.${baseType}())`
    }

    // Handle nullable/optional
    if (!field.isRequired) {
      baseType = `${baseType}.nullable()`
    }

    return baseType
  }

  /**
   * Maps a Prisma type to a Zod type
   */
  private getZodType(type: string): string {
    // Try exact match first
    const zodType = this.zodTypeMap[type]
    if (zodType) {
      return zodType
    }

    // Try case-insensitive match
    const lowerType = type.toLowerCase()
    for (const [key, value] of Object.entries(this.zodTypeMap)) {
      if (key.toLowerCase() === lowerType) {
        return value
      }
    }

    // Handle unknown types
    console.warn(`Unknown type for Zod mapping: ${type}, defaulting to 'any'`)
    return 'any()'
  }

  mapPrismaToZod(type: string): string {
    switch (type.toLowerCase()) {
      case 'string':
        return 'string'
      case 'boolean':
        return 'boolean'
      case 'int':
      case 'float':
      case 'decimal':
        return 'number'
      case 'datetime':
      case 'date':
        return 'date'
      case 'json':
        return 'record(z.unknown())'
      case 'bytes':
        return 'instanceof(Buffer)'
      case 'bigint':
        return 'bigint'
      default:
        console.warn(`Unknown type for Zod mapping: ${type}, defaulting to 'any'`)
        return 'any()'
    }
  }

  /**
   * Gets the Swagger type for a field
   */
  getSwaggerType(field: FieldMetadata): string {
    const type = this.mapType(field.type)
    switch (type) {
      case 'string':
        return 'String'
      case 'number':
        return 'Number'
      case 'boolean':
        return 'Boolean'
      case 'Date':
        return 'Date'
      case 'Record<string, any>':
        return 'Object'
      case 'Buffer':
        return 'String'
      default:
        return 'String'
    }
  }
}
