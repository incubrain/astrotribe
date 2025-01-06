// tools/generators/dto/modules/validators.ts
import type { ValidationRule, FieldMetadata, ModelMetadata } from '../core/types'

/**
 * Enhanced ValidationGenerator that infers validation rules from database constraints
 * and generates sophisticated validation decorators for DTOs.
 */
export class ValidationGenerator {
  /**
   * Generates comprehensive validation rules by combining explicit decorators
   * with inferred rules from database constraints.
   */
  async generateValidationRules(model: ModelMetadata): Promise<ValidationRule[]> {
    // Start with basic validation rules
    let rules = await this.getBasicValidationRules(model)

    // Add database constraint validations
    rules = [
      ...rules,
      ...(await this.inferDatabaseConstraints(model)),
      ...(await this.generateCheckConstraints(model)),
      ...(await this.generateUniqueConstraints(model)),
      ...(await this.generateForeignKeyValidation(model)),
      ...(await this.generateCrossFieldValidation(model)),
    ]

    return rules
  }

  /**
   * Generates basic validation rules that apply to all models, independent
   * of database constraints. These rules form the foundation of our validation
   * strategy and are complemented by more specific rules from other sources.
   */
  private async getBasicValidationRules(model: ModelMetadata): Promise<ValidationRule[]> {
    const rules: ValidationRule[] = []

    // Add type-specific validation for each field
    for (const field of model.fields) {
      // Add basic presence validation
      if (field.isRequired) {
        rules.push({
          decorator: 'IsNotEmpty',
          message: `${field.name} is required`,
        })
      } else {
        rules.push({
          decorator: 'IsOptional',
        })
      }

      // Add type-specific validation
      const typeRules = this.getTypeSpecificValidation(field)
      rules.push(...typeRules)

      // Add any explicitly defined validation from documentation
      const docRules = this.parseValidationFromDocumentation(field)
      rules.push(...docRules)
    }

    return rules
  }

  /**
   * Determines specific validation rules based on the field's type.
   * Each type has its own set of appropriate validators to ensure
   * data integrity and type safety.
   */
  private getTypeSpecificValidation(field: FieldMetadata): ValidationRule[] {
    const rules: ValidationRule[] = []

    switch (field.type) {
      case 'string':
        rules.push({
          decorator: 'IsString',
          message: `${field.name} must be a string`,
        })
        break

      case 'number':
        rules.push({
          decorator: 'IsNumber',
          params: [{ allowNaN: false, allowInfinity: false }],
          message: `${field.name} must be a valid number`,
        })
        break

      case 'boolean':
        rules.push({
          decorator: 'IsBoolean',
          message: `${field.name} must be a boolean`,
        })
        break

      case 'Date':
        rules.push({
          decorator: 'IsDate',
          message: `${field.name} must be a valid date`,
        })
        break

      case 'array':
        if (field.isArray) {
          rules.push({
            decorator: 'IsArray',
            message: `${field.name} must be an array`,
          })
          // Add item type validation if specified
          const itemType = field.arrayItemType
          if (itemType) {
            rules.push({
              decorator: 'ArrayItems',
              params: [itemType],
              message: `Each item in ${field.name} must be of type ${itemType}`,
            })
          }
        }
        break
    }

    return rules
  }

  /**
   * Extracts validation rules from field documentation comments.
   * This allows developers to specify additional validation requirements
   * through documentation annotations.
   */
  private parseValidationFromDocumentation(field: FieldMetadata): ValidationRule[] {
    const rules: ValidationRule[] = []
    const docs = field.documentation.description

    // Parse @validate annotations
    const validateMatches = docs.match(/@validate\((.*?)\)/g) || []
    for (const match of validateMatches) {
      const [decorator, ...params] = match
        .replace('@validate(', '')
        .replace(')', '')
        .split(',')
        .map((param) => param.trim())

      rules.push({
        decorator,
        params: params.length ? params : undefined,
      })
    }

    // Parse common validation patterns
    if (docs.includes('@email')) {
      rules.push({
        decorator: 'IsEmail',
        message: `${field.name} must be a valid email address`,
      })
    }

    if (docs.includes('@url')) {
      rules.push({
        decorator: 'IsUrl',
        message: `${field.name} must be a valid URL`,
      })
    }

    // Parse length requirements
    const lengthMatch = docs.match(/@length\((\d+),(\d+)\)/)
    if (lengthMatch) {
      rules.push({
        decorator: 'Length',
        params: [parseInt(lengthMatch[1]), parseInt(lengthMatch[2])],
        message: `${field.name} must be between ${lengthMatch[1]} and ${lengthMatch[2]} characters`,
      })
    }

    return rules
  }

  /**
   * Infers validation rules from PostgreSQL column constraints such as
   * NOT NULL, length constraints, numeric ranges, etc.
   */
  private async inferDatabaseConstraints(model: ModelMetadata): Promise<ValidationRule[]> {
    const rules: ValidationRule[] = []

    for (const field of model.fields) {
      // Get PostgreSQL column metadata from field documentation
      const columnMetadata = this.extractColumnMetadata(field)

      if (columnMetadata.notNull) {
        rules.push({
          decorator: 'IsNotEmpty',
          message: `${field.name} is required`,
        })
      }

      // Handle character varying length constraints
      if (columnMetadata.maxLength) {
        rules.push({
          decorator: 'MaxLength',
          params: [columnMetadata.maxLength],
          message: `${field.name} cannot be longer than ${columnMetadata.maxLength} characters`,
        })
      }

      // Handle numeric precision and scale
      if (columnMetadata.numericPrecision) {
        rules.push({
          decorator: 'IsNumber',
          params: [
            {
              maxDecimalPlaces: columnMetadata.numericScale || 0,
              max: Math.pow(10, columnMetadata.numericPrecision) - 1,
            },
          ],
          message: `${field.name} must be a number with at most ${columnMetadata.numericScale} decimal places`,
        })
      }
    }

    return rules
  }

  /**
   * Generates validation rules from PostgreSQL CHECK constraints.
   * Converts CHECK expressions into class-validator decorators.
   */
  private async generateCheckConstraints(model: ModelMetadata): Promise<ValidationRule[]> {
    const rules: ValidationRule[] = []
    const checkConstraints = this.extractCheckConstraints(model)

    for (const constraint of checkConstraints) {
      const validationRule = this.convertCheckToValidation(constraint)
      if (validationRule) {
        rules.push(validationRule)
      }
    }

    return rules
  }

  /**
   * Converts a PostgreSQL CHECK constraint into a corresponding validation rule.
   * Handles common patterns like range checks, enum values, and regex patterns.
   */
  private convertCheckToValidation(checkConstraint: string): ValidationRule | null {
    // Match common CHECK constraint patterns
    const rangeMatch = checkConstraint.match(/(\w+)\s*(>=|<=|>|<)\s*(\d+)/)
    if (rangeMatch) {
      const [, field, operator, value] = rangeMatch
      return this.createRangeValidation(field, operator, Number(value))
    }

    const enumMatch = checkConstraint.match(/(\w+)\s+IN\s+\((.*?)\)/)
    if (enumMatch) {
      const [, field, values] = enumMatch
      return {
        decorator: 'IsIn',
        params: [values.split(',').map((v) => v.trim().replace(/'/g, ''))],
        message: `${field} must be one of: ${values}`,
      }
    }

    const regexMatch = checkConstraint.match(/(\w+)\s+~\s+'(.*?)'/)
    if (regexMatch) {
      const [, field, pattern] = regexMatch
      return {
        decorator: 'Matches',
        params: [new RegExp(pattern)],
        message: `${field} must match pattern: ${pattern}`,
      }
    }

    return null
  }

  /**
   * Creates range validation rules based on operators found in CHECK constraints.
   */
  private createRangeValidation(field: string, operator: string, value: number): ValidationRule {
    const decoratorMap: Record<string, string> = {
      '>=': 'Min',
      '<=': 'Max',
      '>': 'Min',
      '<': 'Max',
    }

    return {
      decorator: decoratorMap[operator],
      params: [operator.includes('>') ? value : value],
      message: `${field} must be ${operator} ${value}`,
    }
  }

  /**
   * Generates validation rules for composite unique constraints.
   * Creates custom validators that check uniqueness across multiple fields.
   */
  private async generateUniqueConstraints(model: ModelMetadata): Promise<ValidationRule[]> {
    const rules: ValidationRule[] = []
    const uniqueConstraints = this.extractUniqueConstraints(model)

    for (const constraint of uniqueConstraints) {
      if (constraint.fields.length > 1) {
        // Generate composite unique validator
        rules.push({
          decorator: 'ValidateCompositeUnique',
          params: [constraint.fields],
          message: `The combination of (${constraint.fields.join(', ')}) must be unique`,
        })
      }
    }

    return rules
  }

  /**
   * Generates validation rules for foreign key relationships.
   * Ensures referenced entities exist in the database.
   */
  private async generateForeignKeyValidation(model: ModelMetadata): Promise<ValidationRule[]> {
    const rules: ValidationRule[] = []

    for (const relationship of model.relationships) {
      rules.push({
        decorator: 'ValidateExists',
        params: [relationship.foreign.model, relationship.foreign.field],
        message: `Referenced ${relationship.foreign.model} must exist`,
      })
    }

    return rules
  }

  /**
   * Generates sophisticated cross-field validation rules based on
   * business logic and field relationships.
   */
  private async generateCrossFieldValidation(model: ModelMetadata): Promise<ValidationRule[]> {
    const rules: ValidationRule[] = []

    // Example: Date range validation
    const dateFields = model.fields.filter((field) => field.type === 'Date')
    if (dateFields.length >= 2) {
      rules.push({
        decorator: 'ValidateDateRange',
        params: [dateFields.map((f) => f.name)],
        message: 'End date must be after start date',
      })
    }

    // Example: Dependent field validation
    const dependentFields = this.findDependentFields(model)
    for (const { main, dependent } of dependentFields) {
      rules.push({
        decorator: 'ValidateDependent',
        params: [main, dependent],
        message: `${dependent} is required when ${main} is provided`,
      })
    }

    return rules
  }

  /**
   * Helper method to find fields that have dependencies on other fields
   * based on database constraints or documentation.
   */
  private findDependentFields(model: ModelMetadata): Array<{ main: string; dependent: string }> {
    const dependencies: Array<{ main: string; dependent: string }> = []

    for (const field of model.fields) {
      const dependencyMatch = field.documentation.description.match(/@depends-on\s+(\w+)/)
      if (dependencyMatch) {
        dependencies.push({
          main: dependencyMatch[1],
          dependent: field.name,
        })
      }
    }

    return dependencies
  }

  /**
   * Extracts column metadata from field documentation and database schema.
   */
  private extractColumnMetadata(field: FieldMetadata) {
    const metadata = {
      notNull: false,
      maxLength: null,
      numericPrecision: null,
      numericScale: null,
    }

    // Parse field documentation for database constraints
    const lengthMatch = field.documentation.description.match(/@length\((\d+)\)/)
    if (lengthMatch) {
      metadata.maxLength = parseInt(lengthMatch[1])
    }

    const precisionMatch = field.documentation.description.match(/@precision\((\d+),(\d+)\)/)
    if (precisionMatch) {
      metadata.numericPrecision = parseInt(precisionMatch[1])
      metadata.numericScale = parseInt(precisionMatch[2])
    }

    return metadata
  }

  /**
   * Extracts CHECK constraints from model documentation.
   */
  private extractCheckConstraints(model: ModelMetadata): string[] {
    const checkMatch = model.documentation.description.match(/@check\s+{([^}]+)}/)
    if (!checkMatch) return []

    return checkMatch[1]
      .split(';')
      .map((constraint) => constraint.trim())
      .filter(Boolean)
  }

  /**
   * Extracts unique constraints from model documentation.
   */
  private extractUniqueConstraints(model: ModelMetadata): Array<{ fields: string[] }> {
    const uniqueMatch = model.documentation.description.match(/@unique\s+{([^}]+)}/)
    if (!uniqueMatch) return []

    return uniqueMatch[1].split('),').map((constraint) => ({
      fields: constraint
        .replace(/[()]/g, '')
        .split(',')
        .map((field) => field.trim()),
    }))
  }
}
