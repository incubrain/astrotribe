// src/core/decorators/public.decorator.ts
import { SetMetadata } from '@nestjs/common'

export const IS_PUBLIC_KEY = 'isPublic'
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)
