// tools/generators/dto/modules/validators.ts
import { TemplateEngine } from '../templates/template.engine'
import type {
  ValidationRule,
  ModelMetadata,
  FieldMetadata,
  ValidationRuleDefinition,
} from '../types'

/**
 * Enhanced ValidationGenerator that infers validation rules from database constraints
 * and generates sophisticated validation decorators for DTOs.
 */
export class ValidationGenerator {
  /**
   * Generates comprehensive validation rules by combining explicit decorators
   * with inferred rules from database constraints
   */
  async generateValidationRules(model: ModelMetadata): Promise<ValidationRule[]> {
    const context = {
      model,
      fields: await this.processFields(model.fields),
      customRules: await this.generateCustomRules(model),
      crossFieldRules: await this.generateCrossFieldRules(model),
      isView: model.isView,
    }

    const content = TemplateEngine.process('schema/validation', context)
    const rules = await this.parseValidationContent(content)

    return [
      ...rules,
      ...(await this.inferDatabaseConstraints(model)),
      ...(await this.generateCheckConstraints(model)),
      ...(await this.generateUniqueConstraints(model)),
      ...(await this.generateForeignKeyValidation(model)),
    ]
  }

  /**
   * Parse validation content into validation rules
   */
  private async parseValidationContent(content: string): Promise<ValidationRule[]> {
    const rules: ValidationRule[] = []
    const lines = content.split('\n')

    for (const line of lines) {
      const match = line.match(/@Validate\((.*?)\)/)
      if (match) {
        const [decorator, ...params] = match[1].split(',').map((p) => p.trim())
        rules.push({
          decorator,
          params,
          message: `${decorator} validation failed`,
        })
      }
    }

    return rules
  }

  /**
   * Process fields to determine their validation requirements
   */
  private async processFields(fields: FieldMetadata[]): Promise<any[]> {
    return fields.map((field) => ({
      ...field,
      validations: this.getFieldValidations(field),
      constraints: this.extractConstraints(field),
      documentation: field.documentation,
    }))
  }

  /**
   * Get validation rules for a field based on its type and metadata
   */
  private getFieldValidations(field: FieldMetadata): ValidationRuleDefinition[] {
    const rules: ValidationRuleDefinition[] = []

    // Required validation
    if (field.isRequired) {
      rules.push({
        name: 'required',
        decorator: 'IsNotEmpty',
        message: `${field.name} is required`,
      })
    }

    // Type-specific validation
    switch (field.type.toLowerCase()) {
      case 'string':
        rules.push({
          name: 'string',
          decorator: 'IsString',
          message: `${field.name} must be a string`,
        })
        break
      case 'number':
      case 'int':
      case 'float':
        rules.push({
          name: 'number',
          decorator: 'IsNumber',
          message: `${field.name} must be a number`,
        })
        break
      case 'boolean':
        rules.push({
          name: 'boolean',
          decorator: 'IsBoolean',
          message: `${field.name} must be a boolean`,
        })
        break
      case 'date':
      case 'datetime':
        rules.push({
          name: 'date',
          decorator: 'IsDate',
          message: `${field.name} must be a valid date`,
        })
        break
    }

    // Add additional validations from documentation
    this.addValidationsFromDocs(field, rules)

    return rules
  }

  /**
   * Extract validations from field documentation
   */
  private addValidationsFromDocs(field: FieldMetadata, rules: ValidationRuleDefinition[]): void {
    const docs = field.documentation?.description || ''

    // Email validation
    if (docs.includes('@email')) {
      rules.push({
        name: 'email',
        decorator: 'IsEmail',
        message: `${field.name} must be a valid email address`,
      })
    }

    // Length validation
    const lengthMatch = docs.match(/@length\((\d+),(\d+)\)/)
    if (lengthMatch) {
      rules.push({
        name: 'length',
        decorator: 'Length',
        parameters: [lengthMatch[1], lengthMatch[2]],
        message: `${field.name} must be between ${lengthMatch[1]} and ${lengthMatch[2]} characters`,
      })
    }

    // Custom validations
    const validateMatches = docs.matchAll(/@validate\((.*?)\)/g)
    for (const match of validateMatches) {
      const [decorator, ...params] = match[1].split(',').map((p) => p.trim())
      rules.push({
        name: decorator.toLowerCase(),
        decorator,
        parameters: params.length ? params : undefined,
        message: `${field.name} failed ${decorator} validation`,
      })
    }
  }

  /**
   * Extract database constraints from field metadata
   */
  private extractConstraints(field: FieldMetadata): any {
    const constraints: any = {}
    const docs = field.documentation?.description || ''

    // Extract length constraints
    const lengthMatch = docs.match(/@length\((\d+)\)/)
    if (lengthMatch) {
      constraints.maxLength = parseInt(lengthMatch[1])
    }

    // Extract numeric precision
    const precisionMatch = docs.match(/@precision\((\d+),(\d+)\)/)
    if (precisionMatch) {
      constraints.numericPrecision = parseInt(precisionMatch[1])
      constraints.numericScale = parseInt(precisionMatch[2])
    }

    return constraints
  }

  /**
   * Generate custom validation rules for the model
   */
  private async generateCustomRules(model: ModelMetadata): Promise<ValidationRuleDefinition[]> {
    const rules: ValidationRuleDefinition[] = []

    if (model.isView) {
      rules.push({
        name: 'view',
        decorator: 'IsViewDTO',
        message: `This DTO represents a view: ${model.name}`,
      })

      // Add computed column validations
      model.viewMetadata?.computedColumns.forEach((column) => {
        rules.push({
          name: 'computed',
          decorator: 'IsComputed',
          parameters: [column.name],
          message: `${column.name} is a computed field`,
        })
      })
    }

    return rules
  }

  /**
   * Generate validation rules for relationships between fields
   */
  private async generateCrossFieldRules(model: ModelMetadata): Promise<ValidationRuleDefinition[]> {
    const rules: ValidationRuleDefinition[] = []

    // Date range validation
    const dateFields = model.fields.filter(
      (field) => field.type.toLowerCase() === 'date' || field.type.toLowerCase() === 'datetime',
    )

    if (dateFields.length >= 2) {
      rules.push({
        name: 'dateRange',
        decorator: 'ValidateDateRange',
        parameters: [dateFields.map((f) => f.name)],
        message: 'End date must be after start date',
      })
    }

    // Dependent field validation
    const dependentFields = this.findDependentFields(model)
    for (const { main, dependent } of dependentFields) {
      rules.push({
        name: 'dependent',
        decorator: 'ValidateDependent',
        parameters: [main, dependent],
        message: `${dependent} is required when ${main} is provided`,
      })
    }

    return rules
  }

  /**
   * Find fields that have dependencies on other fields
   */
  private findDependentFields(model: ModelMetadata): Array<{ main: string; dependent: string }> {
    const dependencies: Array<{ main: string; dependent: string }> = []

    model.fields.forEach((field) => {
      const dependencyMatch = field.documentation?.description.match(/@depends-on\s+(\w+)/)
      if (dependencyMatch) {
        dependencies.push({
          main: dependencyMatch[1],
          dependent: field.name,
        })
      }
    })

    return dependencies
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

    for (const relationship of model.relations) {
      rules.push({
        decorator: 'ValidateExists',
        params: [relationship.foreign.model, relationship.foreign.field],
        message: `Referenced ${relationship.foreign.model} must exist`,
      })
    }

    return rules
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
