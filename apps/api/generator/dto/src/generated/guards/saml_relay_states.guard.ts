
import { Isaml_relay_states } from './interfaces'
import { saml_relay_statesSchema } from './schemas'

/**
 * Type guard for saml_relay_states
 * Ensures that an unknown value matches the expected structure
 */
export function issaml_relay_states(value: unknown): value is Isaml_relay_states {
  return saml_relay_statesSchema.safeParse(value).success
}

/**
 * Specialized type guards for checking partial data
 */

      export function isPartialsaml_relay_states(value: unknown): value is Partial<Isaml_relay_states> {
        if (typeof value !== 'object' || value === null) return false;

        const knownKeys = ["id","sso_provider_id","request_id","for_email","redirect_to","created_at","updated_at","flow_state_id","flow_state","sso_providers"];
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
    case 'request_id':
      return typeof value === "string";
    case 'for_email':
      return typeof value === "string";
    case 'redirect_to':
      return typeof value === "string";
    case 'created_at':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case 'updated_at':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case 'flow_state_id':
      return typeof value === "string";
    case 'flow_state':
      return true; // Complex type requiring deeper validation
    case 'sso_providers':
      return true; // Complex type requiring deeper validation
        }
        return false;
      }
      

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of saml_relay_states
 */
export function issaml_relay_statesArray(value: unknown): value is Isaml_relay_states[] {
  return Array.isArray(value) && value.every(issaml_relay_states)
}

/**
 * Type guard for partial arrays of saml_relay_states
 */
export function isPartialsaml_relay_statesArray(value: unknown): value is Partial<Isaml_relay_states>[] {
  return Array.isArray(value) && value.every(isPartialsaml_relay_states)
}

