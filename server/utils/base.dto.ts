import { ZodSchema } from 'zod'
import { AllDTOKey } from './base.interface'
import { logger } from './logger'

type DTODefinition<T> = {
  name: AllDTOKey
  schema: ZodSchema<T>
  select: string
}

type InputDTO = {
  data: any
  dto: AllDTOKey
}

export class BaseDTO<T> {
  protected dtos: DTODefinition<T>[]
  protected logger = logger.child({ loggerPrefix: 'BaseDTO' })

  constructor(dtos: DTODefinition<T>[]) {
    this.dtos = dtos
  }

  private getSchema(dtoName: AllDTOKey): ZodSchema<T> | undefined {
    const dto = this.dtos.find((d) => d.name === dtoName)
    this.logger.info(`Retrieved DTO schema for: ${dto?.name}`)
    return dto?.schema
  }

  getSelect(dtoName: AllDTOKey): string {
    const dto = this.dtos.find((d) => d.name === dtoName)

    if (!dto) {
      this.logger.error(`DTO not found for: ${dtoName}`)
      return ''
    }

    if (!dto.select) {
      this.logger.error(`Select not found for: ${dtoName}`)
      return ''
    }
    return dto?.select
  }

  validateAndFormatData(input: InputDTO): any {
    const schema = this.getSchema(input.dto)

    if (!schema) {
      this.logger.error(`DTO schema not found for: ${input.dto}`)
      return null
    }

    try {
      if (Array.isArray(input.data)) {
        return input.data.map((item: T) => schema.parse(item))
      }

      this.logger.info('parsing single DTO', input.dto)
      return schema.parse(input.data)
    } catch (error) {
      this.logger.error(`Error parsing data for: ${input.dto} - ${error}`)
      return null
    }
  }

  getAllDTOs(): DTODefinition<T>[] {
    return this.dtos
  }
}