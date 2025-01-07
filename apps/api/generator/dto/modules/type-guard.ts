// tools/generators/dto/modules/type-guards.ts
import { ModelMetadata, FieldMetadata } from '../types'
import { TypeMapper } from '../utils/type-mapper'

/**
 * TypeGuardGenerator creates TypeScript type guards that provide
 * runtime type checking with full type inference.
 */
export class TypeGuardGenerator {
  private typeMapper: TypeMapper

  constructor() {
    this.typeMapper = new TypeMapper()
  }

  /**
   * Generates type guard functions for a model that can be used
   * to verify types at runtime.
   */
  generateTypeGuards(model: ModelMetadata): string {
    const guardContent = `
import { I${model.name} } from './interfaces'
import { ${model.name}Schema } from './schemas'

/**
 * Type guard for ${model.name}
 * Ensures that an unknown value matches the expected structure
 */
export function is${model.name}(value: unknown): value is I${model.name} {
  return ${model.name}Schema.safeParse(value).success
}

/**
 * Specialized type guards for checking partial data
 */
${this.generatePartialTypeGuards(model)}

/**
 * Type guard utilities for arrays and relationships
 */
${this.generateCollectionTypeGuards(model)}
`
    return guardContent
  }

  /**
   * Generates type guards for checking partial objects that may
   * only include some fields of the model.
   */
  private generatePartialTypeGuards(model: ModelMetadata): string {
    return `
      export function isPartial${model.name}(value: unknown): value is Partial<I${model.name}> {
        if (typeof value !== 'object' || value === null) return false;

        const knownKeys = ${JSON.stringify(model.fields.map((f) => f.name))};
        return Object.keys(value).every(key => 
          knownKeys.includes(key) && isValidField(key, value[key as keyof typeof value])
        );
      }

      /**
       * Validates individual fields based on their expected types.
       */
      function isValidField(key: string, value: unknown): boolean {
        switch (key) {
      ${this.generateFieldValidations(model.fields)}
        }
        return false;
      }
      `
  }

  /**
   * Generates type guards for handling arrays and related objects.
   */
  private generateCollectionTypeGuards(model: ModelMetadata): string {
    return `
/**
 * Type guard for arrays of ${model.name}
 */
export function is${model.name}Array(value: unknown): value is I${model.name}[] {
  return Array.isArray(value) && value.every(is${model.name})
}

/**
 * Type guard for partial arrays of ${model.name}
 */
export function isPartial${model.name}Array(value: unknown): value is Partial<I${model.name}>[] {
  return Array.isArray(value) && value.every(isPartial${model.name})
}
`
  }

  /**
   * Generates individual field validation logic based on field types.
   */
  private generateFieldValidations(fields: FieldMetadata[]): string {
    return fields
      .map(
        (field) => `    case '${field.name}':
      ${this.generateFieldTypeCheck(field)}`,
      )
      .join('\n')
  }

  /**
   * Generates type-specific validation logic for a field.
   */
  private generateFieldTypeCheck(field: FieldMetadata): string {
    const type = this.typeMapper.mapPrismaToTypeScript(field)

    switch (type) {
      case 'string':
        return 'return typeof value === "string";'
      case 'number':
        return 'return typeof value === "number" && !isNaN(value);'
      case 'boolean':
        return 'return typeof value === "boolean";'
      case 'Date':
        return 'return value instanceof Date || !isNaN(Date.parse(String(value)));'
      default:
        return 'return true; // Complex type requiring deeper validation'
    }
  }
}
