// tools/generators/dto/utils/field-parser.ts

import { DMMF } from '@prisma/generator-helper'
import type { DocumentationMetadata, FieldMetadata, ValidationRule } from '../types'

interface ConstraintInfo {
  type: string
  definition: string
  table: string
  columns: string[]
}

/**
 * Enhanced FieldParser that handles detailed PostgreSQL metadata,
 * infers validation rules from database constraints, and manages
 * computed fields.
 */
export class FieldParser {
  constructor() {}

  /**
   * Creates the base metadata for a field from DMMF
   */
  async parseField(field: DMMF.Field): Promise<FieldMetadata> {
    // Create basic field metadata
    return {
      name: field.name,
      type: this.mapPrismaType(field.type),
      isRequired: field.isRequired,
      isArray: field.isList,
      documentation: this.parseDocumentation(field),
      validationRules: this.getBasicValidationRules(field),
      transformationRules: [],
      isComputed: false,
    }
  }

  /**
   * Maps Prisma types to TypeScript types
   */
  private mapPrismaType(type: string): string {
    const typeMap: Record<string, string> = {
      String: 'string',
      Boolean: 'boolean',
      Int: 'number',
      BigInt: 'bigint',
      Float: 'number',
      Decimal: 'number',
      DateTime: 'Date',
      Json: 'Record<string, any>',
      Bytes: 'Buffer',
    }

    return typeMap[type] || 'any'
  }

  /**
   * Extracts documentation from field
   */
  private parseDocumentation(field: DMMF.Field): DocumentationMetadata {
    const docs = field.documentation || ''

    return {
      description: this.extractDescription(docs),
      example: undefined,
      deprecated: false,
      version: undefined,
    }
  }

  /**
   * Extracts description from documentation string
   */
  private extractDescription(docs: string): string {
    return docs
      .replace(/@\w+(\([^)]*\))?/g, '') // Remove all @directives
      .trim()
  }

  /**
   * Gets basic validation rules based on field properties
   */
  private getBasicValidationRules(field: DMMF.Field): ValidationRule[] {
    const rules: ValidationRule[] = []

    // Add required validation if field is not optional
    if (field.isRequired) {
      rules.push({
        decorator: 'IsNotEmpty',
        message: `${field.name} is required`,
      })
    }

    // Add type-specific validation
    switch (field.type) {
      case 'String':
        rules.push({
          decorator: 'IsString',
          message: `${field.name} must be a string`,
        })
        break
      case 'Int':
      case 'Float':
      case 'Decimal':
        rules.push({
          decorator: 'IsNumber',
          params: [{ allowNaN: false, allowInfinity: false }],
          message: `${field.name} must be a number`,
        })
        break
      case 'Boolean':
        rules.push({
          decorator: 'IsBoolean',
          message: `${field.name} must be a boolean`,
        })
        break
      case 'DateTime':
        rules.push({
          decorator: 'IsDate',
          message: `${field.name} must be a valid date`,
        })
        break
    }

    return rules
  }
}
