
      export function createValidationError(
        property: string,
        constraint: string,
        message: string
      ): ValidationError {
        return {
          property,
          constraints: { [constraint]: message }
        }
      }

      export function isValidationError(error: unknown): error is ValidationError {
        return (
          typeof error === 'object' &&
          error !== null &&
          'property' in error &&
          'constraints' in error &&
          typeof (error as any).property === 'string' &&
          typeof (error as any).constraints === 'object'
        )
      }
    