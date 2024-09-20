// import { useUpdateData } from "~/composables/ib/update.ib";

import { serverSupabaseClient} from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
  console.log('update user endpoint fired')
  return {
    error: null,
    data: [],
    status: 200,
    message: 'User fetched',
  }
} catch (e) { return { error: e}}
})
