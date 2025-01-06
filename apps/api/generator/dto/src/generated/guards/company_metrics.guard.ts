import { Icompany_metrics } from "./interfaces";
import { company_metricsSchema } from "./schemas";

/**
 * Type guard for company_metrics
 * Ensures that an unknown value matches the expected structure
 */
export function iscompany_metrics(value: unknown): value is Icompany_metrics {
  return company_metricsSchema.safeParse(value).success;
}

/**
 * Specialized type guards for checking partial data
 */

export function isPartialcompany_metrics(
  value: unknown,
): value is Partial<Icompany_metrics> {
  if (typeof value !== "object" || value === null) return false;

  const knownKeys = [
    "id",
    "crawl_id",
    "company_id",
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
      return typeof value === "string";
    case "company_id":
      return typeof value === "string";
    case "metric_id":
      return typeof value === "number" && !isNaN(value);
    case "timestamp":
      return value instanceof Date || !isNaN(Date.parse(String(value)));
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
 * Type guard for arrays of company_metrics
 */
export function iscompany_metricsArray(
  value: unknown,
): value is Icompany_metrics[] {
  return Array.isArray(value) && value.every(iscompany_metrics);
}

/**
 * Type guard for partial arrays of company_metrics
 */
export function isPartialcompany_metricsArray(
  value: unknown,
): value is Partial<Icompany_metrics>[] {
  return Array.isArray(value) && value.every(isPartialcompany_metrics);
}
