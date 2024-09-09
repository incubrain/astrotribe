import type { ZodSchema } from 'zod'
import type { AllDTOKey } from './base.interface'

type DTODefinition<T> = {
  name: AllDTOKey
  schema: ZodSchema<T>
}

type InputDTO = {
  data: any
  dto: AllDTOKey
}

export class BaseDTO<T> {
  protected dtos: DTODefinition<T>[]
  protected log = useServerLogger('BaseDTO')

  constructor(dtos: DTODefinition<T>[]) {
    this.dtos = dtos
  }

  private getSchema(dtoName: AllDTOKey): ZodSchema<T> | undefined {
    const dto = this.dtos.find((d) => d.name === dtoName)
    this.log.info(`Retrieved DTO schema for: ${dto?.name}`)
    return dto?.schema
  }

  validateAndFormatData(input: InputDTO): any {
    const schema = this.getSchema(input.dto)

    if (!schema) {
      this.log.error(`DTO schema not found for: ${input.dto}`)
      return null
    }

    try {
      if (Array.isArray(input.data)) {
        return input.data.map((item: T) => schema.parse(item))
      }

      this.log.info('parsing single DTO', input.dto)
      return schema.parse(input.data)
    }
    catch (error) {
      this.log.error(`Error parsing data for: ${input.dto} - ${error}`)
      return null
    }
  }

  getAllDTOs(): DTODefinition<T>[] {
    return this.dtos
  }
}

// !infra:high:hard:4 how are we going to handle multiple tablenames, for example the table and a view
