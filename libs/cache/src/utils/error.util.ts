// src/utils/error.util.ts
export class CacheError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public override readonly cause?: Error,
  ) {
    super(message)
    this.name = 'CacheError'
  }
}

export class ConnectionError extends CacheError {
  constructor(message: string, cause?: Error) {
    super(message, 'CACHE_CONNECTION_ERROR', cause)
    this.name = 'ConnectionError'
  }
}

export class OperationError extends CacheError {
  constructor(message: string, cause?: Error) {
    super(message, 'CACHE_OPERATION_ERROR', cause)
    this.name = 'OperationError'
  }
}
