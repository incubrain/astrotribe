import { Icontacts } from "./interfaces";
import { contactsSchema } from "./schemas";

/**
 * Type guard for contacts
 * Ensures that an unknown value matches the expected structure
 */
export function iscontacts(value: unknown): value is Icontacts {
  return contactsSchema.safeParse(value).success;
}

/**
 * Specialized type guards for checking partial data
 */

export function isPartialcontacts(value: unknown): value is Partial<Icontacts> {
  if (typeof value !== "object" || value === null) return false;

  const knownKeys = [
    "id",
    "title",
    "is_primary",
    "email",
    "contact_type",
    "privacy_level",
    "user_id",
    "created_at",
    "updated_at",
    "phone",
    "company_id",
    "company_contacts",
    "companies",
    "user_profiles",
  ];
  return Object.keys(value).every(
    (key) =>
      knownKeys.includes(key) &&
      isValidField(key, value[key as keyof typeof value]),
  );
}

/**
 * Validates individual fields based on their expected types.
 */
function isValidField(key: string, value: unknown): boolean {
  switch (key) {
    case "id":
      return true; // Complex type requiring deeper validation
    case "title":
      return true; // Complex type requiring deeper validation
    case "is_primary":
      return typeof value === "boolean";
    case "email":
      return true; // Complex type requiring deeper validation
    case "contact_type":
      return true; // Complex type requiring deeper validation
    case "privacy_level":
      return true; // Complex type requiring deeper validation
    case "user_id":
      return true; // Complex type requiring deeper validation
    case "created_at":
      return true; // Complex type requiring deeper validation
    case "updated_at":
      return true; // Complex type requiring deeper validation
    case "phone":
      return true; // Complex type requiring deeper validation
    case "company_id":
      return true; // Complex type requiring deeper validation
    case "company_contacts":
      return true; // Complex type requiring deeper validation
    case "companies":
      return true; // Complex type requiring deeper validation
    case "user_profiles":
      return true; // Complex type requiring deeper validation
  }
  return false;
}

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of contacts
 */
export function iscontactsArray(value: unknown): value is Icontacts[] {
  return Array.isArray(value) && value.every(iscontacts);
}

/**
 * Type guard for partial arrays of contacts
 */
export function isPartialcontactsArray(
  value: unknown,
): value is Partial<Icontacts>[] {
  return Array.isArray(value) && value.every(isPartialcontacts);
}
