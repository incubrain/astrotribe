
import { Imetric_definitions } from './interfaces'
import { metric_definitionsSchema } from './schemas'

/**
 * Type guard for metric_definitions
 * Ensures that an unknown value matches the expected structure
 */
export function ismetric_definitions(value: unknown): value is Imetric_definitions {
  return metric_definitionsSchema.safeParse(value).success
}

/**
 * Specialized type guards for checking partial data
 */

      export function isPartialmetric_definitions(value: unknown): value is Partial<Imetric_definitions> {
        if (typeof value !== 'object' || value === null) return false;

        const knownKeys = ["id","name","description","category","type","unit","is_dimensional","company_metrics","spider_metrics"];
        return Object.keys(value).every(key => 
          knownKeys.includes(key) && isValidField(key, value[key as keyof typeof value])
        );
      }

      /**
       * Validates individual fields based on their expected types.
       */
      function isValidField(key: string, value: unknown): boolean {
        switch (key) {
          case 'id':
      return typeof value === "number" && !isNaN(value);
    case 'name':
      return typeof value === "string";
    case 'description':
      return typeof value === "string";
    case 'category':
      return typeof value === "string";
    case 'type':
      return typeof value === "string";
    case 'unit':
      return typeof value === "string";
    case 'is_dimensional':
      return typeof value === "boolean";
    case 'company_metrics':
      return true; // Complex type requiring deeper validation
    case 'spider_metrics':
      return true; // Complex type requiring deeper validation
        }
        return false;
      }
      

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of metric_definitions
 */
export function ismetric_definitionsArray(value: unknown): value is Imetric_definitions[] {
  return Array.isArray(value) && value.every(ismetric_definitions)
}

/**
 * Type guard for partial arrays of metric_definitions
 */
export function isPartialmetric_definitionsArray(value: unknown): value is Partial<Imetric_definitions>[] {
  return Array.isArray(value) && value.every(isPartialmetric_definitions)
}

