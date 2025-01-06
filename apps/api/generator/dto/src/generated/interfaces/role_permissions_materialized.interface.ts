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
  export interface role_permissions_materialized {
  /**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation @IsNotEmpty{{/if}}
     */
    role{{#unless required}}?{{/unless}}: unknown;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation @IsNotEmpty{{/if}}
     */
    permissions{{#unless required}}?{{/unless}}: unknown;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation @IsDate{{/if}}
     */
    last_updated{{#unless required}}?{{/unless}}: unknown;
  }
  
  
  
  /**
   * Helper types for working with role_permissions_materialized
   */
  export type Partialrole_permissions_materialized = Partial<role_permissions_materialized>
  export type Requiredrole_permissions_materialized = Required<role_permissions_materialized>
  export type Pickrole_permissions_materialized<K extends keyof role_permissions_materialized> = Pick<role_permissions_materialized, K>