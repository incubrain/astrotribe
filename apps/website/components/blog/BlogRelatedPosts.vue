<script setup lang="ts">
const props = defineProps({
  article: {
    type: Object,
    required: true,
  },
})

const { data: relatedPosts } = await useAsyncData(`related-${props.article.id}`, async () => {
  // Try to find related posts by category
  if (props.article.category?.slug) {
    const byCategory = await queryCollection('blog')
      .where('category.slug', '=', props.article.category.slug)
      .where('path', '<>', props.article.path)
      .limit(3)
      .all()

    if (byCategory.length >= 3) {
      return byCategory
    }
  }

  // If no 3 posts with same category, try finding by tags
  if (props.article.tags?.length) {
    // Extract tag names
    const tagNames = props.article.tags.map((tag) => tag.name)

    // This is a simplified approach - in a real SQL DB you'd use something
    // like an IN operator, but for our simplified query we'll just get
    // some recent posts
    const recentPosts = await queryCollection('blog')
      .where('path', '<>', props.article.path)
      .order('date', 'DESC')
      .limit(10)
      .all()

    // Then manually filter for tag matches
    const withMatchingTags = recentPosts
      .filter((post) => {
        if (!post.tags?.length) return false
        const postTagNames = post.tags.map((tag) => tag.name)
        return postTagNames.some((tag) => tagNames.includes(tag))
      })
      .slice(0, 3)

    if (withMatchingTags.length > 0) {
      return withMatchingTags
    }
  }

  // Fallback to recent posts
  return queryCollection('blog')
    .where('path', '<>', props.article.path)
    .order('date', 'DESC')
    .limit(3)
    .all()
})
</script>

<template>
  <div
    v-if="relatedPosts?.length"
    class="mt-16"
  >
    <h2 class="text-2xl font-bold mb-6 text-center">You Might Also Like</h2>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <BlogCard
        v-for="post in relatedPosts"
        :key="post.id"
        :article="post"
      />
    </div>
  </div>
</template>
