<!-- pages/auth-callback.vue -->
<template>
  <div class="w-full h-full flex justify-center items-center">Authenticating...</div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useSupabaseClient } from '#imports'

const logger = useLogger('auth')
const env = useRuntimeConfig().public

const route = useRoute()
const supabase = useSupabaseClient()

const isProcessing = ref(false)

const handleAuth = async () => {
  if (isProcessing.value) return
  isProcessing.value = true

  const code = route.query.code as string

  if (!code) {
    logger.error('No code found in URL')
    await navigateTo(`${env.authURL}${env.loginURL}`, { external: true })
    return
  }

  try {
    const { data, error } = await supabase.auth.getSession()

    if (error) throw error

    if (data.session) {
      logger.info('Session established:', { session: data.session })
      navigateTo('/')
    } else {
      throw new Error('No session established')
    }
  } catch (error: any) {
    logger.error('Error during authentication:', { error })
    await navigateTo(`${env.authURL}${env.loginURL}`, { external: true })
  } finally {
    isProcessing.value = false
  }
}

onMounted(() => {
  handleAuth()
})
</script>
