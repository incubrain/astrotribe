<script setup lang="ts"></script>

<template>
  <div>
    <CommonHero
      :img="{
        src: 'images/blog/category-pages/isro-rocket-launch.png',
        alt: `AstronEra blog icon`,
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
    <div class="space-y-10 wrapper py-16 padded-x">
      <BlogShowcase article-category="all">
        <template #title>
          <CommonTitle
            :title="{
              main: 'Latest Blog Posts',
              subtitle: 'Keep up to date with the latest AstronEra posts',
            }"
          />
        </template>
        <NuxtLink to="/blog/all">
          <PrimeButton to="/blog/all"> All Articles </PrimeButton>
        </NuxtLink>
      </BlogShowcase>
      <!-- <BlogNews :news-category="'all'" /> -->
    </div>
  </div>
</template>

<style scoped></style>
