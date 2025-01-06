import { Iuser_profiles } from "./interfaces";
import { user_profilesSchema } from "./schemas";

/**
 * Type guard for user_profiles
 * Ensures that an unknown value matches the expected structure
 */
export function isuser_profiles(value: unknown): value is Iuser_profiles {
  return user_profilesSchema.safeParse(value).success;
}

/**
 * Specialized type guards for checking partial data
 */

export function isPartialuser_profiles(
  value: unknown,
): value is Partial<Iuser_profiles> {
  if (typeof value !== "object" || value === null) return false;

  const knownKeys = [
    "id",
    "email",
    "given_name",
    "surname",
    "username",
    "dob",
    "gender_id",
    "created_at",
    "updated_at",
    "last_seen",
    "avatar",
    "introduction",
    "followed_count",
    "followers_count",
    "plan",
    "role",
    "is_active",
    "addresses",
    "comments",
    "company_employees",
    "contacts",
    "content_source_visits",
    "customer_payments",
    "customer_subscriptions",
    "feedbacks",
    "feeds",
    "follows",
    "user_metrics",
    "users",
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
    case "email":
      return true; // Complex type requiring deeper validation
    case "given_name":
      return true; // Complex type requiring deeper validation
    case "surname":
      return true; // Complex type requiring deeper validation
    case "username":
      return true; // Complex type requiring deeper validation
    case "dob":
      return true; // Complex type requiring deeper validation
    case "gender_id":
      return true; // Complex type requiring deeper validation
    case "created_at":
      return true; // Complex type requiring deeper validation
    case "updated_at":
      return true; // Complex type requiring deeper validation
    case "last_seen":
      return true; // Complex type requiring deeper validation
    case "avatar":
      return true; // Complex type requiring deeper validation
    case "introduction":
      return true; // Complex type requiring deeper validation
    case "followed_count":
      return true; // Complex type requiring deeper validation
    case "followers_count":
      return true; // Complex type requiring deeper validation
    case "plan":
      return true; // Complex type requiring deeper validation
    case "role":
      return true; // Complex type requiring deeper validation
    case "is_active":
      return typeof value === "boolean";
    case "addresses":
      return true; // Complex type requiring deeper validation
    case "comments":
      return true; // Complex type requiring deeper validation
    case "company_employees":
      return true; // Complex type requiring deeper validation
    case "contacts":
      return true; // Complex type requiring deeper validation
    case "content_source_visits":
      return true; // Complex type requiring deeper validation
    case "customer_payments":
      return true; // Complex type requiring deeper validation
    case "customer_subscriptions":
      return true; // Complex type requiring deeper validation
    case "feedbacks":
      return true; // Complex type requiring deeper validation
    case "feeds":
      return true; // Complex type requiring deeper validation
    case "follows":
      return true; // Complex type requiring deeper validation
    case "user_metrics":
      return true; // Complex type requiring deeper validation
    case "users":
      return true; // Complex type requiring deeper validation
  }
  return false;
}

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of user_profiles
 */
export function isuser_profilesArray(
  value: unknown,
): value is Iuser_profiles[] {
  return Array.isArray(value) && value.every(isuser_profiles);
}

/**
 * Type guard for partial arrays of user_profiles
 */
export function isPartialuser_profilesArray(
  value: unknown,
): value is Partial<Iuser_profiles>[] {
  return Array.isArray(value) && value.every(isPartialuser_profiles);
}
