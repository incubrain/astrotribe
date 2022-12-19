import { createClient } from '@supabase/supabase-js'

const publicClient = () => {
    const cfg = useRuntimeConfig()
    const supaUrl = cfg.public.SUPABASE_URL
    const key = cfg.public.SUPABASE_KEY
    return createClient(supaUrl, key)
}

export default publicClient