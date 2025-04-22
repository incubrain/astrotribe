// supabase/functions/upsertToZilliz/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { embedData } from './openai.ts'
import { schema } from './schema.ts'
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
  const { operation, record, inputColumns, outputColumn, collection_name } = await req.json()
  if (!inputColumns || !outputColumn || !collection_name) {
    return new Response('Invalid Parameters', {
      status: 500,
    })
  }
  try {
    const columns = inputColumns.split(',')
    if (
      columns.every((column) => record[column]) &&
      (operation == 'INSERT' || operation == 'UPDATE')
    ) {
      upsertToZilliz(collection_name, record, columns, outputColumn)
      return new Response('Uploading to Zilliz', {
        status: 200,
      })
    } else if (operation == 'DELETE') {
      const { collection_name, record } = await req.json()
      deleteFromZilliz(collection_name, [record.id])
      return new Response('Deleting from Zilliz', {
        status: 200,
      })
    } else {
      return new Response(`Error: Wrong Operation ${operation}`, {
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
  }
  // 2. Format your data for Zilliz
  const columns = schema[collection_name]?.map((field) => field.name)
  const payload = {
    collectionName: collection_name,
    data: embedded.map((record) => {
      const temp = {}
      columns.forEach((column) => (temp[column] = record[column]))
      return temp
    }),
  }
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
  }
  const result = await zillizResp.json()
  console.log(`Successfully updated Zilliz ${JSON.stringify(result)}`)
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
    if (err) {
      console.error(`Could not delete ${ids} from Zilliz`, JSON.stringify(err))
    }
  }
  console.log(`Deleted ${ids} from Zilliz`)
}
