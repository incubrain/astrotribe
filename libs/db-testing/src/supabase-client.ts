// db-testing/src/supabaseClient.ts
import path from 'path'
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// Resolve the path relative to the project root
const __dirname = path.dirname(new URL(import.meta.url).pathname)
const envPath = path.resolve(__dirname, '../../../.env')
config({ path: envPath })

// Replace with your Supabase URL and Anon Key
const SUPABASE_URL = process.env.NUXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NUXT_SUPABASE_SERVICE_KEY

console.log('ENVS', SUPABASE_ANON_KEY, SUPABASE_URL)

export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
