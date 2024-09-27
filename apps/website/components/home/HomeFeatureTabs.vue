<script setup lang="ts">
const productSteps = [
  {
    id: 1,
    tabName: 'tab1',
    tabTitle: 'News',
    title: 'Stay Updated with Astronomy News',
    info: '10+ News Sources',
    body: 'We aggregate news from all major space agencies like NASA and ISRO, as well as private companies.',
    points: [
      'News from NASA, ISRO, and more',
      'Daily updates',
      'AI-powered article summaries',
      'Comprehensive coverage of private companies',
    ],
    cta: 'Check it out',
    available: true,
  },
  {
    id: 2,
    tabName: 'tab2',
    tabTitle: 'Companies',
    info: '20+ Companies Onboarded',
    title: 'Explore Government and Private Sector Companies',
    body: 'Our database will include all major government and private sector companies from around the world, our initial focus is Indian private companies.',
    points: [
      'Database of major government agencies',
      'Insights into private companies',
      'Follow companies of interest - coming soon',
      'Linked social profiles - coming soon',
    ],
    cta: 'Check it out',
    available: true,
  },
  {
    id: 3,
    tabName: 'tab3',
    tabTitle: 'People',
    info: '50+ People',
    title: 'Connect with Astronomy Enthusiasts',
    body: 'Join a global community of astronomy enthusiasts.',
    points: [
      'Connect with global enthusiasts',
      'Share your passion for astronomy',
      'Foster collaboration',
      'Hire AstroGuides',
    ],
    cta: 'Check it out',
    available: true,
  },
  {
    id: 4,
    tabName: 'tab4',
    tabTitle: 'Launches',
    info: 'Upcoming Launches',
    title: 'Never Miss a Launch',
    body: 'Stay informed about all upcoming launches from launch providers worldwide.',
    points: [
      'Database of upcoming launches',
      'Global launch providers',
      'Stay informed about space events',
      'Never miss an important launch',
    ],
    cta: 'Coming Q2 2024',
    available: false,
  },
]

const dummyData = {
  news: {
    id: 1,
    created_at: '2024-03-23 06:30:24.736222+00',
    updated_at: '2024-03-23 06:30:24.736222+00',
    title: 'Elastocaloric Refrigeration for Spaceflight Applications (ESRA)',
    body: 'Jun Cui Iowa State University ESI23 Cui Quadchart.pdf Elastocaloric materials heat up when exposed to a mechanical force and cool down, removing the same amount of heat from their environment, when the force is removed. Professor Cui will use the recently established DFT\\/machine learning guided metals development methodology to unravel the complex relationships between compositions, crystal structures, phase transformation, and fatigue behavior of the elastocaloric materials. He will develop novel, new elastocaloric materials and use them as the basis of a high-performance refrigeration system for NASA exploration applications. Back to ESI 2023',
    category_id: 16,
    author: null,
    description:
      'Jun Cui Iowa State University ESI23 Cui Quadchart.pdf Elastocaloric materials heat up when exposed to a mechanical force and cool down, removing the same amount of heat from their environment, when the force is removed. Professor Cui will use the\u2026',
    featured_image:
      'https://www.nasa.gov/wp-content/themes/nasa/assets/images/default-thumbnail.jpg',
    has_summary: false,
    published_at: '2024-03-21 18:30:00+00',
    source: 'nasa',
    url: 'https://www.nasa.gov/directorates/stmd/space-tech-research-grants/esi/elastocaloric-refrigeration-for-spaceflight-applications-esra/',
  },

  company: {
    id: 1,
    name: 'Agnikul Cosmos',
    description:
      'Agnikul Cosmos is a space tech company building small satellite launch vehicles. We are building a full stack launch vehicle to take small satellites to space.',
    founding_year: 2017,
    logo_url: 'agnikul-logo.jpg',
    url: 'https://agnikul.in/#/',
    is_government: false,
    category_id: 1,
    scrape_frequency: 'bi_weekly',
    social_media: {
      linkedin_url: 'https://www.linkedin.com/company/agnikul-cosmos/',
      twitter_url: 'https://twitter.com/@agnikulcosmos',
      instagram_url: 'https://instagram.com/agnikul/',
      youtube_url: 'https://www.youtube.com/@agnikulcosmos1404',
    },
  },
  user: {
    id: 'e1bf12c6-aad4-4905-bda2-127c027504a3',
    email: 'shwetakk6@gmail.com',
    given_name: 'Shweta',
    surname: 'Kulkarni',
    username: 'Shweta',
    dob: '1995-11-16',
    gender_id: 2,
    created_at: '2023-08-11 16:49:09.163+00',
    updated_at: '2023-08-11 16:49:09.163+00',
    last_seen: '2023-08-11 16:49:09.163+00',
    avatar: 'shweta-kulkarni.jpg',
    introduction: null,
    quote: null,
    followed_count: 1,
    followers_count: 1,
    plan: 'free',
    role: 'admin',
  },
} as const

const getDummyData = (type: string) => {
  return dummyData[type as keyof typeof dummyData]
}
</script>

<template>
  <div>
    <IBTabView :tabs="productSteps">
      <template
        v-for="feat in productSteps"
        :key="feat.id"
        #[feat.tabName]
      >
        <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div class="background border-color space-y-4 rounded-md border p-4 lg:p-8">
            <h3 class="text-2xl">
              {{ feat.title }}
            </h3>
            <!-- <p> {{ feat.body }}</p> -->
            <ul class="list-inside list-disc">
              <li
                v-for="point in feat.points"
                :key="point"
              >
                {{ point }}
              </li>
            </ul>
            <PrimeMessage severity="info">
              {{ feat.info }}
            </PrimeMessage>
          </div>
          <div class="space-y-4">
            <NewsCard
              v-if="feat.id === 1"
              :news="getDummyData('news')"
            />
            <CompanyCard
              v-else-if="feat.id === 2"
              :company="getDummyData('company')"
            />
            <UserCard
              v-else-if="feat.id === 3"
              :user="getDummyData('user')"
            />
            <div v-else>
              <PrimeMessage severity="info"> Coming Very Soon </PrimeMessage>
            </div>
            <PrimeButton class="flex w-full justify-center"> Join to see more </PrimeButton>
          </div>
        </div>
      </template>
    </IBTabView>
  </div>
</template>

<style scoped></style>
