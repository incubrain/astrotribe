
import { Iad_packages } from './interfaces'
import { ad_packagesSchema } from './schemas'

/**
 * Type guard for ad_packages
 * Ensures that an unknown value matches the expected structure
 */
export function isad_packages(value: unknown): value is Iad_packages {
  return ad_packagesSchema.safeParse(value).success
}

/**
 * Specialized type guards for checking partial data
 */

      export function isPartialad_packages(value: unknown): value is Partial<Iad_packages> {
        if (typeof value !== 'object' || value === null) return false;

        const knownKeys = ["id","name","position","active","created_at","updated_at","description","price","features","expected_ctr","avg_roi","view_frequency","ads"];
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
      return typeof value === "string";
    case 'name':
      return typeof value === "string";
    case 'position':
      return typeof value === "string";
    case 'active':
      return typeof value === "boolean";
    case 'created_at':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case 'updated_at':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case 'description':
      return typeof value === "string";
    case 'price':
      return typeof value === "number" && !isNaN(value);
    case 'features':
      return typeof value === "string";
    case 'expected_ctr':
      return typeof value === "number" && !isNaN(value);
    case 'avg_roi':
      return typeof value === "number" && !isNaN(value);
    case 'view_frequency':
      return typeof value === "number" && !isNaN(value);
    case 'ads':
      return true; // Complex type requiring deeper validation
        }
        return false;
      }
      

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of ad_packages
 */
export function isad_packagesArray(value: unknown): value is Iad_packages[] {
  return Array.isArray(value) && value.every(isad_packages)
}

/**
 * Type guard for partial arrays of ad_packages
 */
export function isPartialad_packagesArray(value: unknown): value is Partial<Iad_packages>[] {
  return Array.isArray(value) && value.every(isPartialad_packages)
}

