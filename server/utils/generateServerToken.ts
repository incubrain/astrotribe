import jwt from 'jsonwebtoken'
import { useRuntimeConfig } from '#imports'

export function generateServerToken() {
  const config = useRuntimeConfig()
  return jwt.sign({ sender: 'AstronEra' }, config.scraperKey, {
    algorithm: 'HS256',
    expiresIn: '1h',
  })
}
