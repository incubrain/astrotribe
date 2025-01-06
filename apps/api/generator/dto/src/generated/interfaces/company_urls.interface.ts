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
  export interface company_urls {
  /**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation @IsNotEmpty, @IsNumber([object Object]){{/if}}
     */
    id{{#unless required}}?{{/unless}}: number;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation @IsNotEmpty, @IsDate{{/if}}
     */
    updated_at{{#unless required}}?{{/unless}}: Date;
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
     * @validation @IsNotEmpty, @IsString{{/if}}
     */
    url{{#unless required}}?{{/unless}}: string;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation @IsBoolean{{/if}}
     */
    success{{#unless required}}?{{/unless}}: boolean;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation @IsNotEmpty, @IsString{{/if}}
     */
    category{{#unless required}}?{{/unless}}: string;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation @IsString{{/if}}
     */
    company_id{{#unless required}}?{{/unless}}: string;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation @IsString{{/if}}
     */
    content{{#unless required}}?{{/unless}}: string;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation @IsNumber([object Object]){{/if}}
     */
    distance{{#unless required}}?{{/unless}}: number;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation {{/if}}
     */
    companies{{#unless required}}?{{/unless}}: any;
  }
  
  export interface company_urlsWithcompanies extends company_urls {
    companies: Icompanies;
  }
  
  /**
   * Helper types for working with company_urls
   */
  export type Partialcompany_urls = Partial<company_urls>
  export type Requiredcompany_urls = Required<company_urls>
  export type Pickcompany_urls<K extends keyof company_urls> = Pick<company_urls, K>