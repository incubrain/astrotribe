<script setup lang="ts">
import type { QueryBuilderParams } from '@nuxt/content/dist/runtime/types'
import type { ArticleCardT, ArticleCategoriesT } from '~/types/articles'
import { ARTICLE_CARD_PROPERTIES, articleCardSchema } from '~/types/articles'

const route = useRoute()
const categoryParam = computed(() => String(route.params.category) as ArticleCategoriesT)

const allArticles = ref<ArticleCardT[]>([])
const pagination = reactive({ skip: 0, limit: 10 })

const articlesFinished = ref(false)

const whereOptions: QueryBuilderParams = {
  // tags: { $in: selectedTags.value },
  status: { $eq: 'published' }
}
const {
  error,
  data: newArticles,
  refresh,
  pending
} = useAsyncData(
  `article-cards-${categoryParam.value}`,
  () =>
    queryContent('/blog', categoryParam.value === 'all' ? '' : categoryParam.value)
      .where(whereOptions)
      .only(ARTICLE_CARD_PROPERTIES)
      .sort({ publishedAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit)
      .find() as Promise<ArticleCardT[]>
)

watchEffect(async () => {
  if (newArticles.value) {
    if (!newArticles.value.length || newArticles.value.length < pagination.limit) {
      articlesFinished.value = true
    }
    console.log('newArticles.value', newArticles.value.length)
    allArticles.value.filter((article) => isValidArticleCard(article))
    allArticles.value.push(...newArticles.value)
    pagination.skip += pagination.limit

    await new Promise((resolve) => setTimeout(resolve, 1200))
  }
})

// Validation & Error Handling
if (error.value) {
  console.error('Error fetching articles:', error)
}

function isValidArticleCard(article: ArticleCardT): boolean {
  try {
    articleCardSchema.parse(article)
    return true
  } catch (error) {
    console.error(`Error parsing article: ${article.title}`, error)
    return false
  }
}

const category = {
  all: {
    title: 'All',
    description: 'All Articles'
  },
  'people-of-space': {
    title: 'People of Space',
    description: 'Articles about notable individuals in the space industry'
  },
  'space-exploration': {
    title: 'Space Exploration',
    description: 'Articles about space missions and exploration efforts'
  },
  'dark-skies': {
    title: 'Dark Skies',
    description: 'Articles about the preservation of dark skies'
  },
  'sustainable-development': {
    title: 'Sustainable Development',
    description: 'Articles about sustainable practices in space activities'
  }
}

const websiteUrl = 'https://astronera.org'

// SEO
useSeoMeta({
  title: 'AstronEra Blog',
  ogTitle: 'AstronEra Blog',
  description: 'AstronEra Blog',
  ogDescription: 'AstronEra Blog',
  ogImage: '/images/icons/blog-icon.svg',
  twitterCard: 'summary_large_image',
  twitterTitle: 'AstronEra Blog',
  twitterDescription: 'AstronEra Blog',
  twitterImage: `${websiteUrl}/images/icons/blog-icon.svg`
})

defineOgImageComponent('OgImageDefault', {
  title: `AstronEra ${categoryParam.value} Articles`,
  description: category[categoryParam.value].description,
  image: './'
})
</script>

<template>
  <div>
    <CommonHero
      :img="{
        src: 'images/blog/category-pages/isro-rocket-launch.png',
        alt: `AstronEra blog icon`,
        width: 1080,
        height: 720
      }"
      :title="{
        main: 'AstronEra BLOG',
        subtitle: 'Space awaits'
      }"
      position="center"
      invert
    />
    <div class="wrapper p-4 xl:p-8">
      <BlogFilter />
    </div>
    <div
      class="wrapper md:px-4 lg:px-8 xl:pb-8 grid grid-cols-1 lg:grid-cols-[0.5fr_1fr] items-start w-full md:gap-4 lg:gap-8 relative"
    >
      <BlogAdFloat />

      <div class="grid md:gap-4 grid-cols-1 lg:gap-8 md:grid-cols-2 h-full">
        <BlogCard
          v-for="article in allArticles"
          :key="`astronera-${categoryParam}-article-${article.id}`"
          :article="article"
        />
        <ClientOnly>
          <BlogCardSkeleton v-show="pending" />
          <BlogCardSkeleton v-show="pending" />
          <BlogCardSkeleton v-show="pending" />
          <div
            v-if="articlesFinished"
            class="flex justify-center items-center w-full border border-primary-500 md:rounded-md background p-8"
          >
            <p class="foreground px-2">No more articles...</p>
          </div>
          <template #fallback>
            <p>Loading articles...</p>
          </template>
        </ClientOnly>
      </div>
    </div>
    <BlogArticleInfinateScroll
      v-show="!articlesFinished && !pending"
      @infinate-trigger="refresh"
    />
  </div>
</template>

<style></style>
