// This file is auto-generated. Do not modify manually.
  {{#each imports}}
  import {  } from ''
  {{/each}}
  
  /**
   * 
   *{{#if deprecated}}
   * @deprecated {{/if}}
   *{{#if example}}
   * @example
   * {{/if}}
   *{{#if version}}
   * @version {{/if}}
   */
  export interface job_configs {
  /**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation @IsNotEmpty, @IsString{{/if}}
     */
    id{{#unless required}}?{{/unless}}: unknown;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation @IsNotEmpty, @IsString{{/if}}
     */
    name{{#unless required}}?{{/unless}}: unknown;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation @IsString{{/if}}
     */
    schedule{{#unless required}}?{{/unless}}: unknown;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation {{/if}}
     */
    priority{{#unless required}}?{{/unless}}: unknown;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation @IsNumber([object Object]){{/if}}
     */
    timeout_ms{{#unless required}}?{{/unless}}: unknown;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation @IsNumber([object Object]){{/if}}
     */
    retry_limit{{#unless required}}?{{/unless}}: unknown;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation @IsBoolean{{/if}}
     */
    circuit_breaker_enabled{{#unless required}}?{{/unless}}: boolean;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation @IsNumber([object Object]){{/if}}
     */
    circuit_breaker_threshold{{#unless required}}?{{/unless}}: unknown;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation @IsNumber([object Object]){{/if}}
     */
    circuit_breaker_timeout_ms{{#unless required}}?{{/unless}}: unknown;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation @IsBoolean{{/if}}
     */
    enabled{{#unless required}}?{{/unless}}: boolean;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation {{/if}}
     */
    metadata{{#unless required}}?{{/unless}}: unknown;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation @IsDate{{/if}}
     */
    created_at{{#unless required}}?{{/unless}}: unknown;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation @IsDate{{/if}}
     */
    updated_at{{#unless required}}?{{/unless}}: unknown;
  }
  
  
  
  /**
   * Helper types for working with job_configs
   */
  export type Partialjob_configs = Partial<job_configs>
  export type Requiredjob_configs = Required<job_configs>
  export type Pickjob_configs<K extends keyof job_configs> = Pick<job_configs, K>