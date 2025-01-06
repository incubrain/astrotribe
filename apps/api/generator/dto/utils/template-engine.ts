// tools/generators/dto/utils/template-engine.ts
import Handlebars from 'handlebars'

/**
 * Template engine for processing Handlebars templates
 */
export class TemplateEngine {
  /**
   * Process a template with the given context
   */
  static process(template: string, context: Record<string, any>): string {
    const compiledTemplate = Handlebars.compile(template)
    return compiledTemplate(context)
  }

  /**
   * Register a helper function with Handlebars
   */
  static registerHelper(name: string, fn: Handlebars.HelperDelegate): void {
    Handlebars.registerHelper(name, fn)
  }

  /**
   * Register a partial template with Handlebars
   */
  static registerPartial(name: string, partial: string): void {
    Handlebars.registerPartial(name, partial)
  }
}
