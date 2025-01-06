// tools/generators/dto/utils/type-mapper.ts

/**
 * Maps Prisma types to TypeScript types
 */
export class TypeMapper {
  private readonly typeMap: Record<string, string> = {
    // Prisma scalar types
    'String': 'string',
    'Boolean': 'boolean',
    'Int': 'number',
    'BigInt': 'bigint',
    'Float': 'number',
    'Decimal': 'number',
    'DateTime': 'Date',
    'Json': 'Record<string, any>',
    'Bytes': 'Buffer',

    // Special types
    'Record<string, any>': 'Record<string, any>',
    'Date': 'Date',
    'unknown': 'unknown',
    'any': 'any',
  }

  /**
   * Maps a Prisma type to a TypeScript type
   */
  mapType(type: string): string {
    const mappedType = this.typeMap[type]
    if (!mappedType) {
      console.warn(`No explicit mapping found for type: ${type}. Defaulting to 'unknown'`)
      return 'unknown'
    }
    return mappedType
  }

  /**
   * Maps a Prisma type to a Zod type
   */
  mapToZodType(type: string): string {
    switch (type) {
      case 'String':
        return 'string'
      case 'Boolean':
        return 'boolean'
      case 'Int':
      case 'Float':
      case 'Decimal':
        return 'number'
      case 'BigInt':
        return 'bigint'
      case 'DateTime':
        return 'date'
      case 'Json':
        return 'record'
      case 'Bytes':
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
