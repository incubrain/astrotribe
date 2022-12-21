import { createClient } from '@supabase/supabase-js'

const client = ref({
    public: undefined,
    admin: null,
})

export default function useClient() {
    const cfg = useRuntimeConfig()
    
    const initiatePublicClient = () => {
        const supaUrl = cfg.public.SUPABASE_URL
        const key = cfg.public.SUPABASE_KEY
        if (client.value.public !== undefined) return
        console.log('initiate public client')
        client.value.public = createClient(supaUrl, key)
    }


    const adminClient = () => {
        const serviceKey = cfg.SUPABASE_SERVICE_KEY
        const url = 'http://localhost:3000/'
        client.value.admin = createClient(url, serviceKey)
    }

    return {
        initiatePublicClient,
        client: {
            public: client.value.public,
            admin: client.value.admin
        },
    }
}
