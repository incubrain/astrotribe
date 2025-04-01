// Debug script to check runtime config loading
import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { devPortMap } from './shared/paths.config'

// Load environment variables
config()

// Check if environment variables are loaded
console.log('Environment variables loaded:')
console.log('NUXT_PUBLIC_SUPABASE_URL:', process.env.NUXT_PUBLIC_SUPABASE_URL)
console.log('NUXT_PUBLIC_SUPABASE_KEY:', process.env.NUXT_PUBLIC_SUPABASE_KEY)

// Check the import of shared runtime config
try {
  const { sharedRuntimeConfig } = require('./shared/runtime.config')
  console.log('Shared runtime config loaded successfully')
  console.log('Runtime config content:', JSON.stringify(sharedRuntimeConfig, null, 2))
} catch (error: any) {
  console.error('Error loading shared runtime config:', error)
}

// Check if defineNuxtConfig is defined
try {
  console.log('Checking if defineNuxtConfig is available...')
  // This will fail because defineNuxtConfig is only available in Nuxt context
  // Just checking to see the error
} catch (error: any) {
  console.error('Error with defineNuxtConfig:', error)
}
