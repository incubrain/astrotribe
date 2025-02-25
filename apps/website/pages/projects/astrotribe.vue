<script setup lang="ts">
const tab = ref('About')

const toc = [
  {
    id: 1,
    depth: 1,
    text: 'About',
  },
  {
    id: 2,
    depth: 1,
    text: 'Astroguides',
  },
]

const astroguides = [
  {
    given_name: 'Reshma',
    surname: 'Chaure',
    professional_title: 'Astroguide',
    avatar: 'reshma_chaure',
    featured: false,
    inPerson: true,
  },
  {
    given_name: 'Vaibhav',
    surname: 'Chaure',
    professional_title: 'Astroguide',
    avatar: 'vaibhav_chaure',
    featured: false,
    inPerson: true,
  },
  {
    given_name: 'Neha',
    surname: 'Gavli',
    professional_title: 'Astroguide',
    avatar: 'neha_gavli',
    featured: false,
    inPerson: true,
  },
  {
    given_name: 'Vijaya',
    surname: 'Thakre',
    professional_title: 'Astroguide',
    avatar: 'vijaya_thakre',
    featured: false,
    inPerson: true,
  },
  {
    given_name: 'Chhakuli',
    surname: 'Choudhari',
    professional_title: 'Astroguide',
    avatar: 'chhakuli_choudhari',
    featured: false,
    inPerson: true,
  },
  {
    given_name: 'Archana',
    surname: 'Pawra',
    professional_title: 'Astroguide',
    avatar: 'archana_pawra',
    featured: false,
    inPerson: true,
  },
  {
    given_name: 'Vipul',
    surname: 'Khiradi',
    professional_title: 'Astroguide',
    avatar: 'vipul_khiradi',
    featured: false,
    inPerson: true,
  },
  {
    given_name: 'Sharmila',
    surname: 'Kuwar',
    professional_title: 'Astroguide',
    avatar: 'sharmila_kuwar',
    featured: false,
    inPerson: true,
  },
  {
    given_name: 'Pratibha',
    surname: 'Gaisamudre',
    professional_title: 'Astroguide',
    avatar: 'pratibha_gaisamudre',
    featured: false,
    inPerson: true,
  },
  {
    given_name: 'Neel',
    surname: 'Shewale',
    professional_title: 'Astroguide',
    avatar: 'neel_shewale',
    featured: false,
    inPerson: true,
  },
  {
    given_name: 'Estar',
    surname: 'Desai',
    professional_title: 'Astroguide',
    avatar: 'estar_desai',
    featured: false,
    inPerson: true,
  },
  {
    given_name: 'Komal',
    surname: 'Wagh',
    professional_title: 'Astroguide',
    avatar: 'komal_wagh',
    featured: false,
    inPerson: true,
  },
  {
    given_name: 'Nama',
    surname: 'Valvi',
    professional_title: 'Astroguide',
    avatar: 'nama_valvi',
    featured: false,
    inPerson: true,
  },
  {
    given_name: 'Kavita',
    surname: 'Chaure',
    professional_title: 'Astroguide',
    avatar: 'kavita_chaure',
    featured: false,
    inPerson: true,
  },
  {
    given_name: 'Sakshi',
    surname: 'Nirgude',
    professional_title: 'Astroguide',
    avatar: 'sakshi_nirgude',
    featured: false,
    inPerson: true,
  },
  {
    given_name: 'Vinod',
    surname: 'Jagtap',
    professional_title: 'Astroguide',
    avatar: 'vinod_jagtap',
    featured: false,
    inPerson: true,
  },
  {
    given_name: 'Sagar',
    surname: 'Bodhre',
    professional_title: 'Astroguide',
    avatar: 'sagar_bodhre',
    featured: false,
    inPerson: true,
  },
]

const project = {
  title: 'Astrotribe',
  description: 'Battling light pollution one lumen at a time',
  images: [
    'astrotribe-news-isro-rocket-launch.png',
    'astrotribe-paid-events-shweta-hosting-event.png',
    'hero-image-startrail.jpg',
    'hero-image.jpg',
    'milkyway-background.jpg',
    "participant-viewing-through-shweta's-telescope.jpg",
    'shweta-kulkarni-painting-common-man-looking-at-universe.jpg',
  ],
  body: `In the modern era, where urbanization is rapidly advancing and technology is continually reshaping our environment, the concept of preserving natural wonders often takes a backseat. One of the most neglected aspects of our natural world is the night sky. Over the years, light pollution has become an increasing threat to the pristine beauty of the night sky, making it nearly impossible for people in urban areas to view the stars. However, AstronEra, an organization at the forefront of dark sky conservation, is working tirelessly in India to reduce light pollution and ensure that future generations can once again enjoy the magnificence of the night sky.

    Understanding the Problem of Light Pollution
    Light pollution refers to the excessive or misdirected artificial light that obscures our view of the stars, planets, and other celestial objects. In India, rapid urbanization and the expansion of industrial activity have led to an increase in light pollution, especially in major cities. According to studies, more than 70% of the Indian population now lives under skies where the Milky Way is barely visible. This not only affects stargazing but also disrupts ecosystems and harms wildlife, particularly nocturnal animals that rely on natural darkness for survival.

    In addition to the environmental impact, light pollution also poses a significant threat to human health. The constant exposure to artificial light at night disrupts sleep patterns, increases stress levels, and contributes to the development of various health conditions such as obesity and depression. In cities like Delhi, Mumbai, and Bangalore, the bright city lights obscure the wonders of the night, while the citizens lose their connection to the natural rhythms of the Earth.

    AstronEra's Vision for Dark Sky Conservation
    AstronEra, a nonprofit organization focused on astronomy and environmental advocacy, has identified light pollution as one of the most pressing issues facing India’s nightscapes. Their vision is to not only raise awareness about the detrimental effects of light pollution but also to work on concrete solutions that can mitigate this problem across the country. The organization understands that while India is making strides in technological advancements, it is also important to preserve the natural world that connects humans to the universe.

    One of AstronEra's primary goals is to protect dark sky reserves across India, which are regions where light pollution is minimal, and the natural night environment is maintained. These reserves provide a safe space for both astronomical research and environmental preservation. AstronEra's team collaborates with local governments, environmental groups, and communities to implement sustainable lighting practices, which aim to preserve the beauty of the night sky while still meeting the practical needs of urbanization.`,
}

const selectItem = (item: string) => {
  tab.value = item
}
</script>

<template>
  <CommonHero
    :img="{
      src: 'images/astrotribe-guide-training-India.jpg',
      alt: `Astrotribe Guide Training`,
    }"
    :title="{
      main: project.title,
      subtitle: 'Project Description',
    }"
    position="center"
    invert
  />

  <div class="flex p-4">
    <PrimeAccordion
      value="0"
      class="z-10 py-6 px-6 xl:gap-12 xl:py-12"
    >
      <PrimeAccordionPanel value="0">
        <PrimeAccordionHeader class="flex gap-4 bg-primary-800 px-4 py-2 rounded-md items-center">
          <h3 class="text-lg font-semibold"> Table of Contents </h3>
        </PrimeAccordionHeader>
        <PrimeAccordionContent>
          <ul>
            <li
              v-for="item in toc"
              :key="item.id"
              class="py-1"
            >
              <PrimeButton
                :class="{
                  outline: item.text == tab,
                }"
                class="text-lg font-[Oswald] p-button-text"
                @click="selectItem(item.text)"
              >
                <h4>
                  {{ item.text }}
                </h4>
              </PrimeButton>
            </li>
          </ul>
        </PrimeAccordionContent>
      </PrimeAccordionPanel>
    </PrimeAccordion>
    <CommonTitle
      v-if="tab == 'About'"
      :title="{ main: 'About' }"
      class="row-start-1"
    >
      Through hands-on training, telescope sessions, and public stargazing events, we trained 16
      AstroGuides, enabling them to earn by guiding astronomy experiences. The project connected
      students with international mentors, onboarded resorts for astrotourism, and aimed to create a
      sustainable network for future opportunities. With continued support, we are expanding this
      initiative to Brazil and beyond, strengthening its global impact. 🚀✨
      <IBImage
        :img="{
          src: `images/participant-viewing-through-shweta's-telescope.jpg`,
        }"
      />
    </CommonTitle>
    <div
      v-if="tab == 'Astroguides'"
      class="pt-4 lg:pt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:gap-8"
    >
      <LandingGlass
        v-for="astroguide in astroguides"
        hover-effect="glow"
        glow-color="purple"
        gradient="mixed"
        intensity="low"
        interactive
        isolate-content
        :padded="false"
        class="flex flex-col gap-2 relative h-full"
      >
        <template #header>
          <div class="p-2">
            <div class="absolute left-0 top-0 z-10 hidden h-full w-full bg-black/10 visible" />
            <IBImage
              :img="{
                src: `/images/astroguides/${astroguide.avatar}.jpg`,
                alt: `${astroguide.given_name} ${astroguide.surname}`,
                width: '350',
                height: '350',
                loading: 'lazy',
                quality: '80',
                format: 'webp',
              }"
              class="astroguide w-full object-cover grayscale-[20%] rounded-t-xl overflow-hidden"
            />
          </div>
        </template>
        <div class="p-6 flex flex-col justify-between flex-grow min-h-full">
          <div class="flex flex-col flex-grow gap-4 text-sm pb-4">
            <h3 class="text-2xl font-semibold">
              {{ astroguide.given_name }} {{ astroguide.surname }}
            </h3>
            <p class="flex items-center gap-2 font-semibold text-primary-600">
              <Icon
                name="mdi:account"
                class="flex-shrink-0"
                size="24px"
              />
              {{ astroguide.professional_title }}
            </p>
          </div>
        </div>
      </LandingGlass>
    </div>
  </div>
</template>

<style scoped>
.astroguide {
  transform: rotate(-90deg);
}
</style>
