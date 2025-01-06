
import { Icountries } from './interfaces'
import { countriesSchema } from './schemas'

/**
 * Type guard for countries
 * Ensures that an unknown value matches the expected structure
 */
export function iscountries(value: unknown): value is Icountries {
  return countriesSchema.safeParse(value).success
}

/**
 * Specialized type guards for checking partial data
 */

      export function isPartialcountries(value: unknown): value is Partial<Icountries> {
        if (typeof value !== 'object' || value === null) return false;

        const knownKeys = ["id","name","code","code_3","addresses","cities"];
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
    case 'code':
      return typeof value === "string";
    case 'code_3':
      return typeof value === "string";
    case 'addresses':
      return true; // Complex type requiring deeper validation
    case 'cities':
      return true; // Complex type requiring deeper validation
        }
        return false;
      }
      

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of countries
 */
export function iscountriesArray(value: unknown): value is Icountries[] {
  return Array.isArray(value) && value.every(iscountries)
}

/**
 * Type guard for partial arrays of countries
 */
export function isPartialcountriesArray(value: unknown): value is Partial<Icountries>[] {
  return Array.isArray(value) && value.every(isPartialcountries)
}

