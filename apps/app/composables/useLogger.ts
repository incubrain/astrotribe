export function useLogger(prefix?: string) {
  const prefixStr = prefix ? `[${prefix}]` : ''
  return {
    log: (message: string, ...optionalParams: any[]) => console.log(`${prefixStr} ${message}`, ...optionalParams),
    warn: (message: string, ...optionalParams: any[]) => console.warn(`${prefixStr} ${message}`, ...optionalParams),
    error: (message: string, ...optionalParams: any[]) => console.error(`${prefixStr} ${message}`, ...optionalParams),
    info: (message: string, ...optionalParams: any[]) => console.info(`${prefixStr} ${message}`, ...optionalParams),
    debug: (message: string, ...optionalParams: any[]) => console.debug(`${prefixStr} ${message}`, ...optionalParams),
  }
}
