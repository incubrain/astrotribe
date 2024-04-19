import crypto from 'crypto'

export default defineEventHandler((event) => {
  // !logic:med:easy:1 - add correlation id to each api query and command
  const correlationId = crypto.randomUUID()
  event.node.res.setHeader('X-Correlation-ID', correlationId)
  event.context.correlationId = correlationId
})
