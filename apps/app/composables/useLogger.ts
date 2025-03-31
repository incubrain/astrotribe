export function useLogger() {
  return {
    log: (message: string, ...optionalParams: any[]) => console.log(message, ...optionalParams),
    warn: (message: string, ...optionalParams: any[]) => console.warn(message, ...optionalParams),
    error: (message: string, ...optionalParams: any[]) => console.error(message, ...optionalParams),
    info: (message: string, ...optionalParams: any[]) => console.info(message, ...optionalParams),
  }
}
