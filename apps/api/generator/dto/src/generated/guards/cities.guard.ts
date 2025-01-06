
import { Icities } from './interfaces'
import { citiesSchema } from './schemas'

/**
 * Type guard for cities
 * Ensures that an unknown value matches the expected structure
 */
export function iscities(value: unknown): value is Icities {
  return citiesSchema.safeParse(value).success
}

/**
 * Specialized type guards for checking partial data
 */

      export function isPartialcities(value: unknown): value is Partial<Icities> {
        if (typeof value !== 'object' || value === null) return false;

        const knownKeys = ["id","name","country_id","state","addresses","countries"];
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
    case 'country_id':
      return typeof value === "number" && !isNaN(value);
    case 'state':
      return typeof value === "string";
    case 'addresses':
      return true; // Complex type requiring deeper validation
    case 'countries':
      return true; // Complex type requiring deeper validation
        }
        return false;
      }
      

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of cities
 */
export function iscitiesArray(value: unknown): value is Icities[] {
  return Array.isArray(value) && value.every(iscities)
}

/**
 * Type guard for partial arrays of cities
 */
export function isPartialcitiesArray(value: unknown): value is Partial<Icities>[] {
  return Array.isArray(value) && value.every(isPartialcities)
}

