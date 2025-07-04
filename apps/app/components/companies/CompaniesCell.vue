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

const props = defineProps({
  company: Object as PropType<Company>
})

const currentlyOpen = ref(false)

const fallbackImage = '/images/companies-fallback.png'; // The fallback image

// Define a ref to hold the image source
const image = ref(props.company.logo_url);

// Method to change the image source to the fallback
const onError = () => {
  image.value = fallbackImage;
};

const getIcon = (key: string) => {
  if (key.includes('email')) {
    return 'mdi:email'
  } else if (key.includes('youtube')) {
    return 'mdi:youtube'
  } else if (key.includes('facebook')) {
    return 'mdi:facebook'
  } else if (key.includes('twitter')) {
    return 'mdi:twitter'
  } else if (key.includes('linkedin')) {
    return 'mdi:linkedin'
  } else if (key.includes('instagram')) {
    return 'mdi:instagram'
  } else {
    return ''
  }
}
</script>

<template>
  <tr class="relative border border-primary-500 rounded-xl flex flex-col p-5 mt-1 mb-1 gap-2 text-lg text-white shadow-md">
    <!-- Company name at the top -->
    <td class="px-4 w-full" colspan="3">
      <h2 class="text-2xl font-bold w-full">{{ company.name }}</h2>
    </td>
    
    <!-- Main content row -->
    <div class="flex gap-2 w-full">
      <!-- Logo column -->
      <td class="px-2 py-3 w-1/5">
        <div class="flex flex-col items-center">
          <NuxtImg
            :provider="company.logo_url ? 'supabase' : undefined"
            :src="company.logo_url"
            :alt="company.name"
            sizes="sm:100vw md:50vw lg:400px"
          />
        </div>
      </td>
      
      <!-- Description column -->
      <td class="px-4 flex flex-col gap-2 justify-between w-3/5 flex-2 py-3 whitespace-wrap max-w-xs text-left">
        <p v-if="company.description" class="align-middle">
          {{ company.description.slice(0, 1).toUpperCase() }}{{ company.description.length <= 240 || currentlyOpen
              ? company.description.slice(1)
              : `${company.description.slice(1, 241)}...` }}
          <p v-if="company.description.length > 240" class="text-primary-300 cursor-pointer" @click="currentlyOpen = !currentlyOpen">
            {{ currentlyOpen ? 'Read Less' : 'Read More' }}
          </p>
        </p>
        <p v-else class="w-full min-h-[1em]">&nbsp;</p>
        <NuxtLink v-if="company.url" :to="company.url" target="_blank" external>
          <PrimeButton outlined severity="contrast">Company Website</PrimeButton>
        </NuxtLink>
      </td>
      
      <!-- Company details column -->
      <td class="flex py-3 w-1/5 flex-1 flex-col">
        <p v-if="company.founding_year"><b>Founding Year:</b> {{ company.founding_year }}</p>
        <p v-if="company.city"><b>Location:</b> {{ company.city }}, {{ company.country }}</p>
        <p v-if="company.category"><b>Category:</b> {{ company.category }}</p>
        <div v-if="company.social_media" class="flex flex-col md:flex-row mt-auto items-center justify-between">
          <div>
            <NuxtLink
              v-for="(url, key) in company.social_media"
              v-show="url && key !== 'id'"
              :key="company.social_media.id"
              :to="url"
              target="_blank"
              external
            >
              <PrimeButton outlined>
                <Icon :name="getIcon(key)" size="36px" class="text-white" />
              </PrimeButton>
            </NuxtLink>
          </div>
          <NuxtLink v-if="company.job_url" :to="company.job_url" target="_blank" external>
            <PrimeButton outlined severity="contrast" class="shiny-button font-bold">Jobs</PrimeButton>
          </NuxtLink>
        </div>
      </td>
    </div>
    
    <!-- Government badge -->
    <td v-if="company.is_government" class="absolute text-xs top-2 right-2 p-2 bg-gray-600 text-black rounded-xl">
      <h3>Government</h3>
    </td>
  </tr>
</template>
<style scoped>
  .shiny-button {
      position: relative;
      display: inline-block;
      cursor: pointer;
      overflow: hidden;
      transition: transform 0.2s ease;
  }

  /* Shine Effect */
  .shiny-button::before {
      content: "";
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.4);
      transform: skewX(-45deg);
      animation: shine 10s infinite linear;
  }

  /* Shine Animation */
  @keyframes shine {
      0% { left: -100%; }
      5% { left: 150%; }
      100% { left: 150%; }
  }

  /* Hover Effect */
  .shiny-button:hover {
      transform: scale(1.05);
  }
</style>