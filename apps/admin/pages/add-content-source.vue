<script setup lang="ts">
const rssFeeds = ref([])
const contentTypes = [
  { label: 'News', value: 'news' },
  { label: 'Research', value: 'research' },
  { label: 'Events', value: 'events' },
  { label: 'Opportunities', value: 'opportunities' },
  { label: 'Companies', value: 'companies' },
  { label: 'Contact', value: 'contact' },
  { label: 'People', value: 'people' },
  { label: 'Newsletter', value: 'newsletter' },
  { label: 'Unknown', value: 'unknown' },
]
const contentUrl = ref()
const contentType = ref()
const urlPattern =
  /^(https?:\/\/)?([a-zA-Z-]+\.)+[a-zA-Z]{2,6}(\/[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]*)?$/

const isURLInvalid = computed(() => {
  return !contentUrl.value || !urlPattern.test(contentUrl.value) || !!/\d/.test(contentUrl.value)
})

const isRSSFeedsInvalid = computed(() => {
  return (
    !rssFeeds.value.length ||
    (rssFeeds.value.length &&
      rssFeeds.value
        .split(',')
        .some((feed) => !urlPattern.test(feed.trim()) || !!/\d/.test(feed.trim())))
  )
})

const clear = () => {
  contentType.value = ''
  contentUrl.value = ''
  rssFeeds.value = []
}

const submit = async () => {
  const toast = useNotification()
  if (isURLInvalid.value || isRSSFeedsInvalid.value || !contentType.value) {
    toast.error({ message: 'Invalid Input', summary: 'Error' })
    return
  }

  const supabase = useSupabaseClient()
  const { error } = await supabase.from('content_sources').insert({
    url: contentUrl.value,
    content_type: contentType.value,
    scrape_frequency: 'daily',
    rss_urls: rssFeeds.value.split(',').map((feed) => feed.trim()),
    priority: 'high',
  })

  if (error) {
    toast.error({ message: error.message, summary: 'Failed To Add Source' })
  } else {
    toast.success({ message: 'Content Source Added', summary: 'Submitted' })
    clear()
  }
}
</script>

<template>
  <div class="flex p-2 flex-col gap-2">
    <p> Add Content Source </p>
    <div class="flex flex-col gap-2">
      <label
        for="content_source_url"
        class="text-sm"
        >URL</label
      >
      <PrimeInputText
        id="content_source_url"
        v-model="contentUrl"
        :invalid="isURLInvalid"
        placeholder="Eg: https://www.seti.org"
        autocomplete="content_source_url"
        class="w-full"
      />
    </div>
    <div class="flex flex-col gap-2">
      <label
        for="type"
        class="text-sm"
        >Content Type</label
      >
      <PrimeSelect
        id="type"
        v-model="contentType"
        :invalid="!contentType"
        :options="contentTypes"
        option-label="label"
        option-value="value"
        class="w-full"
      />
    </div>
    <div class="flex flex-col gap-2">
      <label
        for="rssFeed"
        class="text-sm"
        >RSS Feeds</label
      >
      <PrimeInputText
        id="rssFeed"
        v-model="rssFeeds"
        :invalid="isRSSFeedsInvalid"
        placeholder="Enter Comma-Separated URLs"
        class="w-full"
      />
    </div>
    <div v-if="rssFeeds.length">
      <ul
        v-for="feed in rssFeeds.split(',')"
        :key="feed"
        class="flex gap-2"
      >
        <li>{{ feed }}</li>
      </ul>
    </div>
    <div class="flex gap-2">
      <PrimeButton
        class="justify-center link"
        @click="submit"
      >
        Submit
      </PrimeButton>
      <PrimeButton
        class="justify-center link"
        @click="clear"
      >
        Clear
      </PrimeButton>
    </div>
  </div>
</template>
