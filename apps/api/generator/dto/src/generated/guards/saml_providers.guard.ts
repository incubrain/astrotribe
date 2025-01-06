import { Isaml_providers } from "./interfaces";
import { saml_providersSchema } from "./schemas";

/**
 * Type guard for saml_providers
 * Ensures that an unknown value matches the expected structure
 */
export function issaml_providers(value: unknown): value is Isaml_providers {
  return saml_providersSchema.safeParse(value).success;
}

/**
 * Specialized type guards for checking partial data
 */

export function isPartialsaml_providers(
  value: unknown,
): value is Partial<Isaml_providers> {
  if (typeof value !== "object" || value === null) return false;

  const knownKeys = [
    "id",
    "sso_provider_id",
    "entity_id",
    "metadata_xml",
    "metadata_url",
    "attribute_mapping",
    "created_at",
    "updated_at",
    "name_id_format",
    "sso_providers",
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
    case "sso_provider_id":
      return true; // Complex type requiring deeper validation
    case "entity_id":
      return true; // Complex type requiring deeper validation
    case "metadata_xml":
      return true; // Complex type requiring deeper validation
    case "metadata_url":
      return true; // Complex type requiring deeper validation
    case "attribute_mapping":
      return true; // Complex type requiring deeper validation
    case "created_at":
      return true; // Complex type requiring deeper validation
    case "updated_at":
      return true; // Complex type requiring deeper validation
    case "name_id_format":
      return true; // Complex type requiring deeper validation
    case "sso_providers":
      return true; // Complex type requiring deeper validation
  }
  return false;
}

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of saml_providers
 */
export function issaml_providersArray(
  value: unknown,
): value is Isaml_providers[] {
  return Array.isArray(value) && value.every(issaml_providers);
}

/**
 * Type guard for partial arrays of saml_providers
 */
export function isPartialsaml_providersArray(
  value: unknown,
): value is Partial<Isaml_providers>[] {
  return Array.isArray(value) && value.every(isPartialsaml_providers);
}
