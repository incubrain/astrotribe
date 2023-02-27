import { createClient } from '@supabase/supabase-js'
import { Database } from '../../types/schema'


const publicClient = () => {
    const cfg = useRuntimeConfig()
    const supaUrl = cfg.public.SUPABASE_URL
    const key = cfg.public.SUPABASE_KEY
    return createClient<Database>(supaUrl, key)
}

export default publicClient