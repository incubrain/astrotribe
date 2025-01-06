
import { Iblocked_ips } from './interfaces'
import { blocked_ipsSchema } from './schemas'

/**
 * Type guard for blocked_ips
 * Ensures that an unknown value matches the expected structure
 */
export function isblocked_ips(value: unknown): value is Iblocked_ips {
  return blocked_ipsSchema.safeParse(value).success
}

/**
 * Specialized type guards for checking partial data
 */

      export function isPartialblocked_ips(value: unknown): value is Partial<Iblocked_ips> {
        if (typeof value !== 'object' || value === null) return false;

        const knownKeys = ["id","ip_address","blocked_at","blocked_until","failed_attempts","reason","created_at","updated_at"];
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
    case 'ip_address':
      return typeof value === "string";
    case 'blocked_at':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case 'blocked_until':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case 'failed_attempts':
      return typeof value === "number" && !isNaN(value);
    case 'reason':
      return typeof value === "string";
    case 'created_at':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case 'updated_at':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
        }
        return false;
      }
      

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of blocked_ips
 */
export function isblocked_ipsArray(value: unknown): value is Iblocked_ips[] {
  return Array.isArray(value) && value.every(isblocked_ips)
}

/**
 * Type guard for partial arrays of blocked_ips
 */
export function isPartialblocked_ipsArray(value: unknown): value is Partial<Iblocked_ips>[] {
  return Array.isArray(value) && value.every(isPartialblocked_ips)
}

