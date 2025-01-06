import { Ispider_metrics } from "./interfaces";
import { spider_metricsSchema } from "./schemas";

/**
 * Type guard for spider_metrics
 * Ensures that an unknown value matches the expected structure
 */
export function isspider_metrics(value: unknown): value is Ispider_metrics {
  return spider_metricsSchema.safeParse(value).success;
}

/**
 * Specialized type guards for checking partial data
 */

export function isPartialspider_metrics(
  value: unknown,
): value is Partial<Ispider_metrics> {
  if (typeof value !== "object" || value === null) return false;

  const knownKeys = [
    "id",
    "crawl_id",
    "metric_id",
    "timestamp",
    "value",
    "metric_definitions",
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
    case "crawl_id":
      return true; // Complex type requiring deeper validation
    case "metric_id":
      return true; // Complex type requiring deeper validation
    case "timestamp":
      return true; // Complex type requiring deeper validation
    case "value":
      return true; // Complex type requiring deeper validation
    case "metric_definitions":
      return true; // Complex type requiring deeper validation
  }
  return false;
}

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of spider_metrics
 */
export function isspider_metricsArray(
  value: unknown,
): value is Ispider_metrics[] {
  return Array.isArray(value) && value.every(isspider_metrics);
}

/**
 * Type guard for partial arrays of spider_metrics
 */
export function isPartialspider_metricsArray(
  value: unknown,
): value is Partial<Ispider_metrics>[] {
  return Array.isArray(value) && value.every(isPartialspider_metrics);
}
