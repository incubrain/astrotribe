import { ref, Ref } from 'vue'
import { defineStore } from 'pinia'
import { useLogger, useErrorHandler, AppError, ErrorType, ErrorSeverity } from '@ib/client'
import { useHttpHandler } from './lib/http-handler'
import { getOrCreateStore } from './lib/main.store'
import { useRateLimit } from './lib/rate-limit'
import { DomainKey } from './lib/pagination.store'

declare global {
  const ref: typeof ref
  type Ref<T> = Ref<T>
  const useLogger: typeof useLogger
  const useErrorHandler: typeof useErrorHandler
  type AppError = AppError
  type ErrorType = ErrorType
  type ErrorSeverity = ErrorSeverity
  const useHttpHandler: typeof useHttpHandler
  const getOrCreateStore: typeof getOrCreateStore
  const useRateLimit: typeof useRateLimit
  type DomainKey = DomainKey
  const defineStore: typeof defineStore
}
