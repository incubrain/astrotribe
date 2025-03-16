<script setup lang="ts">
import { useBlogCategories } from '~/composables/useBlogCategories'

// Get featured posts if any
const { data: featuredPosts, pending: loadingFeatured } = await useAsyncData(
  'featured-blog-posts',
  () =>
    queryCollection('blog').where('draft', '=', false).where('featured', '=', true).limit(3).all(),
)

// Get latest posts
const { data: latestPosts, pending: loadingLatest } = await useAsyncData('latest-blog-posts', () =>
  queryCollection('blog').where('draft', '=', false).order('date', 'DESC').limit(6).all(),
)

// Get categories for the filter
const { categories, validCategories } = useBlogCategories()

// SEO
useSeoMeta({
  title: 'AstronEra Blog',
  description: 'Discover articles on space exploration, astronomy, and sustainable development',
  ogTitle: 'AstronEra Blog | Space Exploration & Astronomy',
  ogDescription:
    'Read the latest articles about space exploration, astronomy, and sustainable development.',
})
</script>

<template>
  <div>
    <CommonHero
      :img="{
        src: 'images/blog/all/isro-rocket-launch.png',
        alt: 'AstronEra blog icon',
        width: 1080,
        height: 720,
      }"
      :title="{
        main: 'ASTRONERA BLOG',
        subtitle: 'Space for all...',
      }"
      position="center"
      invert
    >
      <template #actions>
        <div class="flex items-center justify-center gap-4 mt-6">
          <BlogSearch />
          <NuxtLink to="/blog/category/all">
            <PrimeButton outlined>
              <Icon
                name="i-lucide-book-open"
                class="w-4 h-4 mr-2"
              />
              Browse All
            </PrimeButton>
          </NuxtLink>
        </div>
      </template>
    </CommonHero>

    <div class="space-y-10 wrapper py-16 padded-x">
      <!-- Category Filter -->
      <div class="p-4 xl:p-8">
        <h2 class="text-xl font-semibold mb-4">Explore Categories</h2>
        <div class="flex flex-wrap gap-3">
          <NuxtLink
            v-for="categorySlug in validCategories"
            :key="`category-${categorySlug}`"
            :to="`/blog/category/${categorySlug}`"
          >
            <PrimeButton
              outlined
              :label="categories[categorySlug]?.title || categorySlug"
              size="small"
              class="cursor-pointer"
            />
          </NuxtLink>
        </div>
      </div>

      <!-- Featured Posts Section (if any) -->
      <div
        v-if="featuredPosts?.length"
        class="space-y-6 lg:space-y-12"
      >
        <CommonTitle
          :title="{
            main: 'Featured Stories',
            subtitle: 'Our editors\' picks',
          }"
        />
        <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
          <BlogCard
            v-for="article in featuredPosts"
            :key="`blog-featured-${article.id}`"
            :article="article"
          />
        </div>
      </div>

      <!-- Latest Posts Section -->
      <div class="space-y-6 lg:space-y-12">
        <CommonTitle
          :title="{
            main: 'Latest Blog Posts',
            subtitle: 'Keep up to date with the latest AstronEra posts',
          }"
        />
        <div
          v-if="latestPosts && latestPosts.length"
          class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-8"
        >
          <BlogCard
            v-for="article in latestPosts"
            :key="`blog-latest-${article.id}`"
            :article="article"
          />
        </div>
        <div class="flex justify-end">
          <NuxtLink to="/blog/category/all">
            <PrimeButton>
              <Icon
                name="i-lucide-archive"
                class="w-4 h-4 mr-2"
              />
              All Articles
            </PrimeButton>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
