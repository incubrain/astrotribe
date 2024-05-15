import { useJwt } from '@vueuse/integrations/useJwt'

export default defineTask({
  meta: {
    name: 'generate:embedding',
    description: `Generate Text Embeddings of these tables:
    [
      news,
    ]`
  },
  run({ payload }) {

    const env = useRuntimeConfig().supabaseServiceKey;
    const { payload: jwtPayload } = useJwt({ env });

    $fetch('/api/admin/generate-embedding')
    return payload
  }
})
