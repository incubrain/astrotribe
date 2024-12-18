// pipes/validation.pipe.ts
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from "@nestjs/common";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { CustomLogger } from "@core/logger/custom.logger";

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  constructor(private logger: CustomLogger) {
    this.logger.setContext("ValidationPipe");
  }

  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToInstance(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      this.logger.warn(`Validation failed: ${JSON.stringify(errors)}`);
      throw new BadRequestException("Validation failed");
    }

    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
