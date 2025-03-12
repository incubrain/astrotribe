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

    try {
      // Build query with the new unified content structure
      let query = supabase
        .from('contents')
        .select('id', { count: 'exact', head: true })
        .gte('published_at', startISO)
        .lt('published_at', endISO)
        .eq('is_active', true)
        .is('deleted_at', null)

      // Add filters for content sources and categories
      if (filters?.sources?.length || filters?.categories?.length) {
        const orConditions = []

        // Filter by sources if provided
        if (filters.sources?.length) {
          orConditions.push(`source_id.in.(${filters.sources.map((s) => s.id).join(',')})`)
        }

        // Filter by categories - assuming categories are in the details JSONB
        if (filters.categories?.length) {
          // This approach depends on how categories are stored in your details JSONB
          // If stored directly as category_id:
          orConditions.push(
            `details->>'category_id'.in.(${filters.categories.map((c) => c.id).join(',')})`,
          )

          // If you're using an array of categories in the details:
          // You would need a different approach or a custom SQL function
        }

        if (orConditions.length > 0) {
          query = query.or(orConditions.join(','))
        }
      }

      const { count, error } = await query

      if (error) {
        console.error("Error fetching today's posts:", error)
        return
      }

      todaysPosts.value = count || 0
      hasInitialized.value = true
    } catch (err) {
      console.error('Error in fetchTodaysPosts:', err)
    }
  }

  return { todaysPosts, fetchTodaysPosts, hasInitialized }
}
