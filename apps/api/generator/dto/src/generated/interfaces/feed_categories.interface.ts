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
  export interface feed_categories {
  /**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation @IsNotEmpty{{/if}}
     */
    id{{#unless required}}?{{/unless}}: bigint;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation @IsNotEmpty, @IsDate{{/if}}
     */
    created_at{{#unless required}}?{{/unless}}: Date;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation @IsString{{/if}}
     */
    feed_id{{#unless required}}?{{/unless}}: string;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation {{/if}}
     */
    category_id{{#unless required}}?{{/unless}}: bigint;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation {{/if}}
     */
    categories{{#unless required}}?{{/unless}}: any;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation {{/if}}
     */
    feeds{{#unless required}}?{{/unless}}: any;
  }
  
  export interface feed_categoriesWithcategories extends feed_categories {
    categories: Icategories;
  }

export interface feed_categoriesWithfeeds extends feed_categories {
    feeds: Ifeeds;
  }
  
  /**
   * Helper types for working with feed_categories
   */
  export type Partialfeed_categories = Partial<feed_categories>
  export type Requiredfeed_categories = Required<feed_categories>
  export type Pickfeed_categories<K extends keyof feed_categories> = Pick<feed_categories, K>