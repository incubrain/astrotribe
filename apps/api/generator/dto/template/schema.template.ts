// tools/generators/dto/templates/schema.template.ts
/**
 * Template system for generating Zod schemas.
 * Provides a structured way to create validation schemas with
 * proper typing and documentation.
 */
export class SchemaTemplate {
  /**
   * Main template for generating a schema file.
   * Includes imports, schema definition, and utility functions.
   */
  static readonly MAIN_TEMPLATE = `
  // This file is auto-generated. Do not modify manually.
  {{imports}}
  
  {{documentation}}
  export const {{schemaName}} = z.object({
  {{properties}}
  })
  
  /**
   * Type inference from schema
   */
  export type {{typeName}} = z.infer<typeof {{schemaName}}>
  
  {{validators}}
  
  {{utilities}}
  `.trim()

  /**
   * Template for generating schema imports.
   * Handles Zod and related type imports.
   */
  static readonly IMPORTS_TEMPLATE = `
  import { z } from 'zod'
  {{#each customImports}}
  import { {{what}} } from '{{from}}'
  {{/each}}
  `.trim()

  /**
   * Template for generating schema properties.
   * Supports all Zod validators and transformations.
   */
  static readonly PROPERTY_TEMPLATE = `
    /**
     * {{description}}
     */
    {{name}}: {{zodType}}{{#if transforms}}
      {{#each transforms}}
      .transform({{transform}})
      {{/each}}
    {{/if}}{{#if validations}}
      {{#each validations}}
      .{{validation}}
      {{/each}}
    {{/if}},
  `.trim()

  /**
   * Template for generating schema validation functions.
   * Creates utility functions for validating data against the schema.
   */
  static readonly VALIDATORS_TEMPLATE = `
  /**
   * Validates data against the {{schemaName}}
   * @throws {ZodError} if validation fails
   */
  export function validate{{typeName}}(data: unknown): {{typeName}} {
    return {{schemaName}}.parse(data)
  }
  
  /**
   * Safely validates data against the {{schemaName}}
   * @returns Result object indicating success or failure
   */
  export function safeValidate{{typeName}}(data: unknown): Result<{{typeName}}, z.ZodError> {
    const result = {{schemaName}}.safeParse(data)
    return result.success
      ? { ok: true, value: result.data }
      : { ok: false, error: result.error }
  }
  `.trim()

  /**
   * Template for generating schema utilities.
   * Creates helper functions for common schema operations.
   */
  static readonly UTILITIES_TEMPLATE = `
  /**
   * Utility functions for {{schemaName}}
   */
  export const {{schemaName}}Utils = {
    /**
     * Creates a partial schema that makes all properties optional
     */
    partial: () => {{schemaName}}.partial(),
  
    /**
     * Creates a strict schema that doesn't allow additional properties
     */
    strict: () => {{schemaName}}.strict(),
  
    /**
     * Creates a schema for arrays of {{typeName}}
     */
    array: () => z.array({{schemaName}}),
  
    /**
     * Creates a schema with only the specified keys
     */
    pick: <K extends keyof {{typeName}}>(keys: K[]) => {{schemaName}}.pick(keys),
  } as const;
  `.trim()

  /**
   * Template for generating custom refinement rules.
   * Allows adding complex validation logic to schemas.
   */
  static readonly REFINEMENT_TEMPLATE = `
      .refine(
        (data) => {{refinementLogic}},
        { message: '{{message}}' }
      )
  `.trim()

  /**
   * Template for generating preprocess transformations.
   * Allows data transformation before validation.
   */
  static readonly PREPROCESS_TEMPLATE = `
      .preprocess((val) => {{preprocessLogic}})
  `.trim()
}
