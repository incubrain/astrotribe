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
  export interface customer_subscription_plans {
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
    external_plan_id{{#unless required}}?{{/unless}}: unknown;
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
    description{{#unless required}}?{{/unless}}: unknown;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation @IsNotEmpty, @IsNumber([object Object]){{/if}}
     */
    interval{{#unless required}}?{{/unless}}: unknown;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation @IsNotEmpty, @IsString{{/if}}
     */
    interval_type{{#unless required}}?{{/unless}}: unknown;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation @IsNotEmpty, @IsNumber([object Object]){{/if}}
     */
    monthly_amount{{#unless required}}?{{/unless}}: unknown;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation @IsNotEmpty, @IsNumber([object Object]){{/if}}
     */
    annual_amount{{#unless required}}?{{/unless}}: unknown;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation @IsNotEmpty, @IsString{{/if}}
     */
    currency{{#unless required}}?{{/unless}}: unknown;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation {{/if}}
     */
    features{{#unless required}}?{{/unless}}: unknown;
/**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation @IsBoolean{{/if}}
     */
    is_active{{#unless required}}?{{/unless}}: boolean;
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
     * @validation @IsNotEmpty{{/if}}
     */
    customer_subscriptions{{#unless required}}?{{/unless}}: unknown;
  }
  
  export interface customer_subscription_plansWithcustomer_subscriptions extends customer_subscription_plans {
    customer_subscriptions: Icustomer_subscriptions;
  }
  
  /**
   * Helper types for working with customer_subscription_plans
   */
  export type Partialcustomer_subscription_plans = Partial<customer_subscription_plans>
  export type Requiredcustomer_subscription_plans = Required<customer_subscription_plans>
  export type Pickcustomer_subscription_plans<K extends keyof customer_subscription_plans> = Pick<customer_subscription_plans, K>