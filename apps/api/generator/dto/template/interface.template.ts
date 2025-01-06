// tools/generators/dto/templates/interface.template.ts
/**
 * Template system for generating TypeScript interfaces.
 * Uses a flexible template structure that can be customized through
 * configuration while maintaining consistent formatting and documentation.
 */
export class InterfaceTemplate {
  /**
   * Main template for generating an interface file.
   * Supports imports, documentation, and multiple interface definitions.
   */
  static readonly MAIN_TEMPLATE = `
  // This file is auto-generated. Do not modify manually.
  {{imports}}
  
  {{documentation}}
  export interface {{interfaceName}} {
  {{properties}}
  }
  
  {{relationInterfaces}}
  
  {{typeHelpers}}
  `.trim()

  /**
   * Template for generating import statements.
   * Handles both internal and external imports with proper grouping.
   */
  static readonly IMPORTS_TEMPLATE = `
  {{#each imports}}
  import { {{what}} } from '{{from}}'
  {{/each}}
  `.trim()

  /**
   * Template for generating JSDoc documentation blocks.
   * Supports multiple documentation features like examples and deprecation notices.
   */
  static readonly DOCUMENTATION_TEMPLATE = `
  /**
   * {{description}}
   *{{#if deprecated}}
   * @deprecated {{deprecated}}{{/if}}
   *{{#if example}}
   * @example
   * {{example}}{{/if}}
   *{{#if version}}
   * @version {{version}}{{/if}}
   */
  `.trim()

  /**
   * Template for generating interface properties.
   * Supports different types, optional flags, and property documentation.
   */
  static readonly PROPERTY_TEMPLATE = `
    /**
     * {{description}}
     *{{#if example}}
     * @example {{example}}{{/if}}
     *{{#if validation}}
     * @validation {{validation}}{{/if}}
     */
    {{name}}{{#unless required}}?{{/unless}}: {{type}};
  `.trim()

  /**
   * Template for generating relation interfaces.
   * Creates extended interfaces for handling related entities.
   */
  static readonly RELATION_INTERFACE_TEMPLATE = `
  export interface {{interfaceName}}With{{relationName}} extends {{interfaceName}} {
    {{relationProperty}}: {{relationType}};
  }
  `.trim()

  /**
   * Template for generating type helpers.
   * Creates utility types for working with the interface.
   */
  static readonly TYPE_HELPERS_TEMPLATE = `
  /**
   * Helper types for working with {{interfaceName}}
   */
  export type Partial{{interfaceName}} = Partial<{{interfaceName}}>
  export type Required{{interfaceName}} = Required<{{interfaceName}}>
  export type Pick{{interfaceName}}<K extends keyof {{interfaceName}}> = Pick<{{interfaceName}}, K>
  `.trim()

  /**
   * Template for generating validation metadata.
   * Describes validation rules that should be applied to properties.
   */
  static readonly VALIDATION_METADATA_TEMPLATE = `
  /**
   * Validation metadata for {{interfaceName}}
   */
  export const {{interfaceName}}ValidationRules = {
  {{#each validationRules}}
    {{name}}: {
      {{#each rules}}
      {{name}}: {{value}},
      {{/each}}
    },
  {{/each}}
  } as const;
  `.trim()
}
