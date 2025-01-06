// tools/generators/dto/templates/dto.template.ts
import { ModelMetadata, FieldMetadata, ValidationRule } from '../core/types'

/**
 * DTO Template Generator
 * Responsible for generating the actual DTO class code using a template-based approach.
 * This makes it easier to maintain consistent code generation and modify the output format.
 */
export class DTOTemplate {
  /**
   * Generates a complete DTO class with validation and transformation decorators
   */
  static generate(model: ModelMetadata): string {
    const imports = this.generateImports(model)
    const classDeclaration = this.generateClassDeclaration(model)
    const properties = this.generateProperties(model)
    const methods = this.generateMethods(model)

    return `${imports}

${classDeclaration} {
${properties}

${methods}
}
`
  }

  /**
   * Generates necessary imports based on used features
   */
  private static generateImports(model: ModelMetadata): string {
    const imports = new Set<string>(['import { ApiProperty } from "@nestjs/swagger"'])

    // Add validation imports if needed
    if (model.fields.some((f) => f.validationRules.length > 0)) {
      imports.add('import { IsNotEmpty, IsOptional } from "class-validator"')
    }

    // Add transformation imports if needed
    if (model.fields.some((f) => f.transformationRules.length > 0)) {
      imports.add('import { Transform } from "class-transformer"')
    }

    return Array.from(imports).join('\n')
  }

  /**
   * Generates the class declaration with inheritance if needed
   */
  private static generateClassDeclaration(model: ModelMetadata): string {
    const docs = this.generateClassDocumentation(model.documentation)
    return `${docs}
export class ${model.name}DTO extends BaseDTO`
  }

  /**
   * Generates properties with decorators for validation and documentation
   */
  private static generateProperties(model: ModelMetadata): string {
    return model.fields.map((field) => this.generateField(field)).join('\n\n')
  }

  /**
   * Generates a single field with all necessary decorators
   */
  private static generateField(field: FieldMetadata): string {
    const decorators = [
      this.generateApiPropertyDecorator(field),
      ...this.generateValidationDecorators(field.validationRules),
      ...this.generateTransformationDecorators(field.transformationRules),
    ]

    return `  ${decorators.join('\n  ')}
  ${field.name}${field.isRequired ? '' : '?'}: ${field.type};`
  }

  // ... Additional helper methods for specific template components
}
