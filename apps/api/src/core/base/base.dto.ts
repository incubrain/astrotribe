// core/base/base.dto.ts
import { ApiProperty } from '@nestjs/swagger'

export class BaseEntityDto {
  @ApiProperty({ format: 'uuid' })
  id: string

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date
}
