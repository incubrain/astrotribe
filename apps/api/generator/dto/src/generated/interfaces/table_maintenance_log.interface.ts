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
  export interface table_maintenance_log {
  /**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation @IsNotEmpty, @IsNumber([object Object]){{/if}}
     */
    id{{#unless required}}?{{/unless}}: unknown;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation @IsString{{/if}}
     */
    operation{{#unless required}}?{{/unless}}: unknown;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation @IsString{{/if}}
     */
    detail{{#unless required}}?{{/unless}}: unknown;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation @IsDate{{/if}}
     */
    logged_at{{#unless required}}?{{/unless}}: unknown;
  }
  
  
  
  /**
   * Helper types for working with table_maintenance_log
   */
  export type Partialtable_maintenance_log = Partial<table_maintenance_log>
  export type Requiredtable_maintenance_log = Required<table_maintenance_log>
  export type Picktable_maintenance_log<K extends keyof table_maintenance_log> = Pick<table_maintenance_log, K>