// server/middleware/telemetry.ts
import { NodeSDK } from '@opentelemetry/sdk-node'
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { defineEventHandler } from 'h3'
import { trace, context, SpanStatusCode } from '@opentelemetry/api'

let isInitialized = false

export default defineEventHandler(async (event) => {
  if (!isInitialized && process.env.NODE_ENV === 'production') {
    const sdk = new NodeSDK({
      serviceName: process.env.OTEL_SERVICE_NAME || 'nuxt-proxy',
      instrumentations: [
        getNodeAutoInstrumentations({
          '@opentelemetry/instrumentation-http': {
            enabled: true,
            ignoreIncomingRequestHook: (req) => req.url === '/api/health',
          },
        }),
      ],
      traceExporter: new OTLPTraceExporter({
        url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://tempo:4318/v1/traces',
      }),
    })

    await sdk.start()
    isInitialized = true

    process.on('SIGTERM', () => {
      sdk.shutdown().catch((error) => console.error('Error shutting down OpenTelemetry', error))
    })
  }
})
