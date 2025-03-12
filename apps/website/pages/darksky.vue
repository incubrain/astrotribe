<script setup lang="ts">
interface Carousel {
  readonly title: string
  readonly subtitle: string
  readonly image: string
}

const bortleScale = `The <i>Bortle Scale</i> is a tool used to gauge sky brightness and assess the impact
  of light pollution on night sky visibility. A <i>lower Bortle number</i> indicates
  darker, higher-quality skies. A <i>descriptive flowchart</i> can help determine your
  area's Bortle class by guiding you through key observations. <br/> <br/>Since sky brightness can
  vary within a region, assessing multiple locations may provide a clearer picture.
  Steve Owens, a former member of the <i>Dark Sky Places Committee</i>, developed a
  helpful flowchart for this purpose. More details can be found on his
  <b>Dark Sky Diary</b>.`

const carousel: ReadonlyArray<Carousel> = [
  {
    title: 'Effects On Different Species',
    subtitle: `Artificial light at night disrupts the natural behaviors of many wildlife species, including foraging, mating, and migration
patterns. For example, nocturnal animals may experience altered predator-prey dynamics due to increased illumination,
leading to population declines. Dark sky preservation helps maintain ecological balance by reducing these disruptions,
supporting biodiversity and healthier ecosystems`,
    image: 'darksky/carousel_(1).jpeg',
  },
  {
    title: 'Circadian Rhythm',
    subtitle: `Exposure to artificial light during nighttime hours can interfere with human circadian rhythms, leading to sleep disorders and
other health issues. By implementing dark sky practices, such as using appropriate lighting and minimizing unnecessary
illumination, communities can improve residents' sleep quality and overall well-being. Additionally, preserving dark skies
enhances opportunities for stargazing and reconnecting with the natural world, enriching cultural and recreational
experiences`,
    image: 'darksky/carousel_(2).jpeg',
  },
  {
    title: 'Energy Waste',
    subtitle: `Excessive artificial lighting contributes to energy waste, which in turn leads to higher greenhouse gas emissions from power
plants. By reducing unnecessary lighting through dark sky initiatives, communities can decrease their carbon footprint,
thereby mitigating climate change. Furthermore, light pollution has been shown to disrupt natural processes, exacerbating
environmental degradation`,
    image: 'darksky/carousel_(3).jpeg',
  },
  {
    title: 'Tribal Community Preservation',
    subtitle: `Many tribal communities value natural darkness for cultural, spiritual, and practical reasons. Preserving dark skies in these
areas supports traditional practices such as storytelling, navigation, and ceremonies that rely on the visibility of the night
sky. Additionally, maintaining natural darkness aids in conserving local wildlife, which many tribes depend upon for
sustenance and cultural practices`,
    image: 'darksky/carousel_(4).jpeg',
  },
  {
    title: 'Sustainable Development',
    subtitle: `Optimizing public lighting by reducing unnecessary illumination not only conserves energy but also decreases municipal
expenses associated with electricity consumption. These savings can be redirected to other community needs, demonstrating
the economic benefits of dark sky policies.In Nagpur, Maharashtra, DarkSky Advocate Abhishek Pawse successfully persuaded
city authorities to dim street lights to 60% after 11:30 PM. This action not only promoted dark sky conservation but also raised
awareness about light pollution`,
    image: 'darksky/carousel_(5).jpeg',
  },
]
</script>

<template>
  <div class="gap-2">
    <AppCarousel :items="carousel">
      <template #default="{ item }: { item: Carousel }">
        <div>
          <DarkskyHero
            :img="{
              src: item.image,
              alt: `AstronEra Rocket Launch Hero Image`,
              width: 1080,
              height: 720,
            }"
            :title="{ main: item.title, subtitle: item.subtitle }"
            :object-position="`object-centered`"
            fit="cover"
          />
        </div>
      </template>
    </AppCarousel>
    <div class="wrapper">
      <PrimeAccordion
        value="0"
        class="p-4"
      >
        <PrimeAccordionPanel value="0">
          <PrimeAccordionHeader class="flex gap-4 px-4 rounded-md items-center">
            <CommonTitle
              class="col-start-1"
              :title="{ main: 'Mission' }"
            />
          </PrimeAccordionHeader>
          <PrimeAccordionContent>
            <div class="flex flex-col md:flex-row">
              <LandingGlass>
                <h3 class="pb-4 text-2xl font-bold leading-7"> Astronomy Education For All </h3>
                <p class="pb-3 text-base font-normal">
                  Breaking Barriers Through Digital Learning AstronEra is committed to making
                  astronomy education accessible to everyone, regardless of geographical or
                  socio-economic constraints. By leveraging digital platforms, it provides
                  interactive learning experiences that reach learners across the world. Diverse
                  Courses and Resources AstronEra offers a wide range of courses and educational
                  materials designed to spark curiosity and passion for space science. These
                  resources cater to enthusiasts of all ages and expertise levels, making space
                  exploration engaging and understandable for all. Inspiring a Global Community
                  Beyond just imparting knowledge, AstronEra nurtures a global network of space
                  enthusiasts, fostering discussions, collaborations, and a shared love for the
                  cosmos.
                </p>
              </LandingGlass>
              <LandingGlass>
                <h3 class="pb-4 text-2xl font-bold leading-7">
                  Dark Sky Preservation & Sustainability
                </h3>
                <p class="pb-3 text-base font-normal">
                  Advocating for a Pollution-Free Night Sky AstronEra is a pioneer in dark sky
                  preservation in India, actively working to combat light pollution and promote
                  sustainable practices to protect natural nightscapes. International Dark Sky
                  Preservation & Astro-Tourism Conference This initiative brings together experts
                  from various fields to promote sustainable astro-tourism and raise awareness about
                  the importance of dark sky conservation. India’s Dark Sky Preservation &
                  Sustainability Symposium A major event that gathers policymakers,
                  conservationists, and environmentalists to discuss strategies and policies for
                  preserving India’s night skies and ensuring a balance between development and
                  sustainability. Preserving the Night Sky for Science & Wonder AstronEra’s
                  initiatives go beyond education—they ensure that future generations can witness
                  and appreciate the natural beauty of an unpolluted night.
                </p>
              </LandingGlass>
            </div>
          </PrimeAccordionContent>
        </PrimeAccordionPanel>
      </PrimeAccordion>
      <PrimeAccordion
        value="0"
        class="p-4"
      >
        <PrimeAccordionPanel value="0">
          <PrimeAccordionHeader class="flex gap-4 px-4 rounded-md items-center">
            <CommonTitle
              class="col-start-1"
              :title="{ main: 'Meet Our Dark Sky Mascot Tara' }"
            />
          </PrimeAccordionHeader>
          <PrimeAccordionContent>
            <div class="flex flex-col gap-2 md:flex-row">
              <IBImage
                class="flex-1 flex-shrink-0"
                :img="{
                  src: '/images/mascot_tara.png',
                  alt: 'Tara the Firefly',
                }"
              />
              <LandingGlass class="flex-1">
                <p class="pb-3 text-base font-normal">
                  Hi, I’m Tara the Firefly—your quirky little mascot for saving the dark skies! Why
                  me? Well, as a firefly, I know the magic of natural light—I shine brightest when
                  the night is dark and calm. But with all the harsh artificial lights around, not
                  only are the stars disappearing, but it’s confusing creatures like me, disturbing
                  humans’ sleep, and even affecting health! Protecting the night sky isn’t just for
                  stargazing—it’s about keeping our planet in balance. That’s why I’m on a mission
                  to fight light pollution, and I’m thrilled to see experts and policymakers joining
                  forces at events like India's Dark Sky Policy and Sustainability Symposium.
                  Together, we can turn down the glare and bring back the beauty of the night for
                  everyone!
                </p>
                <div class="flex w-full justify-center">
                  <PrimeButton class="w-min flex flex-col">
                    <h3>KNOW MY STORY</h3>
                    <p>DOWNLOAD</p>
                  </PrimeButton>
                </div>
              </LandingGlass>
            </div>
          </PrimeAccordionContent>
        </PrimeAccordionPanel>
      </PrimeAccordion>
      <PrimeAccordion
        value="0"
        class="p-4"
      >
        <PrimeAccordionPanel value="0">
          <PrimeAccordionHeader class="flex gap-4 px-4 rounded-md items-center">
            <CommonTitle
              class="col-start-1"
              :title="{ main: 'What you can do' }"
            />
          </PrimeAccordionHeader>
          <PrimeAccordionContent class="gap-2 flex justify-center items-center">
            <div class="flex flex-col gap-2">
              <div class="flex flex-col md:flex-row gap-2">
                <IBImage
                  class="object-fit h-auto flex flex-1"
                  :img="{
                    src: 'images/five-lighting-principles-08-2023.webp',
                    width: 400,
                    quality: 90,
                  }"
                />
                <LandingGlass class="flex flex-1">
                  <h3 class="pb-4 text-2xl font-bold leading-7">
                    5 principles of responsible lighting
                  </h3>
                  <p class="pb-3 text-base font-normal">
                    Excessive and poorly managed outdoor lighting at night is a widespread issue,
                    often leading to unnecessary energy use, environmental harm, and increasing
                    light pollution. This growing problem can disrupt ecosystems and diminish
                    overall well-being. To address this, DarkSky and the Illuminating Engineering
                    Society have outlined the Five Principles for Responsible Outdoor Lighting,
                    offering practical guidance on minimizing light pollution through thoughtful
                    lighting design. Following these principles ensures outdoor lighting is
                    efficient, visually appealing, and environmentally conscious. Implementing them
                    can cut costs, conserve energy, and protect wildlife while maintaining effective
                    nighttime illumination.
                  </p>
                </LandingGlass>
              </div>
              <div class="flex flex-col md:flex-row gap-2">
                <LandingGlass class="flex flex-1">
                  <h3 class="pb-4 text-2xl font-bold leading-7"> The Bortle Scale </h3>
                  <p
                    class="pb-3 text-base font-normal"
                    v-html="bortleScale"
                  />
                </LandingGlass>
                <IBImage
                  class="object-contain h-auto flex flex-1 flex-shrink-0"
                  :img="{
                    src: 'symposium/bortlescaleflowchart.jpg',
                    width: 400,
                    quality: 90,
                  }"
                />
              </div>
            </div>
          </PrimeAccordionContent>
        </PrimeAccordionPanel>
      </PrimeAccordion>
      <div class="flex flex-col md:flex-row">
        <div class="lg:sticky top-24">
          <LandingGlass
            hover-effect="glow"
            glow-color="purple"
            gradient="mixed"
            intensity="low"
            interactive
            isolate-content
          >
            <IBImage
              :img="{
                src: '/conference/photos/IDSPAC23-ruchira-huchgol.jpg',
                alt: 'Conferences',
                width: '500',
                height: '350',
                loading: 'lazy',
                format: 'webp',
              }"
              class="object-cover"
            />
            <div class="flex flex-shrink-0 items-center justify-start gap-2 p-2 pb-0">
              <h3 class="text-2xl font-semibold"> Conferences </h3>
            </div>
            <div class="pt-8 space-y-8">
              <div class="flex w-full flex-col items-start justify-start gap-4">
                <span class="text-base">
                  Uniting experts and enthusiasts to reclaim the night—because preserving dark skies
                  means protecting life, science, and wonder.
                  <strong> Take a look at our past and upcoming conferences! </strong>
                </span>
              </div>
              <div>
                <NuxtLink
                  to="/conferences"
                  aria-label="Look at our conferences"
                >
                  <PrimeButton severity="secondary"> View </PrimeButton>
                </NuxtLink>
              </div>
            </div>
          </LandingGlass>
        </div>
        <div class="lg:sticky top-24">
          <LandingGlass
            hover-effect="glow"
            glow-color="purple"
            gradient="mixed"
            intensity="low"
            interactive
            isolate-content
          >
            <IBImage
              :img="{
                src: 'darksky/symposium_card.jpeg',
                alt: 'Symposiums',
                width: '500',
                height: '350',
                loading: 'lazy',
                format: 'webp',
              }"
              class="object-cover"
            />
            <div class="flex flex-shrink-0 items-center justify-start gap-2 p-2 pb-0">
              <h3 class="text-2xl font-semibold"> Symposiums </h3>
            </div>
            <div class="pt-8 space-y-8">
              <div class="flex w-full flex-col items-start justify-start gap-4">
                <span class="text-base">
                  We host a collaborative platform shaping policies for a starlit future—where
                  innovation meets sustainability to combat light pollution.
                  <strong> Take a look at our past and upcoming symposiums! </strong>
                </span>
              </div>
              <div>
                <NuxtLink
                  to="/symposiums"
                  aria-label="Look at our symposiums"
                >
                  <PrimeButton severity="secondary"> View </PrimeButton>
                </NuxtLink>
              </div>
            </div>
          </LandingGlass>
        </div>
      </div>
      <div class="flex flex sm:flex-row justify-center gap-4 pt-8">
        <NuxtLink
          to="/darksky"
          external
        >
          <PrimeButton
            size="large"
            class="font-inter bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 transition-all duration-300 text-lg px-8"
          >
            Get Involved!
          </PrimeButton>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.p-accordion-toggle-icon) {
  font-size: 1.5rem; /* Increase the size */
}
</style>
