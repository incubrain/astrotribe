import { ZodSchema, ZodError } from 'zod'

export abstract class BaseModel {
  private log
  constructor(modelName: string, schema: ZodSchema, data: any) {
    this.log = useServerLogger(modelName)

    try {
      this.log.debug(`Parsing ${modelName}`)
      console.log('data', data)
      const parsedData = schema.parse(data)
      console.log('parseFinished', parsedData)

      this.log.debug(`Initializing ${modelName}`)
      this.initializeRequiredFields(parsedData)
      this.initializeOptionalFields(parsedData)
      this.initializeComplexObjects(parsedData)
    } catch (error) {
      if (error instanceof ZodError) {
        this.log.error(`Validation failed: ${JSON.stringify(error.errors)}`)
        throw createError({
          message: `Validation failed for ${modelName}: ${JSON.stringify(error.errors)}`
        })
      }

      this.log.error('Unexpected error:', error)
      throw createError({ message: `Unexpected error during ${modelName} initialization` })
    }
  }

  protected abstract initializeRequiredFields(parsedData: any): void
  protected abstract initializeOptionalFields(parsedData: any): void
  protected abstract initializeComplexObjects(parsedData: any): void
}
