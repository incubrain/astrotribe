// This file is auto-generated. Do not modify manually.
  {{#each imports}}
  import {  } from ''
  {{/each}}
  
  /**
   * This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments
This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
   *{{#if deprecated}}
   * @deprecated {{/if}}
   *{{#if example}}
   * @example
   * {{/if}}
   *{{#if version}}
   * @version {{/if}}
   */
  export interface sessions {
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
    user_id{{#unless required}}?{{/unless}}: unknown;
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
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation @IsString{{/if}}
     */
    factor_id{{#unless required}}?{{/unless}}: unknown;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation {{/if}}
     */
    aal{{#unless required}}?{{/unless}}: unknown;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation @IsDate{{/if}}
     */
    not_after{{#unless required}}?{{/unless}}: unknown;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation @IsDate{{/if}}
     */
    refreshed_at{{#unless required}}?{{/unless}}: unknown;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation @IsString{{/if}}
     */
    user_agent{{#unless required}}?{{/unless}}: unknown;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation @IsString{{/if}}
     */
    ip{{#unless required}}?{{/unless}}: unknown;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation @IsString{{/if}}
     */
    tag{{#unless required}}?{{/unless}}: unknown;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation @IsNotEmpty{{/if}}
     */
    mfa_amr_claims{{#unless required}}?{{/unless}}: unknown;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation @IsNotEmpty{{/if}}
     */
    refresh_tokens{{#unless required}}?{{/unless}}: unknown;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation @IsNotEmpty{{/if}}
     */
    users{{#unless required}}?{{/unless}}: unknown;
  }
  
  export interface sessionsWithmfa_amr_claims extends sessions {
    mfa_amr_claims: Imfa_amr_claims;
  }

export interface sessionsWithrefresh_tokens extends sessions {
    refresh_tokens: Irefresh_tokens;
  }

export interface sessionsWithusers extends sessions {
    users: Iusers;
  }
  
  /**
   * Helper types for working with sessions
   */
  export type Partialsessions = Partial<sessions>
  export type Requiredsessions = Required<sessions>
  export type Picksessions<K extends keyof sessions> = Pick<sessions, K>