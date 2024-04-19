import * as Sentry from '@sentry/browser'

export default defineNuxtPlugin(() => {
  const environment = useRuntimeConfig().public.nodeEnv

  Sentry.init({
    dsn: 'https://eec364410b024a5a837f60e00d367513@o1175094.ingest.sentry.io/4504389151621120',
    integrations: [
      new Sentry.BrowserTracing({
        tracingOrigins: ['localhost', /^\//]
      })
    ],
    // release,
    environment,
    sampleRate: 1,
    tracesSampleRate: 1.0
  })
})
