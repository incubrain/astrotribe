import { Iad_variants } from "./interfaces";
import { ad_variantsSchema } from "./schemas";

/**
 * Type guard for ad_variants
 * Ensures that an unknown value matches the expected structure
 */
export function isad_variants(value: unknown): value is Iad_variants {
  return ad_variantsSchema.safeParse(value).success;
}

/**
 * Specialized type guards for checking partial data
 */

export function isPartialad_variants(
  value: unknown,
): value is Partial<Iad_variants> {
  if (typeof value !== "object" || value === null) return false;

  const knownKeys = [
    "id",
    "ad_id",
    "content",
    "is_control",
    "active",
    "created_at",
    "updated_at",
    "performance_metrics",
    "ad_daily_metrics",
    "ads",
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
    case "ad_id":
      return true; // Complex type requiring deeper validation
    case "content":
      return true; // Complex type requiring deeper validation
    case "is_control":
      return typeof value === "boolean";
    case "active":
      return typeof value === "boolean";
    case "created_at":
      return true; // Complex type requiring deeper validation
    case "updated_at":
      return true; // Complex type requiring deeper validation
    case "performance_metrics":
      return true; // Complex type requiring deeper validation
    case "ad_daily_metrics":
      return true; // Complex type requiring deeper validation
    case "ads":
      return true; // Complex type requiring deeper validation
  }
  return false;
}

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of ad_variants
 */
export function isad_variantsArray(value: unknown): value is Iad_variants[] {
  return Array.isArray(value) && value.every(isad_variants);
}

/**
 * Type guard for partial arrays of ad_variants
 */
export function isPartialad_variantsArray(
  value: unknown,
): value is Partial<Iad_variants>[] {
  return Array.isArray(value) && value.every(isPartialad_variants);
}
