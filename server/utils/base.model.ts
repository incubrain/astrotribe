import { ZodSchema, ZodError } from 'zod'
import { logger } from './base.logger'

export abstract class BaseModel {
  private logger
  constructor(modelName: string, schema: ZodSchema, data: any) {
    this.logger = logger.child(modelName)

    try {
      this.logger.debug(`Parsing ${modelName}`)
      console.log('data', data)
      const parsedData = schema.parse(data)
      console.log('parseFinished', parsedData)

      this.logger.debug(`Initializing ${modelName}`)
      this.initializeRequiredFields(parsedData)
      this.initializeOptionalFields(parsedData)
      this.initializeComplexObjects(parsedData)
    } catch (error) {
      if (error instanceof ZodError) {
        this.logger.error(`Validation failed: ${JSON.stringify(error.errors)}`)
        throw createError({
          message: `Validation failed for ${modelName}: ${JSON.stringify(error.errors)}`
        })
      }

      this.logger.error('Unexpected error:', error)
      throw createError({ message: `Unexpected error during ${modelName} initialization` })
    }
  }

  protected abstract initializeRequiredFields(parsedData: any): void
  protected abstract initializeOptionalFields(parsedData: any): void
  protected abstract initializeComplexObjects(parsedData: any): void
}
