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
serve(async (req: any) => {
  const { operation, record, inputColumns, outputColumn, collection_name } = await req.json()
  if (!inputColumns || !outputColumn || !collection_name) {
    return new Response('Ignored', {
      status: 200,
    })
  }
  try {
    const columns = inputColumns.split(',')
    if (operation == 'INSERT' && columns.every((column: any) => record[column])) {
      return await upsertToZilliz(collection_name, record, columns, outputColumn)
    } else if (operation == 'UPDATE' && columns.every((column: any) => record[column])) {
      console.log('PUBLISHED_AT', record.published_at)
      return await upsertToZilliz(collection_name, record, columns, outputColumn)
    } else if (operation == 'DELETE') {
      const { collection_name, record } = await req.json()
      return await deleteFromZilliz(collection_name, [record.id])
    } else {
      return new Response(`Error: Wrong Path`, {
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
  console.log('UPSERTING TO ZILLIZ')
  const embedded = await embedData([records], {
    inputColumns,
    outputColumn: outputColumn ?? 'vector',
  })
  if (!embedded) {
    console.error('Could not get embeddings')
    return new Response(`Could not get embeddings`, {
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
