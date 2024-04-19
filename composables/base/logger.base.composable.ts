import { createConsola } from 'consola'

export const useLogger = (tag = '') => {
  const { logLevel } = useRuntimeConfig().public

  console.log('logLevel', logLevel)
  const logger = createConsola({
    level: parseInt(logLevel, 10)
  }).withTag(tag.toUpperCase())

  return logger
}
