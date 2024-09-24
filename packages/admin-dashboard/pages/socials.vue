<script setup lang="ts">
import {
  LazySocialOverview,
  LazySocialYoutube,
  LazySocialInstagram,
  LazySocialLinkedin,
  LazySocialTwitter,
} from '#components'

definePageMeta({
  layoutTransition: false,
  name: 'Socials',
})

// todo:med:hard:8 create tables for and store social snapshots in the database
// probably monthly would be enough, not sure exactly how I would do this, possibly a simple cron would work
const socialsTabs = [
  {
    tabTitle: 'Overview',
    tabName: 'overview',
    id: 'AstronEra',
    component: LazySocialOverview,
  },
  {
    tabTitle: 'Youtube',
    tabName: 'youtube',
    id: 'AstronEra',
    component: LazySocialYoutube,
  },
  {
    tabTitle: 'Instagram',
    tabName: 'instagram',
    id: 'AstronEra',
    component: LazySocialInstagram,
  },
  {
    tabTitle: 'Linkedin',
    tabName: 'linkedin',
    id: 'AstronEra',
    component: LazySocialLinkedin,
  },
  {
    tabTitle: 'Twitter',
    tabName: 'twitter',
    id: 'AstronEra',
    component: LazySocialTwitter,
  },
]
</script>

<template>
  <div class="h-full w-full">
    <IBTabView
      :tabs="socialsTabs"
      class="h-full w-full"
    >
      <template
        v-for="tab in socialsTabs"
        :key="tab.tabName"
        #[tab.tabName]
      >
        <div class="h-full p-4">
          <component
            :is="tab.component"
            :id="tab.id"
          />
        </div>
      </template>
    </IBTabView>
  </div>
</template>

<style scoped></style>
