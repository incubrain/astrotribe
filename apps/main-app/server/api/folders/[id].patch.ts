import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event: H3Event) => {
  const user = await serverSupabaseUser(event)

  if (!user) {
    return createError({
      status: 401,
      message: 'Unauthorized',
    })
  }
  
  const supabase = await serverSupabaseClient(event)

  const id = event.context.params.id
  const updates = await readBody(event)

  // Handle default folder changes
  if (updates.is_default) {
    await supabase
      .from('bookmark_folders')
      .update({ is_default: false })
      .eq('user_id', user.id)
      .eq('is_default', true)
  }

  // Update path if parent changed
  if (updates.parent_id !== undefined) {
    const folder = await supabase.from('bookmark_folders').select('name').eq('id', id).single()

    let newPath = folder.name.toLowerCase().replace(/\s+/g, '_')
    if (updates.parent_id) {
      const parent = await supabase
        .from('bookmark_folders')
        .select('path')
        .eq('id', updates.parent_id)
        .single()
      newPath = `${parent.path}.${newPath}`
    }
    updates.path = newPath
  }

  return await supabase
    .from('bookmark_folders')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()
})
