// composables/useTodaysPosts.ts
export function useTodaysPosts(filters?: {
  categories?: Array<{ id: number }>
  sources?: Array<{ id: number }>
}) {
  const todaysPosts = ref(0)
  const hasInitialized = ref(false)
  const supabase = useSupabaseClient()

  const fetchTodaysPosts = async () => {
    // Skip if we've already initialized
    if (hasInitialized.value) return

    const now = new Date()
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const endOfDay = new Date(startOfDay)
    endOfDay.setDate(startOfDay.getDate() + 1)

    const startISO = startOfDay.toISOString()
    const endISO = endOfDay.toISOString()

    let query = supabase
      .from('news')
      .select('id', { count: 'exact', head: true })
      .gte('published_at', startISO)
      .lt('published_at', endISO)
      .not('body', 'is', null)

    if (filters?.categories?.length || filters?.sources?.length) {
      const orConditions: string[] = []

      if (filters.categories?.length) {
        orConditions.push(`category_id.in.(${filters.categories.map((c) => c.id).join(',')})`)
      }

      if (filters.sources?.length) {
        orConditions.push(`content_source_id.in.(${filters.sources.map((s) => s.id).join(',')})`)
      }

      query = query.or(orConditions.join(','))
    }

    const { count, error } = await query

    if (error: any) {
      console.error("Error fetching today's posts:", error)
      return
    }

    todaysPosts.value = count || 0
    hasInitialized.value = true
  }

  return {
    todaysPosts,
    fetchTodaysPosts,
    hasInitialized,
  }
}
