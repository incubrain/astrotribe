<!-- NewsFeed.vue -->
<script setup lang="ts">
const sortingMethod = ref<'created_at' | 'hot_score'>('created_at')

const { topBannerAd } = useAdsStore()
</script>

<template>
  <div>
    <FeedTitle title="News Feed" />
    <AdsBanner
      v-if="topBannerAd"
      :ad="topBannerAd"
    />

    <!-- <AdsDiscountBanner /> -->

    <FeedHotToggle v-model="sortingMethod" />

    <Transition
      name="fade"
      mode="out-in"
    >
      <FeedRecent v-if="sortingMethod === 'created_at'" />
      <FeedHot v-else />
    </Transition>
  </div>
</template>
