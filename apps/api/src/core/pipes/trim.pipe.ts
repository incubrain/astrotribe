// pipes/trim.pipe.ejs
import type { PipeTransform, ArgumentMetadata } from '@nestjs/common'
import { Injectable } from '@nestjs/common'

@Injectable()
export class TrimPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value) return value

    if (typeof value === 'string') {
      return value.trim()
    }

    if (Array.isArray(value)) {
      return value.map((item) => (typeof item === 'string' ? item.trim() : item))
    }

    if (typeof value === 'object') {
      return Object.keys(value).reduce(
        (acc, key) => ({
          ...acc,
          [key]: typeof value[key] === 'string' ? value[key].trim() : value[key],
        }),
        {},
      )
    }

    return value
  }
}
