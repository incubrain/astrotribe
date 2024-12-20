// pipes/transformation.pipe.ejs
import { PipeTransform, ArgumentMetadata } from '@nestjs/common'
import { Injectable } from '@nestjs/common'

@Injectable()
export class TransformationPipe implements PipeTransform {
  constructor(private readonly transformFn: (value: any) => any) {}

  transform(value: any, metadata: ArgumentMetadata) {
    return this.transformFn(value)
  }
}
