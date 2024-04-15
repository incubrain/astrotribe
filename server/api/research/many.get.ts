import { ResearchRepository } from '~/server/utils/research/research.repository'

export default defineEventHandler(async (event) => {
  const { from, to, shape, filter } = await readBody(event)

  // if (!category) {
  //   throw createError({ message: 'No research category provided' })
  // }

  try {
    const client = new ResearchRepository()
    const research = await client.selectResearchCards({
      shape,
      options: {
        pagination: { from: Number(from), to: Number(to) },
        single: false,
        filter
      }
    })

    return {
      status: 200,
      message: 'Research retrieved from supabase',
      data: research
    }
  } catch (error: any) {
    console.error('get-research error', error.message)
    return {
      status: 500,
      message: 'Error retrieving research',
      dataa: null,
      error
    }
  }
})
