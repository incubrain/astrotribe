// This file is auto-generated. Do not modify manually.
  {{#each imports}}
  import {  } from ''
  {{/each}}
  
  /**
   * This table contains check constraints and requires additional setup for migrations. Visit https://pris.ly/d/check-constraints for more info.
This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments
This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
This model contains an expression index which requires additional setup for migrations. Visit https://pris.ly/d/expression-indexes for more info.
   *{{#if deprecated}}
   * @deprecated {{/if}}
   *{{#if example}}
   * @example
   * {{/if}}
   *{{#if version}}
   * @version {{/if}}
   */
  export interface sso_domains {
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
    sso_provider_id{{#unless required}}?{{/unless}}: string;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation @IsNotEmpty, @IsString{{/if}}
     */
    domain{{#unless required}}?{{/unless}}: string;
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
     * @validation @IsDate{{/if}}
     */
    updated_at{{#unless required}}?{{/unless}}: Date;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation @IsNotEmpty{{/if}}
     */
    sso_providers{{#unless required}}?{{/unless}}: any;
  }
  
  export interface sso_domainsWithsso_providers extends sso_domains {
    sso_providers: Isso_providers;
  }
  
  /**
   * Helper types for working with sso_domains
   */
  export type Partialsso_domains = Partial<sso_domains>
  export type Requiredsso_domains = Required<sso_domains>
  export type Picksso_domains<K extends keyof sso_domains> = Pick<sso_domains, K>