<script setup lang="ts">
import { useChangeCase } from '@vueuse/integrations/useChangeCase'
import type { QueryBuilderParams } from '@nuxt/content/dist/runtime/types'
import type { ArticleCardT, ArticleCategoriesT } from '~/types/articles'
import { ARTICLE_CARD_PROPERTIES, articleCardSchema } from '~/types/articles'

const whereOptions: QueryBuilderParams = {
  status: { $eq: 'published' },
}

const route = useRoute()
const categoryParam = computed(() => (String(route.params.category) as ArticleCategoriesT) ?? null)

const allArticles = ref<ArticleCardT[]>([])
const pagination = reactive({ skip: 0, limit: 10 })

const articlesFinished = ref(false)
const articlesLoading = ref(false)

const fetchArticles = async (
  skip: number,
  limit: number,
  category: string | null,
): Promise<ArticleCardT[]> => {
  if (!category) return []

  try {
    const articles = await queryContent('/blog', category === 'all' ? '' : category)
      .where(whereOptions)
      .only(ARTICLE_CARD_PROPERTIES)
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .find()

    // Validate articles
    const validArticles = articles
    // .filter((article) => {
    //   try {
    //     articleCardSchema.parse(article)
    //     return true
    //   } catch (err) {
    //     console.error(`Error parsing article: ${article?.title}`, err)
    //     return false
    //   }
    // })

    return validArticles
  } catch (err) {
    console.error('Error fetching articles:', err)
    return []
  }
}

// Fetch initial articles during SSR
const { data: initialArticles, error } = await useAsyncData(
  `article-cards-${categoryParam.value}-${pagination.skip}-${pagination.limit}`,
  () => fetchArticles(0, pagination.limit, categoryParam.value),
)

if (initialArticles.value) {
  allArticles.value = initialArticles.value
  if (initialArticles.value.length < pagination.limit) {
    articlesFinished.value = true
  } else {
    pagination.skip += pagination.limit
  }
  articlesLoading.value = true
} else {
  articlesLoading.value = true
}

if (error.value) {
  console.error('Error fetching initial articles:', error.value)
}

// Function to load more articles
const loadMoreArticles = async () => {
  if (articlesFinished.value || articlesLoading.value) return
  articlesLoading.value = true

  const articles = await fetchArticles(pagination.skip, pagination.limit, categoryParam.value)

  if (!articles.length || articles.length < pagination.limit) {
    articlesFinished.value = true
  }

  allArticles.value.push(...articles)
  pagination.skip += pagination.limit
  articlesLoading.value = false
}

watch(
  () => categoryParam.value,
  async (newCategory, oldCategory) => {
    if (newCategory !== oldCategory) {
      // Reset pagination and articles
      pagination.skip = 0
      articlesFinished.value = false
      allArticles.value = []
      articlesLoading.value = false

      // Fetch initial articles for the new category
      articlesLoading.value = true
      const articles = await fetchArticles(pagination.skip, pagination.limit, newCategory)
      articlesLoading.value = false

      if (articles.length < pagination.limit) {
        articlesFinished.value = true
      } else {
        pagination.skip += pagination.limit
      }

      allArticles.value = articles
    }
  },
)

const handleInfiniteScroll = async () => {
  await loadMoreArticles()
}

const category = {
  'all': {
    title: 'AstronEra Blog',
    description: 'Discover all our articles spanning the wonders and advancements of space.',
  },
  'people-of-space': {
    title: 'People of Space',
    description: 'Meet the trailblazers and visionaries propelling humanity into the cosmos.',
  },
  'space-exploration': {
    title: 'Space Exploration',
    description: 'Embark on thrilling journeys through our latest missions and cosmic discoveries.',
  },
  'dark-sky-conservation': {
    title: 'Dark Sky Conservation',
    description: 'Uncover efforts to preserve our celestial vistas and protect night skies.',
  },
  'sustainable-development': {
    title: 'Sustainable Development',
    description: 'Explore innovations for a sustainable future in space and on Earth.',
  },
}

const websiteUrl = 'https://astronera.org'

// SEO
if (categoryParam.value) {
  useSeoMeta({
    title: 'AstronEra Blog',
    ogTitle: 'AstronEra Blog',
    description: 'AstronEra Blog',
    ogDescription: 'AstronEra Blog',
    ogImage: '/images/icons/blog-icon.svg',
    twitterCard: 'summary_large_image',
    twitterTitle: 'AstronEra Blog',
    twitterDescription: 'AstronEra Blog',
    twitterImage: `${websiteUrl}/images/icons/blog-icon.svg`,
  })

  defineOgImageComponent('OgImageDefault', {
    title: `${categoryParam.value} Articles`,
    description: category[categoryParam.value]?.description,
    image: './',
  })
}

const heroImage = computed(() => {
  let src = `images/blog/${categoryParam.value}/`

  switch (categoryParam.value) {
    case 'people-of-space':
      return (src += '1.20-people-who-influenced-the-space-industry.webp')
    case 'space-exploration':
      return (src += '1.starship-lands-on-mars.webp')
    case 'dark-sky-conservation':
      return (src += '1.landscape-painting-of-dark-skies-and-mountains.webp')
    case 'sustainable-development':
      return (src += '1.sustainable-global-space-development.webp')
    default:
      return (src += 'astronera-blog.jpg')
  }
})
</script>

<template>
  <div>
    <CommonHero
      v-if="categoryParam"
      :img="{
        src: heroImage,
        alt: `AstronEra ${useChangeCase(categoryParam, 'capitalCase').value} Hero Image`,
        width: 1080,
        height: 720,
      }"
      :title="{
        main: category[categoryParam].title,
        subtitle: category[categoryParam].description,
      }"
      position="center"
      invert
    />
    <div class="wrapper p-4 xl:p-8">
      <BlogFilter />
    </div>
    <div
      class="wrapper relative grid w-full grid-cols-1 items-start md:gap-4 md:px-4 lg:grid-cols-[0.5fr_1fr] lg:gap-8 lg:px-8"
    >
      <BlogAdFloat />

      <div class="grid h-full grid-cols-1 md:grid-cols-2 md:gap-4 lg:gap-8">
        <BlogCard
          v-for="article in allArticles"
          :key="`astronera-${categoryParam}-article-${article.id}`"
          :article="article"
        />
        <ClientOnly>
          <BlogCardSkeleton v-show="articlesLoading" />
          <BlogCardSkeleton v-show="articlesLoading" />
          <BlogCardSkeleton v-show="articlesLoading" />
          <div
            v-if="articlesFinished"
            class="background flex w-full items-center justify-center border border-primary-500 p-8 md:rounded-md"
          >
            <p class="foreground px-2"> No more articles... </p>
          </div>
          <template #fallback>
            <p>Loading articles...</p>
          </template>
        </ClientOnly>
      </div>
    </div>
    <BlogArticleInfinateScroll
      v-show="!articlesFinished"
      @infinate-trigger="handleInfiniteScroll"
    />
  </div>
</template>

<style></style>
