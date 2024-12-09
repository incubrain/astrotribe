// plugins/ads.ts
export default defineNuxtPlugin(async () => {
  const adsStore = useAdsStore()

  // Initialize the ads store
  await adsStore.initialize()
})
