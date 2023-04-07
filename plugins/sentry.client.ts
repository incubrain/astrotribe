import * as Sentry from '@sentry/browser'
import { Integrations } from '@sentry/tracing'

export default defineNuxtPlugin((nuxtApp) => {
  Sentry.init({
    dsn: 'https://eec364410b024a5a837f60e00d367513@o1175094.ingest.sentry.io/4504389151621120',
    integrations: [
      new Integrations.BrowserTracing({
        tracingOrigins: ['localhost', /^\//]
      })
    ],
    // release,
    // environment,
    // sampleRate: 1,
    tracesSampleRate: 1.0
  })
})
