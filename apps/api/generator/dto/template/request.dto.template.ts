/**
 * Template for generating request DTOs with appropriate validation
 * and transformation rules for incoming data.
 */
export class RequestDTOTemplate {
    static generate(model: ModelMetadata): string {
      return TemplateSystem.generateDTO(model, {
        useValidation: true,
        useTransformation: true,
        usePipes: true,
        isRequest: true,
        isResponse: false,
        extends: 'BaseRequestDTO'
      })
    }
  }