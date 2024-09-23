import * as Sentry from '@sentry/vue'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  const app = nuxtApp.vueApp
  const router = useRouter()

  Sentry.init({
    app,
    dsn: 'https://eec364410b024a5a837f60e00d367513@o1175094.ingest.sentry.io/4504389151621120',
    integrations: [Sentry.browserTracingIntegration({ router }), Sentry.replayIntegration()],
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.2 : 1.0,
    tracePropagationTargets: ['localhost', /^https:\/\/yourserver\.io\/api/],
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    attachProps: true,
    trackComponents: true,
  })

  Sentry.setUser(useSupabaseUser())
  Sentry.setTag('environment', process.env.NODE_ENV)
})
