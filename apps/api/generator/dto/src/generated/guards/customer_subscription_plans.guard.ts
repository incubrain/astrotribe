import { Icustomer_subscription_plans } from "./interfaces";
import { customer_subscription_plansSchema } from "./schemas";

/**
 * Type guard for customer_subscription_plans
 * Ensures that an unknown value matches the expected structure
 */
export function iscustomer_subscription_plans(
  value: unknown,
): value is Icustomer_subscription_plans {
  return customer_subscription_plansSchema.safeParse(value).success;
}

/**
 * Specialized type guards for checking partial data
 */

export function isPartialcustomer_subscription_plans(
  value: unknown,
): value is Partial<Icustomer_subscription_plans> {
  if (typeof value !== "object" || value === null) return false;

  const knownKeys = [
    "id",
    "external_plan_id",
    "name",
    "description",
    "interval",
    "interval_type",
    "monthly_amount",
    "annual_amount",
    "currency",
    "features",
    "is_active",
    "created_at",
    "updated_at",
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
      return true; // Complex type requiring deeper validation
    case "external_plan_id":
      return true; // Complex type requiring deeper validation
    case "name":
      return true; // Complex type requiring deeper validation
    case "description":
      return true; // Complex type requiring deeper validation
    case "interval":
      return true; // Complex type requiring deeper validation
    case "interval_type":
      return true; // Complex type requiring deeper validation
    case "monthly_amount":
      return true; // Complex type requiring deeper validation
    case "annual_amount":
      return true; // Complex type requiring deeper validation
    case "currency":
      return true; // Complex type requiring deeper validation
    case "features":
      return true; // Complex type requiring deeper validation
    case "is_active":
      return typeof value === "boolean";
    case "created_at":
      return true; // Complex type requiring deeper validation
    case "updated_at":
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
 * Type guard for arrays of customer_subscription_plans
 */
export function iscustomer_subscription_plansArray(
  value: unknown,
): value is Icustomer_subscription_plans[] {
  return Array.isArray(value) && value.every(iscustomer_subscription_plans);
}

/**
 * Type guard for partial arrays of customer_subscription_plans
 */
export function isPartialcustomer_subscription_plansArray(
  value: unknown,
): value is Partial<Icustomer_subscription_plans>[] {
  return (
    Array.isArray(value) && value.every(isPartialcustomer_subscription_plans)
  );
}
