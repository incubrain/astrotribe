import OpenAI from 'openai'
import openaiClient from './openaiClient'
// import { z } from 'zod'

const openai = new OpenAI()

export async function generateEmbedding(inputText: string) {
  const embedding = await openai.embeddings.create({
    model: 'text-embedding-3-small', // 62,500 pages per dollar
    input: inputText,
    encoding_format: 'float'
  })
  
  // console.log(embedding)
  return embedding
  // 1 May 24 Mac
  // returns
  // {
  //   "object": "list",
  //   "data": [
  //     {
  //       "object": "embedding",
  //       "index": 0,
  //       "embedding": [
  //         -0.006929283495992422,
  //         -0.005336422007530928,
  //         ... (omitted for spacing)
  //         -4.547132266452536e-05,
  //         -0.024047505110502243
  //       ],
  //     }
  //   ],
  //   "model": "text-embedding-3-small",
  //   "usage": {
  //     "prompt_tokens": 5,
  //     "total_tokens": 5
  //   }
  // }
}




