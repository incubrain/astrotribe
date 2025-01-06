// This file is auto-generated. Do not modify manually.
  {{#each imports}}
  import {  } from ''
  {{/each}}
  
  /**
   * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
   *{{#if deprecated}}
   * @deprecated {{/if}}
   *{{#if example}}
   * @example
   * {{/if}}
   *{{#if version}}
   * @version {{/if}}
   */
  export interface role_hierarchy {
  /**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation @IsNotEmpty{{/if}}
     */
    parent_role{{#unless required}}?{{/unless}}: any;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation @IsNotEmpty{{/if}}
     */
    child_role{{#unless required}}?{{/unless}}: any;
  }
  
  
  
  /**
   * Helper types for working with role_hierarchy
   */
  export type Partialrole_hierarchy = Partial<role_hierarchy>
  export type Requiredrole_hierarchy = Required<role_hierarchy>
  export type Pickrole_hierarchy<K extends keyof role_hierarchy> = Pick<role_hierarchy, K>