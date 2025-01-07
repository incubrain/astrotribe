// tools/generators/dto/templates/template.engine.ts
import Handlebars from 'handlebars'
import { TypeMapper } from '../utils/type-mapper'
import type { FieldMetadata } from '../types'
import { join } from 'path'
import { readFile } from 'fs/promises'

/**
 * Enhanced template engine for processing Handlebars templates
 */
export class TemplateEngine {
  private static handlebars = Handlebars.create()
  private static templates = new Map<string, HandlebarsTemplateDelegate>()
  private static typeMapper = new TypeMapper()
  private static partialsRegistered = false
  private static templatesLoaded = false

  /**
   * Initialize the template engine
   */
  static async initialize(templatesPath: string): Promise<void> {
    console.log('Initializing template engine with path:', templatesPath)

    if (!this.partialsRegistered) {
      await this.registerBasePartials(templatesPath)
    }
    if (!this.templatesLoaded) {
      await this.loadTemplates(templatesPath)
    }
    this.registerDefaultHelpers()

    // Debug logging
    console.log('Available templates:', Array.from(this.templates.keys()))
    console.log('Available partials:', Object.keys(this.handlebars.partials))
  }

  /**
   * Register core partials used across templates
   */
  private static async registerBasePartials(templatesPath: string): Promise<void> {
    const partials = {
      // Base partials
      'imports': 'base/imports.hbs',
      'documentation': 'base/documentation.hbs',
      'property': 'base/property.hbs',
      'type-helpers': 'base/type-helpers.hbs',

      // Validation & Transformation
      'transform': 'schema/transform.hbs',
      'transform-methods': 'schema/transform.methods.hbs',
      'validation-schema': 'schema/validation.schema.hbs',
      'validation-helpers': 'schema/validation.helpers.hbs',
      'schema-utilities': 'schema/schema.utilities.hbs',

      // API
      'api-metadata': 'api/metadata.api.hbs',

      // DTO related
      'dto-base': 'dto/model.dto.hbs',
      'dto-relation': 'dto/relationships.dto.hbs',

      // Interface related
      'interface-base': 'interface/model.interface.hbs',
      'interface-relation': 'interface/relationships.interface.hbs',
    }

    console.log('Registering base partials...')
    for (const [name, path] of Object.entries(partials)) {
      try {
        const fullPath = join(templatesPath, path)
        console.log(`Loading partial ${name} from ${fullPath}`)
        const content = await readFile(fullPath, 'utf-8')
        this.handlebars.registerPartial(name, content)
      } catch (error) {
        console.error(`Error loading partial ${name}:`, error)
      }
    }

    console.log('Base partials registered')
    this.partialsRegistered = true
  }

  /**
   * Load all template files
   */
  private static async loadTemplates(templatesPath: string): Promise<void> {
    const templateFiles = {
      // API templates
      'api/metadata.api': 'api/metadata.api.hbs',

      // Base templates
      'base/documentation': 'base/documentation.hbs',
      'base/imports': 'base/imports.hbs',
      'base/property': 'base/property.hbs',
      'base/type-helpers': 'base/type-helpers.hbs',
      'base/base-types': 'base/base-types.hbs',
      'base/helpers': 'base/helpers.hbs',

      // DTO templates
      'dto/model.dto': 'dto/model.dto.hbs',
      'dto/relationships.dto': 'dto/relationships.dto.hbs',
      'dto/request.dto': 'dto/request.dto.hbs',
      'dto/response.dto': 'dto/response.dto.hbs',
      'dto/view.dto': 'dto/view.dto.hbs',

      // Guard templates
      'guard/type.guard': 'guard/type.guard.hbs',

      // Interface templates
      'interface/model.interface': 'interface/model.interface.hbs',
      'interface/relationships.interface': 'interface/relationships.interface.hbs',
      'interface/view.interface': 'interface/view.interface.hbs',

      // Schema templates
      'schema/model.schema': 'schema/model.schema.hbs',
      'schema/transform': 'schema/transform.hbs',
      'schema/validation': 'schema/validation.schema.hbs',

      // Index template
      'index': 'index.hbs',
    }

    console.log('Loading templates...')
    for (const [name, path] of Object.entries(templateFiles)) {
      try {
        const fullPath = join(templatesPath, path)
        console.log(`Loading template ${name} from ${fullPath}`)
        const content = await readFile(fullPath, 'utf-8')
        this.templates.set(name, this.handlebars.compile(content))
      } catch (error) {
        console.error(`Error loading template ${name}:`, error)
      }
    }

    console.log('Templates loaded')
    this.templatesLoaded = true
  }

  /**
   * Register all Handlebars helpers
   */
  private static registerDefaultHelpers(): void {
    // Type mapping helpers
    this.registerHelper('mapType', (type: string) => this.typeMapper.mapType(type))
    this.registerHelper('mapFieldType', (field) => this.typeMapper.mapFieldType(field))
    this.registerHelper('getSwaggerType', (field) => this.typeMapper.getSwaggerType(field))

    // Logical operators
    this.registerHelper('eq', (a, b) => a === b)
    this.registerHelper('neq', (a, b) => a !== b)
    this.registerHelper('and', (a, b) => a && b)
    this.registerHelper('or', (a, b) => a || b)
    this.registerHelper('not', (a) => !a)

    // String manipulation
    this.registerHelper('lowercase', (str) => str?.toLowerCase())
    this.registerHelper('uppercase', (str) => str?.toUpperCase())
    this.registerHelper('capitalize', (str) => {
      if (!str) return ''
      return str.charAt(0).toUpperCase() + str.slice(1)
    })
    this.registerHelper('pascalCase', (str: string) => {
      return str
        .split(/[-_\s]+/)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join('')
    })

    // Array helpers
    this.registerHelper('join', (arr, separator) => arr?.join(separator))
    this.registerHelper('length', (arr) => arr?.length || 0)
    this.registerHelper('first', (arr) => arr?.[0])
    this.registerHelper('last', (arr) => arr?.[arr.length - 1])

    // Object helpers
    this.registerHelper('json', (obj) => JSON.stringify(obj, null, 2))
    this.registerHelper('get', (obj, key) => obj?.[key])
    this.registerHelper('keys', (obj) => Object.keys(obj || {}))
    this.registerHelper('values', (obj) => Object.values(obj || {}))

    // Validation helpers
    this.registerHelper('isRequired', (field) => field.isRequired)
    this.registerHelper('hasValidation', (field) => field.validationRules?.length > 0)
    this.registerHelper('hasTransform', (field) => field.transformationRules?.length > 0)

    // Conditional helper
    this.registerHelper('ifCond', function (v1, operator, v2, options) {
      switch (operator) {
        case '==':
          return v1 == v2 ? options.fn(this) : options.inverse(this)
        case '===':
          return v1 === v2 ? options.fn(this) : options.inverse(this)
        case '!=':
          return v1 != v2 ? options.fn(this) : options.inverse(this)
        case '!==':
          return v1 !== v2 ? options.fn(this) : options.inverse(this)
        case '<':
          return v1 < v2 ? options.fn(this) : options.inverse(this)
        case '<=':
          return v1 <= v2 ? options.fn(this) : options.inverse(this)
        case '>':
          return v1 > v2 ? options.fn(this) : options.inverse(this)
        case '>=':
          return v1 >= v2 ? options.fn(this) : options.inverse(this)
        case '&&':
          return v1 && v2 ? options.fn(this) : options.inverse(this)
        case '||':
          return v1 || v2 ? options.fn(this) : options.inverse(this)
        default:
          return options.inverse(this)
      }
    })

    // Formatting helpers
    this.registerHelper('date', (date) => (date ? new Date(date).toISOString() : ''))
    this.registerHelper('formatDate', (date, format) => {
      if (!date) return ''
      const d = new Date(date)
      switch (format) {
        case 'short':
          return d.toLocaleDateString()
        case 'long':
          return d.toLocaleString()
        case 'iso':
          return d.toISOString()
        default:
          return d.toString()
      }
    })
  }

  /**
   * Process a template with context
   */
  static process(templateName: string, context: any): string {
    // Log the incoming template name and check if it's a full path
    console.log('Processing template:', {
      requestedTemplate: templateName,
      isFullPath: templateName.includes('/'),
    })

    // Debug logging
    console.log('Template Context in Engine:', JSON.stringify(context, null, 2))

    // If it's a full path, extract just the template name part
    const normalizedName = templateName.includes('/templates/')
      ? templateName.split('/templates/')[1].replace(/\.hbs$/, '')
      : templateName.replace(/\.hbs$/, '')

    console.log('Normalized template name:', normalizedName)

    const template = this.templates.get(normalizedName)

    if (!template) {
      console.error('Template lookup failed:', {
        requested: templateName,
        normalized: normalizedName,
        availableTemplates: Array.from(this.templates.keys()),
      })
      throw new Error(`Template ${templateName} not found`)
    }

    // Process imports first
    if (context.hasValidation || context.hasTransform) {
      const imports = []
      imports.push("import { ApiProperty } from '@nestjs/swagger';")
      if (context.hasValidation) {
        imports.push("import { IsNotEmpty, IsOptional } from 'class-validator';")
      }
      if (context.hasTransform) {
        imports.push("import { Transform } from 'class-transformer';")
      }
      context.processedImports = imports.join('\n')
    }

    const result = template(context)
    console.log('Template Result:', result)

    return result
  }

  /**
   * Register a custom helper
   */
  static registerHelper(name: string, helper: Handlebars.HelperDelegate): void {
    this.handlebars.registerHelper(name, helper)
  }

  /**
   * Register a custom partial
   */
  static registerPartial(name: string, partial: string): void {
    this.handlebars.registerPartial(name, partial)
  }
}
