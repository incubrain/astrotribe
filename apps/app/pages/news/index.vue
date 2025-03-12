<!-- NewsFeed.vue -->
<script setup lang="ts">
const sortingMethod = ref<'created_at' | 'hot_score'>('created_at')

const { topBannerAd } = useAdsStore()

// No changes needed to this component since it only uses the FeedRecent and FeedHot components
// which will be updated separately to work with the new database structure
</script>

<template>
  <div>
    <FeedTitle title="News Feed" />
    <!-- <AdsBanner
      v-if="topBannerAd"
      :ad="topBannerAd"
    /> -->

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
