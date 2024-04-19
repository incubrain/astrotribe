type SummaryLevel = 'beginner' | 'intermediate' | 'expert'

export function useSummary() {
  const getSummary = async () => {
    const { data, error } = await useAsyncData('summary', () =>
      $fetch('/api/admin/generate-summary')
    )
    if (error.value) throw new Error('error getting summary: ' + error.value)
    // assuming that data.value.blogs is the summary
    // summary.value = data.value.blogs
  }

  return {
    getSummary
  }
}
