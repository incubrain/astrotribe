
import { Isso_domains } from './interfaces'
import { sso_domainsSchema } from './schemas'

/**
 * Type guard for sso_domains
 * Ensures that an unknown value matches the expected structure
 */
export function issso_domains(value: unknown): value is Isso_domains {
  return sso_domainsSchema.safeParse(value).success
}

/**
 * Specialized type guards for checking partial data
 */

      export function isPartialsso_domains(value: unknown): value is Partial<Isso_domains> {
        if (typeof value !== 'object' || value === null) return false;

        const knownKeys = ["id","sso_provider_id","domain","created_at","updated_at","sso_providers"];
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
    case 'sso_provider_id':
      return typeof value === "string";
    case 'domain':
      return typeof value === "string";
    case 'created_at':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case 'updated_at':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case 'sso_providers':
      return true; // Complex type requiring deeper validation
        }
        return false;
      }
      

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of sso_domains
 */
export function issso_domainsArray(value: unknown): value is Isso_domains[] {
  return Array.isArray(value) && value.every(issso_domains)
}

/**
 * Type guard for partial arrays of sso_domains
 */
export function isPartialsso_domainsArray(value: unknown): value is Partial<Isso_domains>[] {
  return Array.isArray(value) && value.every(isPartialsso_domains)
}

