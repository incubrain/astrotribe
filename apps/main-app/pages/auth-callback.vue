// pages/auth-callback.vue
<template>
  <div class="w-full h-full flex justify-center items-center">Authenticating...</div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useSupabaseClient } from '#imports'

const route = useRoute()
const router = useRouter()
const supabase = useSupabaseClient()

const isProcessing = ref(false)

const handleAuth = async () => {
  if (isProcessing.value) return
  isProcessing.value = true

  const code = route.query.code as string

  if (!code) {
    console.error('No code found in URL')
    router.push('/login')
    return
  }

  try {
    const { data, error } = await supabase.auth.getSession()

    if (error) throw error

    if (data.session) {
      console.log('Session established:', data.session)
      router.push('/')
    } else {
      throw new Error('No session established')
    }
  } catch (error) {
    console.error('Error during authentication:', error)
    router.push('/login')
  } finally {
    isProcessing.value = false
  }
}

onMounted(() => {
  handleAuth()
})
</script>
