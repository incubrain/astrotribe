// pipes/type-conversion.pipe.ejs
import { PipeTransform, ArgumentMetadata } from '@nestjs/common'
import { Injectable, BadRequestException } from '@nestjs/common'

@Injectable()
export class TypeConversionPipe implements PipeTransform {
  constructor(private readonly targetType: 'number' | 'boolean' | 'string') {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (value === undefined) return value

    try {
      switch (this.targetType) {
        case 'number':
          return Number(value)
        case 'boolean':
          return value === 'true' || value === '1' || value === true
        case 'string':
          return String(value)
        default:
          return value
      }
    } catch (error: any) {
      throw new BadRequestException(`Type conversion failed: ${error.message}`)
    }
  }
}
