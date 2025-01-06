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
  export interface schema_migrations {
  /**
     * 
     *{{#if example}}
     * @example {{/if}}
     *{{#if validation}}
     * @validation @IsNotEmpty, @IsString{{/if}}
     */
    version{{#unless required}}?{{/unless}}: string;
  }
  
  
  
  /**
   * Helper types for working with schema_migrations
   */
  export type Partialschema_migrations = Partial<schema_migrations>
  export type Requiredschema_migrations = Required<schema_migrations>
  export type Pickschema_migrations<K extends keyof schema_migrations> = Pick<schema_migrations, K>