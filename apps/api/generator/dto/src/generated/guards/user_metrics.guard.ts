import { Iuser_metrics } from "./interfaces";
import { user_metricsSchema } from "./schemas";

/**
 * Type guard for user_metrics
 * Ensures that an unknown value matches the expected structure
 */
export function isuser_metrics(value: unknown): value is Iuser_metrics {
  return user_metricsSchema.safeParse(value).success;
}

/**
 * Specialized type guards for checking partial data
 */

export function isPartialuser_metrics(
  value: unknown,
): value is Partial<Iuser_metrics> {
  if (typeof value !== "object" || value === null) return false;

  const knownKeys = [
    "id",
    "user_id",
    "total_votes",
    "upvote_count",
    "downvote_count",
    "vote_accuracy",
    "current_streak",
    "best_streak",
    "today_vote_count",
    "total_reading_time",
    "last_vote_date",
    "points",
    "points_breakdown",
    "interaction_stats",
    "achievements",
    "titles",
    "multipliers",
    "current_level",
    "current_xp",
    "xp_to_next_level",
    "created_at",
    "updated_at",
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
      return typeof value === "string";
    case "user_id":
      return typeof value === "string";
    case "total_votes":
      return typeof value === "number" && !isNaN(value);
    case "upvote_count":
      return typeof value === "number" && !isNaN(value);
    case "downvote_count":
      return typeof value === "number" && !isNaN(value);
    case "vote_accuracy":
      return typeof value === "number" && !isNaN(value);
    case "current_streak":
      return typeof value === "number" && !isNaN(value);
    case "best_streak":
      return typeof value === "number" && !isNaN(value);
    case "today_vote_count":
      return typeof value === "number" && !isNaN(value);
    case "total_reading_time":
      return typeof value === "number" && !isNaN(value);
    case "last_vote_date":
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case "points":
      return typeof value === "number" && !isNaN(value);
    case "points_breakdown":
      return true; // Complex type requiring deeper validation
    case "interaction_stats":
      return true; // Complex type requiring deeper validation
    case "achievements":
      return true; // Complex type requiring deeper validation
    case "titles":
      return true; // Complex type requiring deeper validation
    case "multipliers":
      return true; // Complex type requiring deeper validation
    case "current_level":
      return typeof value === "number" && !isNaN(value);
    case "current_xp":
      return typeof value === "number" && !isNaN(value);
    case "xp_to_next_level":
      return typeof value === "number" && !isNaN(value);
    case "created_at":
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case "updated_at":
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case "user_profiles":
      return true; // Complex type requiring deeper validation
  }
  return false;
}

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of user_metrics
 */
export function isuser_metricsArray(value: unknown): value is Iuser_metrics[] {
  return Array.isArray(value) && value.every(isuser_metrics);
}

/**
 * Type guard for partial arrays of user_metrics
 */
export function isPartialuser_metricsArray(
  value: unknown,
): value is Partial<Iuser_metrics>[] {
  return Array.isArray(value) && value.every(isPartialuser_metrics);
}
