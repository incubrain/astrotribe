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
  export interface feeds {
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
    name{{#unless required}}?{{/unless}}: string;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation @IsString{{/if}}
     */
    user_id{{#unless required}}?{{/unless}}: string;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation @IsNotEmpty{{/if}}
     */
    feed_categories{{#unless required}}?{{/unless}}: any;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation @IsNotEmpty{{/if}}
     */
    feed_sources{{#unless required}}?{{/unless}}: any;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation {{/if}}
     */
    user_profiles{{#unless required}}?{{/unless}}: any;
  }
  
  export interface feedsWithfeed_categories extends feeds {
    feed_categories: Ifeed_categories;
  }

export interface feedsWithfeed_sources extends feeds {
    feed_sources: Ifeed_sources;
  }

export interface feedsWithuser_profiles extends feeds {
    user_profiles: Iuser_profiles;
  }
  
  /**
   * Helper types for working with feeds
   */
  export type Partialfeeds = Partial<feeds>
  export type Requiredfeeds = Required<feeds>
  export type Pickfeeds<K extends keyof feeds> = Pick<feeds, K>