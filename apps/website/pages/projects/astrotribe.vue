<script setup lang="ts">
import astrotribe from './astrotribe.json'

const tab = ref('Overview')

const toc = [
  {
    id: 1,
    depth: 1,
    text: 'Overview',
  },
  {
    id: 2,
    depth: 1,
    text: 'About',
  },
  {
    id: 3,
    depth: 1,
    text: 'Programs & Training',
  },
  {
    id: 4,
    depth: 1,
    text: 'Locations',
  },
  {
    id: 5,
    depth: 1,
    text: 'Stargazing Events',
  },
  {
    id: 6,
    depth: 1,
    text: 'Astroguides',
  },
]

const project = {
  title: 'Astrotribe',
  description:
    'A science communication and engagement initiative that imparts fundamental astronomy knowledge and skills to tribal students, empowering them for socio-economic development',
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
      subtitle: project.description,
    }"
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
      v-if="tab == 'Overview'"
      :title="{ main: 'Overview' }"
      class="row-start-1"
    >
      Welcome to AstroTribe, a science communication and engagement initiative that brings the
      wonders of astronomy to tribal students across India. Our mission is to empower these students
      with fundamental astronomy knowledge and skills, fostering socio-economic development through
      an innovative "Earn and Learn" model. By training tribal students as AstroGuides, we’re
      creating opportunities for quality education, sustainable employment, and reduced
      inequalities—aligned with the United Nations' Sustainable Development Goals (SDGs):<br />
      <ul>
        <li>SDG 4: Quality Education</li>
        <li>SDG 8: Decent Work and Economic Growth</li>
        <li>SDG 10: Reduced Inequalities</li> </ul
      ><br />
      AstroTribe is more than just astronomy—it’s about building a self-sustaining astro-tourism
      network, raising awareness about light pollution, and preserving the pristine dark skies of
      tribal regions. Join us in this cosmic journey!
    </CommonTitle>
    <CommonTitle
      v-if="tab == 'About'"
      :title="{ main: 'About' }"
      class="row-start-1"
    >
      AstroTribe is dedicated to empowering tribal students by imparting practical astronomy skills
      and creating income opportunities as AstroGuides—all without disrupting their academic
      schedules. Our core mission is to bridge the gap between tribal and non-tribal communities,
      providing equal access to resources and opportunities through the transformative power of
      astronomy.<br />

      <h2>Our Vision</h2>
      In the long term, AstroTribe aims to establish a self-sustaining astro-tourism network across
      India’s tribal regions. We’ve alre ady reached western and northern India, with plans to
      expand into the southern and eastern regions. Beyond education, AstroTribe serves as a
      platform for light pollution awareness and dark sky conservation, promoting tribal landscapes
      as premier astro-tourism destinations.

      <h2>Going Global</h2>
      To scale our impact worldwide, we’re developing an online networking platform to connect
      AstroGuides, astronomy experts, astro-tourism resorts, amateur astronomers, and enthusiasts
      passionate about joining the AstroTribe movement.

      <h2>Proven Impact</h2>
      Supported by the International Astronomical Union’s Office of Astronomy for Development with
      funding in 2022 and 2023, AstroTribe measures its success through peer feedback from mentors,
      tutors, and event participants. This initiative is a scalable model for sustainable
      development through astronomy.
    </CommonTitle>
    <CommonTitle
      v-if="tab == 'Programs & Training'"
      :title="{ main: 'Programs & Training' }"
      class="row-start-1"
    >
      AstroTribe’s multi-level training equips students to become skilled AstroGuides.<br />
      <h1>Level 1:</h1>
      Foundation Training Topics: Earth’s motion, astronomical terms, solar system, cosmic address.
      Activities: Interactive models, simulations, public speaking practice. Example: 4th-6th July
      2023, EMRS Ajmer Saundane (44 tribal, 3 non-tribal students).
      <h1>Level 2: Advanced Training</h1>
      Topics: Telescopes, stellar life cycles, exoplanets, mythology in constellations. Activities:
      Stargazing, telescope handling, VR experiences, event planning. Example: 12th-14th October
      2023, EMRS Ajmer Saundane (16 tribal, 3 non-tribal students).
      <h1>Independent Events:</h1> Trained AstroGuides lead public stargazing sessions, applying
      their skills practically.
    </CommonTitle>
    <CommonTitle
      v-if="tab == 'Locations'"
      :title="{ main: 'Locations' }"
      class="row-start-1"
    >
      AstroTribe operates in diverse tribal regions, leveraging their unique strengths.<br />
      <h1>EMRS Ajmer Saundane, Nashik, Maharashtra (2023)</h1> A hub for tribal education with
      modern tech and CBSE curriculum. Event: 11th Jan 2023, 16 AstroGuides led stargazing for 600+
      peers. <h1>SECMOL, Ladakh (2024)</h1> Eco-village focused on sustainability and cultural
      preservation. Event: Spring camp stargazing, 50+ attendees, VR Moon landing experience.
      <h1>DPS Manali, Himachal Pradesh (2024)</h1>
      Resource-rich school with global exposure. Event: 24th Nov 2024, Dark Sky Conference opening,
      75 attendees. AstroTourism Collaborations We partner with resorts to promote sustainable
      astro-tourism. Hilton Shillim Estate Resort, Pune, Maharashtra Alive Beach Resort,
      Harihareshwar, Raigadh, Maharashtra GlampEco Resort, Manali, Himachal Pradesh Manu Allaya,
      Manali, Himachal Pradesh SECMOL Campus, Leh, Ladakh
    </CommonTitle>
    <CommonTitle
      v-if="tab == 'Stargazing Events'"
      :title="{ main: 'Stargazing Events' }"
      class="row-start-1"
    >
      AstroGuides showcase their skills through public and community events.<br />
      <h1>Nashik, Maharashtra (11th Jan 2023)</h1> Venue: EMRS Ajmer Saundane 16 AstroGuides engaged
      600 peers and staff. <h1>Manali, Himachal Pradesh (May 2023)</h1> Vipul Khiradi collaborated
      with resorts, inspiring his community. <h1>Manali, Himachal Pradesh (24th Nov 2024)</h1> DPS
      AstroGuides led a 2-hour session for 75 conference attendees.
      <h1>Phey, Ladakh (2024)</h1> SECMOL AstroGuides hosted 50+ students with telescopes and VR.
    </CommonTitle>
    <div
      v-if="tab == 'Astroguides'"
      class="pt-4 lg:pt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:gap-8"
    >
      <ProjectAstroguideCard
        v-for="astroguide in astrotribe.astroguides"
        :astroguide="astroguide"
      />
    </div>
  </div>
</template>
