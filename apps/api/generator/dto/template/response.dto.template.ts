import { ModelMetadata } from '../types'

/**
 * Template for generating response DTOs that handle outgoing data
 * with proper serialization and documentation.
 */
export class ResponseDTOTemplate {
  static generate(model: ModelMetadata): string {
    return TemplateSystem.generateDTO(model, {
      useValidation: false,
      useTransformation: true,
      usePipes: false,
      isRequest: false,
      isResponse: true,
      extends: 'BaseResponseDTO',
    })
  }
}
