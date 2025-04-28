import type { Pool } from 'pg'

export async function createVaultSecrets(client: Pool): Promise<boolean> {
  try {
    console.log('Creating vault secrets...')

    const secrets = [
      {
        secret:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU',
        name: 'service_key',
        description: 'supabase_service_key, used for JWT auth in edge functions',
      },
      {
        secret: 'http://host.docker.internal:54321/functions/v1/openai',
        name: 'edge_url_openai',
        description: 'supabase edge function url for zilliz',
      },
      {
        secret: 'http://host.docker.internal:54321/functions/v1/zilliz',
        name: 'edge_url_zilliz',
        description: 'supabase edge function url for openai',
      },
      {
        secret: 'http://host.docker.internal:4111/webhooks',
        name: 'webhook_mastra_agents',
        description: 'mastra dynamic webhook endpoint',
      },
    ]

    for (const { secret, name, description } of secrets) {
      const query = `
                SELECT vault.create_secret('${secret}', '${name}', '${description}');
            `
      await client.query(query)
      console.log(`✓ Created secret: ${name}`)
    }
    console.log('✓ All secrets created successfully')
    return true
  } catch (error) {
    console.error('Error creating vault secrets:', error)
    return false
  }
}
