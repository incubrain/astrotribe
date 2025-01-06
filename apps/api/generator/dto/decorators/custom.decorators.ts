// tools/generators/dto/decorators/custom.decorators.ts
import { TemplateSystem } from '../core/template-system'

/**
 * Registry of custom decorators that can be used in DTO generation.
 * This allows users to extend the system with their own decorators.
 */
export function registerCustomDecorators(): void {
  // Register a custom logging decorator
  TemplateSystem.registerDecorator('Log', {
    importStatement: `import { Log } from '@/decorators/log.decorator'`,
    generate: (params?: string[]) => {
      const level = params?.[0] || 'debug'
      return `@Log('${level}')`
    },
  })

  // Register a custom validation decorator
  TemplateSystem.registerDecorator('ValidateBusinessRule', {
    importStatement: `import { ValidateBusinessRule } from '@/decorators/validation.decorator'`,
    generate: (params?: string[]) => {
      const [ruleName, errorMessage] = params || []
      return `@ValidateBusinessRule('${ruleName}', '${errorMessage}')`
    },
  })

  // Register a custom transformation decorator
  TemplateSystem.registerDecorator('TransformToDTO', {
    importStatement: `import { TransformToDTO } from '@/decorators/transform.decorator'`,
    generate: (params?: string[]) => {
      const dtoName = params?.[0]
      return `@TransformToDTO(${dtoName})`
    },
  })
}
