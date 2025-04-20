// supabase/functions/upsertToZilliz/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { embedData } from './openai.ts'

const milvusEndpoint = Deno.env.get('MILVUS_ENDPOINT')
const milvusUsername = Deno.env.get('MILVUS_USERNAME')
const milvusToken = Deno.env.get('MILVUS_TOKEN')
const milvusId = Deno.env.get('MILVUS_CLUSTER_ID')
Object.entries({
  milvusEndpoint,
  milvusUsername,
  milvusToken,
  milvusId,
}).forEach(([key, value]) => {
  if (!value) {
    console.error(`Error: ${key.toUpperCase()} key not set in environment variables`)
    throw new Error(`${key.toUpperCase()} key not set in environment variables`)
  }
})
serve(async (req) => {
  const { searchParams } = new URL(req.url)
  const { type: operation, record, old_record } = await req.json()
  const inputColumns = searchParams.get('inputColumns').split(',')
  const outputColumn = searchParams.get('outputColumn')
  const collection_name = searchParams.get('collection_name')
  if (!inputColumns || !outputColumn || !collection_name) {
    return new Response('Ignored', {
      status: 200,
    })
  }
  console.log(`Vectorization for id: ${record.id} in ${collection_name}`)
  try {
    if (operation == 'INSERT' && inputColumns.every((column) => record[column])) {
      return await upsertToZilliz(collection_name, record, inputColumns, outputColumn)
    } else if (
      operation == 'UPDATE' &&
      inputColumns.every((column) => record[column]) &&
      inputColumns.some(
        (column) => JSON.stringify(record[column]) !== JSON.stringify(old_record?.[column]),
      )
    ) {
      console.log('Upserting to Zilliz')
      return await upsertToZilliz(collection_name, record, inputColumns, outputColumn)
    } else if (operation == 'DELETE') {
      const { collection_name, ids } = await req.json()
      return await deleteFromZilliz(collection_name, ids)
    } else {
      return new Response('Error: Wrong Path', {
        status: 500,
      })
    }
  } catch (e) {
    return new Response(`Error: ${e.message}`, {
      status: 500,
    })
  }
})
const upsertToZilliz = async (collection_name, records, inputColumns, outputColumn) => {
  const embedded = await embedData([records], {
    inputColumns,
    outputColumn: outputColumn ?? 'vector',
  })
  if (!embedded) {
    console.error('Could not get embeddings')
    return new Response('Could not get embeddings', {
      status: 500,
    })
  }
  // 2. Format your data for Zilliz
  const payload = {
    collectionName: collection_name,
    data: embedded.map((record) => ({
      ...Object.keys(record).reduce(
        (acc, key) => ({
          ...acc,
          [key]: record[key],
        }),
        {},
      ),
    })),
  }
  console.log(JSON.stringify(payload))
  // 3. Send to Zilliz via REST API
  const zillizResp = await fetch(`${milvusEndpoint}/v2/vectordb/entities/upsert`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${milvusToken}`,
      // Optional: Custom headers for your context
      'x-zilliz-username': milvusUsername,
      'x-zilliz-cluster-id': milvusId,
    },
    body: JSON.stringify(payload),
  })
  if (!zillizResp.ok) {
    const err = await zillizResp.text()
    console.error(`Zilliz upsert error: ${JSON.stringify(err)}`)
    return new Response(`Failed to upsert to Zilliz: ${err}`, {
      status: 500,
    })
  }
  const result = await zillizResp.json()
  console.log(`Successfully updated Zilliz ${JSON.stringify(result)}`)
  return new Response(
    JSON.stringify({
      success: true,
      result,
    }),
    {
      status: 200,
    },
  )
}
const deleteFromZilliz = async (collection_name, ids) => {
  const zillizResp = await fetch(`${milvusEndpoint}/v2/vectordb/entities/delete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${milvusToken}`,
      // Optional: Custom headers for your context
      'x-zilliz-username': milvusUsername,
      'x-zilliz-cluster-id': milvusId,
    },
    body: JSON.stringify({
      collection_name,
      filter: `id in [${ids.join(',')}]`,
    }),
  })
  if (!zillizResp.ok) {
    const err = await zillizResp.text()
    return new Response(`Failed to upsert to Zilliz: ${err}`, {
      status: 500,
    })
  }
  const result = await zillizResp.json()
  return new Response(
    JSON.stringify({
      success: true,
      result,
    }),
    {
      status: 200,
    },
  )
}
