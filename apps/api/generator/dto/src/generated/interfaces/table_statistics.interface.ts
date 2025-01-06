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
  export interface table_statistics {
  /**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation @IsNotEmpty, @IsString{{/if}}
     */
    table_name{{#unless required}}?{{/unless}}: string;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation {{/if}}
     */
    row_count{{#unless required}}?{{/unless}}: bigint;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation {{/if}}
     */
    table_size{{#unless required}}?{{/unless}}: bigint;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation {{/if}}
     */
    index_size{{#unless required}}?{{/unless}}: bigint;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation {{/if}}
     */
    live_tuples{{#unless required}}?{{/unless}}: bigint;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation {{/if}}
     */
    dead_tuples{{#unless required}}?{{/unless}}: bigint;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation @IsDate{{/if}}
     */
    last_vacuum{{#unless required}}?{{/unless}}: Date;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation @IsDate{{/if}}
     */
    last_analyze{{#unless required}}?{{/unless}}: Date;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation @IsNumber([object Object]){{/if}}
     */
    estimated_bloat_ratio{{#unless required}}?{{/unless}}: number;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation @IsNumber([object Object]){{/if}}
     */
    buffer_cache_hit_ratio{{#unless required}}?{{/unless}}: number;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation {{/if}}
     */
    index_usage{{#unless required}}?{{/unless}}: Record<string, any>;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation {{/if}}
     */
    seq_scan_count{{#unless required}}?{{/unless}}: bigint;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation {{/if}}
     */
    index_scan_count{{#unless required}}?{{/unless}}: bigint;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation @IsNotEmpty, @IsDate{{/if}}
     */
    capture_time{{#unless required}}?{{/unless}}: Date;
  }
  
  
  
  /**
   * Helper types for working with table_statistics
   */
  export type Partialtable_statistics = Partial<table_statistics>
  export type Requiredtable_statistics = Required<table_statistics>
  export type Picktable_statistics<K extends keyof table_statistics> = Pick<table_statistics, K>