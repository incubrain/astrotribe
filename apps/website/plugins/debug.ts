// plugins/debug.ts
export default defineNuxtPlugin((nuxtApp) => {
  // Log all hook executions
  nuxtApp.hooks.hook('app:created', () => {
    console.log('🔍 [Debug] app:created hook fired')
  })

  nuxtApp.hooks.hook('app:beforeMount', () => {
    console.log('🔍 [Debug] app:beforeMount hook fired')
  })

  nuxtApp.hooks.hook('page:start', () => {
    console.log('🔍 [Debug] page:start hook fired')
  })

  nuxtApp.hooks.hook('page:finish', () => {
    console.log('🔍 [Debug] page:finish hook fired')
  })

  nuxtApp.hooks.hook('app:error', (err) => {
    console.log('🚨 [Debug] app:error hook fired:', err)
  })

  // Log vue instance state
  console.log('🔍 [Debug] Plugin execution context:', {
    vueApp: !!nuxtApp.vueApp,
    isHydrating: nuxtApp.isHydrating,
    payload: nuxtApp.payload,
  })
})
