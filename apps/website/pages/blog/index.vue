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

// SEO
useSeoMeta({
  title: 'AstronEra Blog',
  description:
    'Discover articles on space exploration, astronomy, research, and sustainable development',
  ogTitle: 'AstronEra Blog | Space Exploration & Astronomy',
  ogDescription:
    'Read the latest articles about space exploration, astronomy, research, and sustainable development.',
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
    />

    <BlogActions />

    <div class="space-y-10 wrapper py-16">
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
          <BlogCardGlass
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
          <BlogCardGlass
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
