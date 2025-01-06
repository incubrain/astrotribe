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
  export interface metric_definitions {
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
     * @validation @IsNotEmpty, @IsString{{/if}}
     */
    name{{#unless required}}?{{/unless}}: string;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation @IsString{{/if}}
     */
    description{{#unless required}}?{{/unless}}: string;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation @IsString{{/if}}
     */
    category{{#unless required}}?{{/unless}}: string;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation @IsNotEmpty, @IsString{{/if}}
     */
    type{{#unless required}}?{{/unless}}: string;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation @IsString{{/if}}
     */
    unit{{#unless required}}?{{/unless}}: string;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation @IsBoolean{{/if}}
     */
    is_dimensional{{#unless required}}?{{/unless}}: boolean;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation @IsNotEmpty{{/if}}
     */
    company_metrics{{#unless required}}?{{/unless}}: any;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation @IsNotEmpty{{/if}}
     */
    spider_metrics{{#unless required}}?{{/unless}}: any;
  }
  
  export interface metric_definitionsWithcompany_metrics extends metric_definitions {
    company_metrics: Icompany_metrics;
  }

export interface metric_definitionsWithspider_metrics extends metric_definitions {
    spider_metrics: Ispider_metrics;
  }
  
  /**
   * Helper types for working with metric_definitions
   */
  export type Partialmetric_definitions = Partial<metric_definitions>
  export type Requiredmetric_definitions = Required<metric_definitions>
  export type Pickmetric_definitions<K extends keyof metric_definitions> = Pick<metric_definitions, K>