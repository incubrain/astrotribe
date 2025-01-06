// tools/generators/dto/utils/template-engine.ts
import * as Handlebars from 'handlebars'

/**
 * Template engine for processing Handlebars templates
 */
export class TemplateEngine {
  private static readonly engine = Handlebars.create()

  /**
   * Registers a Handlebars helper
   */
  static registerHelper(name: string, fn: Handlebars.HelperDelegate): void {
    this.engine.registerHelper(name, fn)
  }

  /**
   * Registers a Handlebars partial
   */
  static registerPartial(name: string, template: string): void {
    this.engine.registerPartial(name, template)
  }

  /**
   * Processes a template with the given context
   */
  static process(template: string, context: Record<string, any>): string {
    const compiledTemplate = this.engine.compile(template)
    const result = compiledTemplate(context)

    // Decode HTML entities in the result
    return result
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
  }
}
