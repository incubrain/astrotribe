<script setup lang="ts">
import { useChangeCase } from '@vueuse/integrations/useChangeCase'
import type { QueryBuilderParams } from '@nuxt/content/dist/runtime/types'
import type { ArticleCardT, ArticleCategoriesT } from '~/types/articles'
import { ARTICLE_CARD_PROPERTIES, articleCardSchema } from '~/types/articles'

const route = useRoute()
const categoryParam = computed(() => (String(route.params.category) as ArticleCategoriesT) ?? null)

const allArticles = ref<ArticleCardT[]>([])
const pagination = reactive({ skip: 0, limit: 10 })

const articlesFinished = ref(false)

const whereOptions: QueryBuilderParams = {
  // tags: { $in: selectedTags.value },
  status: { $eq: 'published' },
}

const {
  error,
  data: newArticles,
  refresh,
  status,
} = useAsyncData(`article-cards-${categoryParam.value}`, () =>
  categoryParam.value
    ? (queryContent('/blog', categoryParam.value === 'all' ? '' : categoryParam.value)
        .where(whereOptions)
        .only(ARTICLE_CARD_PROPERTIES)
        .sort({ publishedAt: -1 })
        .skip(pagination.skip)
        .limit(pagination.limit)
        .find() as Promise<ArticleCardT[]>)
    : Promise.resolve([]),
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
    console.error(`Error parsing article: ${article?.title}`, error)
    return false
  }
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
          <BlogCardSkeleton v-show="status === 'pending'" />
          <BlogCardSkeleton v-show="status === 'pending'" />
          <BlogCardSkeleton v-show="status === 'pending'" />
          <div
            v-if="articlesFinished"
            class="background flex w-full items-center justify-center border border-primary-500 p-8 md:rounded-md"
          >
            <p class="foreground px-2">
              No more articles...
            </p>
          </div>
          <template #fallback>
            <p>Loading articles...</p>
          </template>
        </ClientOnly>
      </div>
    </div>
    <BlogArticleInfinateScroll
      v-show="!articlesFinished && status === 'success'"
      @infinate-trigger="refresh"
    />
  </div>
</template>

<style></style>
