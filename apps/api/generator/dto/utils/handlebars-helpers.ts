import { TypeMapper } from './type-mapper'
import { TemplateEngine } from './template-engine'

interface HandlebarsContext {
  [key: string]: any
}

/**
 * Registers all Handlebars helpers needed for the DTO generator
 */
export function registerHandlebarsHelpers(): void {
  const typeMapper = new TypeMapper()

  // Helper for mapping Prisma types to TypeScript types
  TemplateEngine.registerHelper('mapType', (type: string) => {
    return typeMapper.mapType(type)
  })

  // Helper for mapping Prisma types to Zod types
  TemplateEngine.registerHelper('mapToZodType', (type: string) => {
    return typeMapper.mapToZodType(type)
  })

  // Helper for checking if a value is truthy
  TemplateEngine.registerHelper(
    'if',
    function (this: HandlebarsContext, conditional: any, options: any) {
      if (conditional) {
        return options.fn(this)
      } else {
        return options.inverse(this)
      }
    },
  )

  // Helper for checking if a value is falsy
  TemplateEngine.registerHelper(
    'unless',
    function (this: HandlebarsContext, conditional: any, options: any) {
      if (!conditional) {
        return options.fn(this)
      } else {
        return options.inverse(this)
      }
    },
  )

  // Helper for iterating over arrays
  TemplateEngine.registerHelper(
    'each',
    function (this: HandlebarsContext, context: any, options: any) {
      if (!context || context.length === 0) {
        return options.inverse(this)
      }

      return context.map((item: any) => options.fn(item)).join('')
    },
  )
}
