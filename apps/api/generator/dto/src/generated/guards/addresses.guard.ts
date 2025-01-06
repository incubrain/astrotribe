
import { Iaddresses } from './interfaces'
import { addressesSchema } from './schemas'

/**
 * Type guard for addresses
 * Ensures that an unknown value matches the expected structure
 */
export function isaddresses(value: unknown): value is Iaddresses {
  return addressesSchema.safeParse(value).success
}

/**
 * Specialized type guards for checking partial data
 */

      export function isPartialaddresses(value: unknown): value is Partial<Iaddresses> {
        if (typeof value !== 'object' || value === null) return false;

        const knownKeys = ["id","street1","street2","city_id","country_id","name","user_id","is_primary","address_type","created_at","updated_at","company_id","cities","countries","companies","user_profiles"];
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
    case 'street1':
      return typeof value === "string";
    case 'street2':
      return typeof value === "string";
    case 'city_id':
      return typeof value === "number" && !isNaN(value);
    case 'country_id':
      return typeof value === "number" && !isNaN(value);
    case 'name':
      return typeof value === "string";
    case 'user_id':
      return typeof value === "string";
    case 'is_primary':
      return typeof value === "boolean";
    case 'address_type':
      return true; // Complex type requiring deeper validation
    case 'created_at':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case 'updated_at':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case 'company_id':
      return typeof value === "string";
    case 'cities':
      return true; // Complex type requiring deeper validation
    case 'countries':
      return true; // Complex type requiring deeper validation
    case 'companies':
      return true; // Complex type requiring deeper validation
    case 'user_profiles':
      return true; // Complex type requiring deeper validation
        }
        return false;
      }
      

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of addresses
 */
export function isaddressesArray(value: unknown): value is Iaddresses[] {
  return Array.isArray(value) && value.every(isaddresses)
}

/**
 * Type guard for partial arrays of addresses
 */
export function isPartialaddressesArray(value: unknown): value is Partial<Iaddresses>[] {
  return Array.isArray(value) && value.every(isPartialaddresses)
}

