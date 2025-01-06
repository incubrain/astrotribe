
import { Icompany_contacts } from './interfaces'
import { company_contactsSchema } from './schemas'

/**
 * Type guard for company_contacts
 * Ensures that an unknown value matches the expected structure
 */
export function iscompany_contacts(value: unknown): value is Icompany_contacts {
  return company_contactsSchema.safeParse(value).success
}

/**
 * Specialized type guards for checking partial data
 */

      export function isPartialcompany_contacts(value: unknown): value is Partial<Icompany_contacts> {
        if (typeof value !== 'object' || value === null) return false;

        const knownKeys = ["id","contact_id","created_at","updated_at","company_id","companies","contacts"];
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
    case 'contact_id':
      return typeof value === "number" && !isNaN(value);
    case 'created_at':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case 'updated_at':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case 'company_id':
      return typeof value === "string";
    case 'companies':
      return true; // Complex type requiring deeper validation
    case 'contacts':
      return true; // Complex type requiring deeper validation
        }
        return false;
      }
      

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of company_contacts
 */
export function iscompany_contactsArray(value: unknown): value is Icompany_contacts[] {
  return Array.isArray(value) && value.every(iscompany_contacts)
}

/**
 * Type guard for partial arrays of company_contacts
 */
export function isPartialcompany_contactsArray(value: unknown): value is Partial<Icompany_contacts>[] {
  return Array.isArray(value) && value.every(isPartialcompany_contacts)
}

