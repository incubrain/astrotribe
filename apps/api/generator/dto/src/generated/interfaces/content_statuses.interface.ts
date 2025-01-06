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
  export interface content_statuses {
  /**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation @IsNotEmpty, @IsString{{/if}}
     */
    id{{#unless required}}?{{/unless}}: string;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation @IsNotEmpty, @IsString{{/if}}
     */
    content_id{{#unless required}}?{{/unless}}: string;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation @IsString{{/if}}
     */
    notes{{#unless required}}?{{/unless}}: string;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation @IsDate{{/if}}
     */
    created_at{{#unless required}}?{{/unless}}: Date;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation @IsNotEmpty{{/if}}
     */
    content_status{{#unless required}}?{{/unless}}: any;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation @IsNotEmpty{{/if}}
     */
    contents{{#unless required}}?{{/unless}}: any;
  }
  
  export interface content_statusesWithcontents extends content_statuses {
    contents: Icontents;
  }
  
  /**
   * Helper types for working with content_statuses
   */
  export type Partialcontent_statuses = Partial<content_statuses>
  export type Requiredcontent_statuses = Required<content_statuses>
  export type Pickcontent_statuses<K extends keyof content_statuses> = Pick<content_statuses, K>