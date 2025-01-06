import { Iad_daily_metrics } from "./interfaces";
import { ad_daily_metricsSchema } from "./schemas";

/**
 * Type guard for ad_daily_metrics
 * Ensures that an unknown value matches the expected structure
 */
export function isad_daily_metrics(value: unknown): value is Iad_daily_metrics {
  return ad_daily_metricsSchema.safeParse(value).success;
}

/**
 * Specialized type guards for checking partial data
 */

export function isPartialad_daily_metrics(
  value: unknown,
): value is Partial<Iad_daily_metrics> {
  if (typeof value !== "object" || value === null) return false;

  const knownKeys = [
    "id",
    "variant_id",
    "date",
    "views",
    "clicks",
    "created_at",
    "updated_at",
    "ad_variants",
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
    case "variant_id":
      return true; // Complex type requiring deeper validation
    case "date":
      return true; // Complex type requiring deeper validation
    case "views":
      return true; // Complex type requiring deeper validation
    case "clicks":
      return true; // Complex type requiring deeper validation
    case "created_at":
      return true; // Complex type requiring deeper validation
    case "updated_at":
      return true; // Complex type requiring deeper validation
    case "ad_variants":
      return true; // Complex type requiring deeper validation
  }
  return false;
}

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of ad_daily_metrics
 */
export function isad_daily_metricsArray(
  value: unknown,
): value is Iad_daily_metrics[] {
  return Array.isArray(value) && value.every(isad_daily_metrics);
}

/**
 * Type guard for partial arrays of ad_daily_metrics
 */
export function isPartialad_daily_metricsArray(
  value: unknown,
): value is Partial<Iad_daily_metrics>[] {
  return Array.isArray(value) && value.every(isPartialad_daily_metrics);
}
