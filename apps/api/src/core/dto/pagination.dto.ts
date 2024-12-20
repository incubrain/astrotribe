import { IsOptional, IsNumber, IsString } from 'class-validator'
import { Type } from 'class-transformer'

export class PaginationParams {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number = 1

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number = 10

  @IsOptional()
  @IsString()
  sort?: string

  @IsOptional()
  @IsString()
  search?: string

  @IsOptional()
  @IsString()
  order?: string

  @IsOptional()
  @IsString()
  include?: Record<string, boolean>
}
