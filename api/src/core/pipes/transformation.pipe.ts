// pipes/transformation.pipe.ejs
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class TransformationPipe implements PipeTransform {
  constructor(private readonly transformFn: (value: any) => any) {}

  transform(value: any, metadata: ArgumentMetadata) {
    return this.transformFn(value);
  }
}
