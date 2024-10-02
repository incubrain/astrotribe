import { createConsola } from 'consola'

export const useLogger = (tag = '') => {
  const logLevel = 10
  const logger = createConsola({
    level: logLevel,
  }).withTag(tag.toUpperCase())

  return logger
}
