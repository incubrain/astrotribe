<script setup lang="ts">
import {
  LazyAdminSocialOverview,
  LazyAdminSocialYoutube,
  LazyAdminSocialInstagram,
  LazyAdminSocialLinkedin,
  LazyAdminSocialTwitter
} from '#components'

// todo:med:hard:8 create tables for and store social snapshots in the database
// probably monthly would be enough, not sure exactly how I would do this, possibly a simple cron would work
const socialsTabs = [
  {
    tabTitle: 'Overview',
    tabName: 'overview',
    id: 'AstronEra',
    component: LazyAdminSocialOverview
  },
  {
    tabTitle: 'Youtube',
    tabName: 'youtube',
    id: 'AstronEra',
    component: LazyAdminSocialYoutube
  },
  {
    tabTitle: 'Instagram',
    tabName: 'instagram',
    id: 'AstronEra',
    component: LazyAdminSocialInstagram
  },
  {
    tabTitle: 'Linkedin',
    tabName: 'linkedin',
    id: 'AstronEra',
    component: LazyAdminSocialLinkedin
  },
  {
    tabTitle: 'Twitter',
    tabName: 'twitter',
    id: 'AstronEra',
    component: LazyAdminSocialTwitter
  }
]

definePageMeta({
  layoutTransition: false,
  name: 'Socials',
  middleware: 'is-admin'
})
</script>
<template>
  <div class="w-full h-full">
    <BaseTabView
      :tabs="socialsTabs"
      class="w-full h-full"
    >
      <template
        v-for="tab in socialsTabs"
        v-slot:[tab.tabName]
      >
        <div class="p-4 h-full">
          <component
            :is="tab.component"
            :id="tab.id"
          />
        </div>
      </template>
    </BaseTabView>
  </div>
</template>

<style scoped></style>
