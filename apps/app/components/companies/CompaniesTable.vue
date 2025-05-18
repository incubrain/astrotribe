<script setup lang="ts">
interface SocialMedia {
  id: string
  facebook_url: string
  twitter_url: string
  linkedin_url: string
  instagram_url: string
  youtube_url: string
}

interface Company {
  id: string
  founding_year: number
  name: string
  description: string
  logo_url: string
  url: string
  is_government: boolean
  category?: string
  city?: string
  country?: string
  social_media?: SocialMedia
  job_url?: string
}

defineProps({
  companies: Array<Company>,
})
</script>

<template>
  <table
    class="table-fixed min-w-full select-none border-collapse text-primary-500 table-auto bg-transparent rounded-lg"
  >
    <tbody>
      <CompaniesCell
        v-for="company in companies"
        :company="company"
        :key="company.id"
      />
    </tbody>
  </table>
</template>
