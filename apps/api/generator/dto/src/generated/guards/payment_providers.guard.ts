import { Ipayment_providers } from "./interfaces";
import { payment_providersSchema } from "./schemas";

/**
 * Type guard for payment_providers
 * Ensures that an unknown value matches the expected structure
 */
export function ispayment_providers(
  value: unknown,
): value is Ipayment_providers {
  return payment_providersSchema.safeParse(value).success;
}

/**
 * Specialized type guards for checking partial data
 */

export function isPartialpayment_providers(
  value: unknown,
): value is Partial<Ipayment_providers> {
  if (typeof value !== "object" || value === null) return false;

  const knownKeys = [
    "id",
    "name",
    "is_active",
    "created_at",
    "updated_at",
    "customer_payments",
    "customer_subscriptions",
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
      return typeof value === "number" && !isNaN(value);
    case "name":
      return typeof value === "string";
    case "is_active":
      return typeof value === "boolean";
    case "created_at":
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case "updated_at":
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case "customer_payments":
      return true; // Complex type requiring deeper validation
    case "customer_subscriptions":
      return true; // Complex type requiring deeper validation
  }
  return false;
}

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of payment_providers
 */
export function ispayment_providersArray(
  value: unknown,
): value is Ipayment_providers[] {
  return Array.isArray(value) && value.every(ispayment_providers);
}

/**
 * Type guard for partial arrays of payment_providers
 */
export function isPartialpayment_providersArray(
  value: unknown,
): value is Partial<Ipayment_providers>[] {
  return Array.isArray(value) && value.every(isPartialpayment_providers);
}
