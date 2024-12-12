// src/generators/nestjs/utils/type-mapper.ts
export interface PostgresTypeMap {
  type: string
  tsType: string
  validatorDecorators: string[]
  swaggerType: string
  format?: string
}

export const typeMapper: Record<string, PostgresTypeMap> = {
  'uuid': {
    type: 'uuid',
    tsType: 'string',
    validatorDecorators: ['@IsUUID()'],
    swaggerType: 'string',
    format: 'uuid',
  },

  // String types
  'varchar': {
    type: 'varchar',
    tsType: 'string',
    validatorDecorators: ['@IsString()', '@MaxLength(255)'],
    swaggerType: 'string',
  },
  'text': {
    type: 'text',
    tsType: 'string',
    validatorDecorators: ['@IsString()'],
    swaggerType: 'string',
  },
  // Number types
  'integer': {
    type: 'integer',
    tsType: 'number',
    validatorDecorators: ['@IsInt()'],
    swaggerType: 'integer',
  },
  // Boolean
  'boolean': {
    type: 'boolean',
    tsType: 'boolean',
    validatorDecorators: ['@IsBoolean()'],
    swaggerType: 'boolean',
  },
  // Date/Time
  'timestamp with time zone': {
    type: 'timestamp with time zone',
    tsType: 'Date',
    validatorDecorators: ['@IsDate()', '@Type(() => Date)'],
    swaggerType: 'string',
    format: 'date-time',
  },
  // JSON
  'jsonb': {
    type: 'jsonb',
    tsType: 'Record<string, any>',
    validatorDecorators: ['@IsObject()'],
    swaggerType: 'object',
  },
  // Enums
  'USER-DEFINED': {
    type: 'enum',
    tsType: 'string',
    validatorDecorators: ['@IsEnum($enumName)'],
    swaggerType: 'enum',
  },
}

// src/generators/nestjs/utils/naming.ts
export class NamingUtils {
  static toKebabCase(str: string): string {
    return str
      .replace(/_/g, '-')
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .toLowerCase()
  }

  static toPascalCase(str: string): string {
    return str
      .split(/[-_]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join('')
  }

  static toCamelCase(str: string): string {
    const pascal = this.toPascalCase(str)
    return pascal.charAt(0).toLowerCase() + pascal.slice(1)
  }

  static toPlural(str: string): string {
    // Add proper pluralization rules
    return str + 's'
  }

  static toSingular(str: string): string {
    // Add proper singularization rules
    return str.replace(/s$/, '')
  }

  static getBaseFileName(tableName: string): string {
    return this.toKebabCase(this.toSingular(tableName))
  }
}

export class PropertyGenerator {
  static generateValidationDecorators(
    column: ColumnDefinition,
    schema: TableSchema,
    isUpdate = false,
  ): string[] {
    const typeInfo = typeMapper[column.type] || typeMapper.varchar
    const decorators = [isUpdate || column.nullable ? '@IsOptional()' : '@IsNotEmpty()']

    if (column.type === 'USER-DEFINED') {
      const enumDef = schema.enums?.find((e) => e.name === column.name)
      if (enumDef) {
        const enumName = NamingUtils.toPascalCase(enumDef.name)
        decorators.push(`@IsEnum(${enumName}Enum)`)
      }
    } else {
      decorators.push(...typeInfo.validatorDecorators)
    }

    // Add any additional validation based on column properties
    if (column.isPrimary && !isUpdate) {
      decorators.push('@IsUUID()') // Assuming primary keys are UUIDs
    }

    if (column.isForeign) {
      decorators.push('@IsUUID()')
    }

    return decorators
  }

  static generateSwaggerProperty(
    column: ColumnDefinition,
    schema: TableSchema,
    isOptional = false,
  ): string {
    const props = []

    if (!isOptional && !column.nullable) {
      props.push('required: true')
    }

    if (column.type === 'USER-DEFINED') {
      const enumDef = schema.enums?.find((e) => e.name === column.name)
      if (enumDef) {
        const enumName = NamingUtils.toPascalCase(enumDef.name)
        props.push(`enum: ${enumName}Enum`)
        props.push(`enumName: '${enumName}'`)
        props.push(`description: 'Enum values: ${enumDef.values.join(', ')}'`)
      }
    } else {
      props.push(`description: '${this.getColumnDescription(column)}'`)
    }

    const typeInfo = typeMapper[column.type] || typeMapper.varchar
    if (typeInfo.format) {
      props.push(`format: '${typeInfo.format}'`)
    }

    if (column.isForeign) {
      props.push(`format: 'uuid'`)
      props.push(`description: '${this.getColumnDescription(column)}'`)
    }

    return `@ApiProperty({ ${props.join(', ')} })`
  }

  static getTypeScriptType(column: ColumnDefinition, schema: TableSchema): string {
    if (column.type === 'USER-DEFINED') {
      const enumDef = schema.enums?.find((e) => e.name === column.name)
      if (enumDef) {
        const enumName = NamingUtils.toPascalCase(enumDef.name)
        return `${enumName}Enum${column.nullable ? ' | null' : ''}`
      }
    }

    const typeInfo = typeMapper[column.type] || typeMapper.varchar
    return column.nullable ? `${typeInfo.tsType} | null` : typeInfo.tsType
  }

  static getColumnDescription(column: ColumnDefinition): string {
    if (column.isPrimary) return 'Primary key'
    if (column.isForeign) {
      return `References ${column.references?.table}.${column.references?.column}`
    }
    return `${column.type} field`
  }

  static generateDtoProperty(
    column: ColumnDefinition,
    schema: TableSchema,
    isUpdate = false,
  ): string {
    const decorators = this.generateValidationDecorators(column, schema, isUpdate)
    const swaggerDecorator = this.generateSwaggerProperty(column, schema, isUpdate)
    const type = this.getTypeScriptType(column, schema)

    return `
    ${decorators.join('\n  ')}
    ${swaggerDecorator}
    ${column.name}${isUpdate ? '?' : ''}: ${type};`
  }

  static generateEntityProperty(column: ColumnDefinition, schema: TableSchema): string {
    const swaggerDecorator = this.generateSwaggerProperty(column, schema)
    const type = this.getTypeScriptType(column, schema)

    return `
    ${swaggerDecorator}
    ${column.name}: ${type};`
  }
}

export class RelationshipUtils {
  static getRelationshipPropertyName(relationship: Relationship): string {
    const baseName = NamingUtils.toCamelCase(relationship.table)
    return relationship.type === 'oneToMany' ? NamingUtils.toPlural(baseName) : baseName
  }

  static generateRelationshipProperties(schema: TableSchema): string {
    if (!schema.relationships?.length) return ''

    return schema.relationships
      .map((rel) => {
        const propName = this.getRelationshipPropertyName(rel)
        const relatedClassName = NamingUtils.toPascalCase(NamingUtils.toSingular(rel.table))
        const isArray = rel.type === 'oneToMany'

        return `
    @ApiProperty({ 
      type: () => ${isArray ? `[${relatedClassName}Entity]` : `${relatedClassName}Entity`},
      description: '${rel.type} relationship with ${rel.table}'
    })
    ${propName}?: ${relatedClassName}Entity${isArray ? '[]' : ''};`
      })
      .join('\n')
  }
}
