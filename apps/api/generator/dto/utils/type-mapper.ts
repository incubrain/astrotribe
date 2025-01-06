// tools/generators/dto/utils/type-mapper.ts

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

    console.warn(`No explicit mapping found for type: ${type}. Defaulting to 'unknown'`)
    return 'unknown'
  }

  /**
   * Maps a Prisma field to a TypeScript type
   */
  mapPrismaToTypeScript(field: { type: string; isList: boolean; kind?: string }): string {
    let baseType = this.mapType(field.type)

    // Handle enums
    if (field.kind === 'enum') {
      baseType = field.type
    }

    // Handle arrays
    if (field.isList) {
      baseType = `${baseType}[]`
    }

    return baseType
  }

  /**
   * Maps a Prisma type to a Zod type
   */
  mapToZodType(type: string): string {
    switch (type.toLowerCase()) {
      case 'string':
        return 'string'
      case 'boolean':
        return 'boolean'
      case 'int':
      case 'float':
      case 'decimal':
      case 'number':
        return 'number'
      case 'bigint':
        return 'bigint'
      case 'datetime':
      case 'date':
        return 'date'
      case 'json':
        return 'record'
      case 'bytes':
        return 'instanceof(Buffer)'
      default:
        console.warn(`No explicit Zod mapping found for type: ${type}. Defaulting to 'any'`)
        return 'any'
    }
  }

  /**
   * Registers a custom type mapping
   */
  registerType(prismaType: string, tsType: string): void {
    this.typeMap[prismaType] = tsType
  }
}
