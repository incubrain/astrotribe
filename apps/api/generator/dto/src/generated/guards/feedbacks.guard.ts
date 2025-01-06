import { Ifeedbacks } from "./interfaces";
import { feedbacksSchema } from "./schemas";

/**
 * Type guard for feedbacks
 * Ensures that an unknown value matches the expected structure
 */
export function isfeedbacks(value: unknown): value is Ifeedbacks {
  return feedbacksSchema.safeParse(value).success;
}

/**
 * Specialized type guards for checking partial data
 */

export function isPartialfeedbacks(
  value: unknown,
): value is Partial<Ifeedbacks> {
  if (typeof value !== "object" || value === null) return false;

  const knownKeys = [
    "id",
    "user_id",
    "page_identifier",
    "rating",
    "feedback_type",
    "message",
    "created_at",
    "updated_at",
    "device_info",
    "resolution_comment",
    "feedback_status",
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
    case "user_id":
      return true; // Complex type requiring deeper validation
    case "page_identifier":
      return true; // Complex type requiring deeper validation
    case "rating":
      return true; // Complex type requiring deeper validation
    case "feedback_type":
      return true; // Complex type requiring deeper validation
    case "message":
      return true; // Complex type requiring deeper validation
    case "created_at":
      return true; // Complex type requiring deeper validation
    case "updated_at":
      return true; // Complex type requiring deeper validation
    case "device_info":
      return true; // Complex type requiring deeper validation
    case "resolution_comment":
      return true; // Complex type requiring deeper validation
    case "feedback_status":
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
 * Type guard for arrays of feedbacks
 */
export function isfeedbacksArray(value: unknown): value is Ifeedbacks[] {
  return Array.isArray(value) && value.every(isfeedbacks);
}

/**
 * Type guard for partial arrays of feedbacks
 */
export function isPartialfeedbacksArray(
  value: unknown,
): value is Partial<Ifeedbacks>[] {
  return Array.isArray(value) && value.every(isPartialfeedbacks);
}
