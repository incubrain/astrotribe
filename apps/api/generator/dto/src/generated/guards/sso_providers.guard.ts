
import { Isso_providers } from './interfaces'
import { sso_providersSchema } from './schemas'

/**
 * Type guard for sso_providers
 * Ensures that an unknown value matches the expected structure
 */
export function issso_providers(value: unknown): value is Isso_providers {
  return sso_providersSchema.safeParse(value).success
}

/**
 * Specialized type guards for checking partial data
 */

      export function isPartialsso_providers(value: unknown): value is Partial<Isso_providers> {
        if (typeof value !== 'object' || value === null) return false;

        const knownKeys = ["id","resource_id","created_at","updated_at","saml_providers","saml_relay_states","sso_domains"];
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
    case 'resource_id':
      return typeof value === "string";
    case 'created_at':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case 'updated_at':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case 'saml_providers':
      return true; // Complex type requiring deeper validation
    case 'saml_relay_states':
      return true; // Complex type requiring deeper validation
    case 'sso_domains':
      return true; // Complex type requiring deeper validation
        }
        return false;
      }
      

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of sso_providers
 */
export function issso_providersArray(value: unknown): value is Isso_providers[] {
  return Array.isArray(value) && value.every(issso_providers)
}

/**
 * Type guard for partial arrays of sso_providers
 */
export function isPartialsso_providersArray(value: unknown): value is Partial<Isso_providers>[] {
  return Array.isArray(value) && value.every(isPartialsso_providers)
}

