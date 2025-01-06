
import { Itable_statistics } from './interfaces'
import { table_statisticsSchema } from './schemas'

/**
 * Type guard for table_statistics
 * Ensures that an unknown value matches the expected structure
 */
export function istable_statistics(value: unknown): value is Itable_statistics {
  return table_statisticsSchema.safeParse(value).success
}

/**
 * Specialized type guards for checking partial data
 */

      export function isPartialtable_statistics(value: unknown): value is Partial<Itable_statistics> {
        if (typeof value !== 'object' || value === null) return false;

        const knownKeys = ["table_name","row_count","table_size","index_size","live_tuples","dead_tuples","last_vacuum","last_analyze","estimated_bloat_ratio","buffer_cache_hit_ratio","index_usage","seq_scan_count","index_scan_count","capture_time"];
        return Object.keys(value).every(key => 
          knownKeys.includes(key) && isValidField(key, value[key as keyof typeof value])
        );
      }

      /**
       * Validates individual fields based on their expected types.
       */
      function isValidField(key: string, value: unknown): boolean {
        switch (key) {
          case 'table_name':
      return typeof value === "string";
    case 'row_count':
      return true; // Complex type requiring deeper validation
    case 'table_size':
      return true; // Complex type requiring deeper validation
    case 'index_size':
      return true; // Complex type requiring deeper validation
    case 'live_tuples':
      return true; // Complex type requiring deeper validation
    case 'dead_tuples':
      return true; // Complex type requiring deeper validation
    case 'last_vacuum':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case 'last_analyze':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
    case 'estimated_bloat_ratio':
      return typeof value === "number" && !isNaN(value);
    case 'buffer_cache_hit_ratio':
      return typeof value === "number" && !isNaN(value);
    case 'index_usage':
      return true; // Complex type requiring deeper validation
    case 'seq_scan_count':
      return true; // Complex type requiring deeper validation
    case 'index_scan_count':
      return true; // Complex type requiring deeper validation
    case 'capture_time':
      return value instanceof Date || !isNaN(Date.parse(String(value)));
        }
        return false;
      }
      

/**
 * Type guard utilities for arrays and relationships
 */

/**
 * Type guard for arrays of table_statistics
 */
export function istable_statisticsArray(value: unknown): value is Itable_statistics[] {
  return Array.isArray(value) && value.every(istable_statistics)
}

/**
 * Type guard for partial arrays of table_statistics
 */
export function isPartialtable_statisticsArray(value: unknown): value is Partial<Itable_statistics>[] {
  return Array.isArray(value) && value.every(isPartialtable_statistics)
}

