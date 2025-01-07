// tools/generators/dto/templates/template.helpers.ts
import Handlebars from 'handlebars'
import { TypeMapper } from '../utils/type-mapper'

const typeMapper = new TypeMapper()

export function registerHandlebarsHelpers() {
  // Type mapping helpers
  Handlebars.registerHelper('mapFieldType', (field) => {
    return typeMapper.mapFieldType(field)
  })

  Handlebars.registerHelper('getSwaggerType', (field) => {
    return typeMapper.getSwaggerType(field)
  })

  // Logical operators
  Handlebars.registerHelper('eq', (a, b) => a === b)
  Handlebars.registerHelper('neq', (a, b) => a !== b)
  Handlebars.registerHelper('and', (a, b) => a && b)
  Handlebars.registerHelper('or', (a, b) => a || b)
  Handlebars.registerHelper('not', (a) => !a)

  // String manipulation
  Handlebars.registerHelper('lowercase', (str) => str?.toLowerCase())
  Handlebars.registerHelper('uppercase', (str) => str?.toUpperCase())
  Handlebars.registerHelper('capitalize', (str) => {
    if (!str) return ''
    return str.charAt(0).toUpperCase() + str.slice(1)
  })

  // Array helpers
  Handlebars.registerHelper('join', (arr, separator) => arr?.join(separator))
  Handlebars.registerHelper('length', (arr) => arr?.length || 0)
  Handlebars.registerHelper('first', (arr) => arr?.[0])
  Handlebars.registerHelper('last', (arr) => arr?.[arr.length - 1])

  // Object helpers
  Handlebars.registerHelper('json', (obj) => JSON.stringify(obj, null, 2))
  Handlebars.registerHelper('get', (obj, key) => obj?.[key])
  Handlebars.registerHelper('keys', (obj) => Object.keys(obj || {}))
  Handlebars.registerHelper('values', (obj) => Object.values(obj || {}))

  // Conditional helpers
  Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
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
  Handlebars.registerHelper('date', (date) => {
    if (!date) return ''
    return new Date(date).toISOString()
  })

  Handlebars.registerHelper('formatDate', (date, format) => {
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
