<template>
  <div class="w-full">
    <CommonTitle
      :title="{
        label: 'Conference Speakers',
        main: 'Experts From All Around The Globe'
      }"
    />
    <div class="pt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:gap-8">
      <LazyConferenceSpeakerCard
        v-for="speaker in filterSpeakers(true)"
        :key="speaker.given_name"
        :speaker="speaker"
        featured
      />
      <LazyConferenceSpeakerCard
        v-for="speaker in filterSpeakers(false, true)"
        :key="speaker.given_name"
        :speaker="speaker"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Speaker } from '~/types/conference'

const speakers = [
  {
    given_name: 'Sonam',
    surname: 'Wangchuk',
    professional_title: 'Engineer, Innovator and Education Reformist',
    bio: '',
    abstract: 'Sustainable Development for Tribal Ladakhies',
    avatar: 'sonam-wangchuk',
    featured: true,
    inPerson: true
  },
  {
    given_name: 'Connie',
    surname: 'Walker',
    professional_title: "NSF's NOIRLab, Co-director of IAU C.C5, USA",
    bio: '',
    abstract: 'Light Pollution and Satellite Constellations',
    avatar: 'connie-walker',
    featured: true,
    inPerson: false
  },
  {
    given_name: 'Neethu',
    surname: 'Susan George',
    professional_title: 'Vice President, EMEA & ASEAN - Light Efficient Design, Global Feit',
    bio: `Neethu, a graduate from Mahatma Gandhi University, is pursuing an MSc in Energy at Heriot-Watt with a focus on Light Pollution.
    With 12 years in lighting, she's a WELL AP®, LEED® Green Associate™, and has worked with manufacturers like Lamp Worktitude and Griven.`,
    abstract: 'Lighting for Dark Skies',
    avatar: 'neethu-george',
    featured: false,
    inPerson: true
  },
  {
    given_name: 'Bhakti',
    surname: 'Mithagri',
    professional_title: 'Astronomy enthusiast',
    bio: "Holds a Master's degree in Astrophysics from St. Xavier's College in Mumbai and am presently engaged in preparing for my Ph.D. applications.",
    abstract: 'Indian successors to the Indian Gamma-Ray Observatory(IGRO) Mission',
    avatar: 'bhakti-mithagri',
    featured: false,
    inPerson: true
  },
  {
    given_name: 'Maria',
    surname: 'Alejandra Díaz',
    professional_title: 'Astronomer',
    bio: `Alejandra, with a Physics degree from UAM, Spain, has worked at the European Space Agency and is pursuing a PhD in Turku.
    Passionate about astronomy's societal impact, she's contributed to IAU's OAD projects and operates a telescope in La Palma alongside her thesis.`,
    abstract: "Astronomy's Impact on Sustainability",
    avatar: 'maria-alejandra-diaz',
    featured: false,
    inPerson: false
  },
  {
    given_name: 'Jayanta',
    surname: 'Acharya',
    professional_title: 'Astronomer SPoC 2009 to till 2020',
    bio: '',
    abstract: 'Astrotourism in Nepal',
    avatar: 'jayanta-acharya',
    featured: false,
    inPerson: true
  },
  {
    title: 'Dr.',
    given_name: 'Priya',
    surname: 'Hasan',
    professional_title: 'Dr. of Astrophysics and Physics',
    bio: `Dr. Priya Hasan, from Moscow State and Osmania University, is an acclaimed astrophysicist. Recognized by the Department of Science & Technology,
    she's lectured at MIT and Harvard. Currently at Maulana Azad University, she co-chairs the IAU's Women in Astronomy and champions science outreach.`,
    abstract: 'Dark Skies and Bright Satellites',
    avatar: 'priya-hasan',
    inPerson: false,
    featured: true
  },
  {
    given_name: 'Vedvrat',
    surname: 'Vinayak Bedekar',
    professional_title: 'BE IT Student',
    bio: 'An amateur astronomer running an astronomy club in college. Frequent stargazer and host of stargazing events. ',
    abstract: 'Light pollution: A Camouflaging pollution',
    avatar: 'vedvrat-bedekar',
    featured: false,
    inPerson: false
  },
  {
    given_name: 'David',
    surname: 'Ault',
    professional_title: 'Director of Education For Immersive Experiences',
    bio: '',
    abstract: 'The planetarium as a creative space',
    avatar: 'david-ault',
    featured: false,
    inPerson: false
  },
  {
    given_name: 'Alejandro',
    surname: 'Sommer',
    professional_title:
      'Argentina DarkSky Chapter- Director of Ecotourism, Ministry of Tourism of the Province of Misiones',
    bio: '',
    abstract: 'Know to preserve',
    avatar: 'alejandro-sommer',
    featured: false,
    inPerson: false
  },
  {
    given_name: 'Samyukta',
    surname: 'Manikumar',
    professional_title: 'Astrotourism Consultant',
    bio: `Samyukta, director of Noctia Institute, champions dark sky conservation through astrotourism. Blending science with cultural preservation,
    she's a fellow at the International Astronomical Union, focusing on rural astrotourism resources via the 'Socio-economic development through Astronomy Flagship'.`,
    abstract: 'Harnessing Dark Skies for Socioeconomic Development in Rural Areas',
    avatar: 'samyukta-manikumar',
    inPerson: false,
    featured: true
  },
  {
    given_name: 'Upasana',
    surname: 'Dasgupta',
    professional_title: 'Canada Research Chair in Behavioural Sustainability',
    bio: `Upasana Dasgupta researches space policies at Université Laval and is on ACES Worldwide's board. With a Doctorate from McGill,
    she's an expert in space law, associated with global space entities, and emphasizes on space collision prevention and dark sky conservation.`,
    avatar: 'upasana-dasgupta',
    featured: false,
    inPerson: true
  },
  {
    given_name: 'Dinesh',
    surname: 'Nisang',
    professional_title: 'Science Communicator',
    bio: `Dinesh founded Sunday Science School and is passionate about science communication. An astronomer, he views astronomy as a unifier for humanity.
    He enjoys astrophotography, exploring nature, and is an aspiring writer with articles and a book on scientific innovation. Focus: ISAAC.`,
    avatar: 'dinesh-nisang',
    featured: false,
    inPerson: true
  },
  {
    given_name: 'Exodus',
    surname: 'Chun-Long Sit',
    professional_title: 'Transmedia Astronomy Educator',
    bio: `Exodus CL Sit from Hong Kong is a transmedia astronomy educator and science author.
    He holds roles in IAU as the National Astronomy Education Coordinator for Hong Kong and Co-Outreach Coordinator.
    A member of the Dark Sky International Committee, he champions dark-sky protection, STEAM education, and interdisciplinary science approaches.`,
    abstract: 'ASTROx Dark Sky: How to Integrate Astronomy Education into Interactive Classroom',
    avatar: 'exodus-chun-long-sit',
    featured: false,
    inPerson: false
  },
  {
    given_name: 'Nadia Madhavji',
    surname: 'and Usha Sharma',
    professional_title: 'BSc. Physics Students',
    bio: '',
    abstract: 'Affordable Radio Astronomy Lab',
    avatar: 'nadia-madhavji',
    featured: false,
    inPerson: false
  },
  {
    given_name: 'Rashmi',
    surname: 'Sheoran',
    professional_title: 'Science Communicator/ISRO Space Tutor',
    bio: `A physics graduate from Delhi University, Rashmi's worked in informal education for 4 years, sharing stories of remote scientists and hosting STEM-focused events.
    As "Astro Roxy" on Instagram with 60k+ followers, she promotes space knowledge.
    A Guinness World Record holder for detecting asteroids, she's now with IIT Gandhinagar's CCL lab, designing educational astronomy activities.`,
    abstract: 'Day and Night on the Pale Blue Dot',
    avatar: 'rashmi-sheoran',
    featured: false,
    inPerson: true
  },
  {
    title: 'Dr.',
    given_name: 'Janak',
    surname: 'Ratna Malla',
    professional_title: 'Associate Prof. Janak Ratna Malla Department of Physics Amrit Campus',
    bio: `Assoc. Prof. Dr. Janak Ratna Malla from Tribhuvan University, Nepal, is distinguished for his galaxy orientation research,
    with many international publications in astrophysics. He's been active in conferences and leadership roles. Honors include the Dirgha Sewa Padak and Shikshya Diwash Padak.`,
    abstract:
      'Spatial Orientation of Spin vectors of Galaxies in the Substructures of SDSS Supercluster S[231+030+0117]',
    avatar: 'janak-ratna',
    featured: false,
    inPerson: false
  },
  {
    title: 'Dr.',
    given_name: 'Kiran',
    surname: 'Kulkarni',
    professional_title: 'Indian Administrative Service Officer',
    bio: '',
    abstract: 'Sustainable Development through Astronomy: A Tribal Perspective',
    avatar: 'kiran-kulkarni',
    featured: true,
    inPerson: true
  },
  {
    given_name: 'João',
    surname: 'Retrê',
    professional_title: 'Science Communicator',
    bio: `João, a science communicator at the Institute of Astrophysics in Portugal, has 20 years of experience making astronomy accessible.
    He involves students in science communication, emphasizing its importance.
    He's the IAU's outreach coordinator for Portugal and leads the IAU sub-group for "Hospitals, Children Homes, Nursing Homes and Prisons"`,
    abstract: 'Future Scientists in an Astrotourium',
    avatar: 'joao-retre',
    featured: true,
    inPerson: false
  },
  {
    given_name: 'Amshu',
    surname: 'CR',
    professional_title: 'Ecopreneur',
    bio: 'Forest value chains, Land degradation, Biodynamic Agriculture, Tribal produce supply chains, Food security, knowledge preservation, Sustainablity ',
    abstract: 'The ancient science of space and agriculture for sustainability and harmony',
    avatar: 'amshu-cr',
    featured: false,
    inPerson: false
  },
  {
    given_name: 'Albert',
    surname: 'Kuntu Forson',
    professional_title: 'PhD Research Student',
    bio: 'Albert is specializing in the design, construction and implementation of a software-defined radio interferometer at the University of Mauritius',
    abstract:
      "Empowering Ghana's STEM Education: Bridging the Gap through Capacity Building in Astronomy Instrumentation",
    avatar: 'albert-forson',
    featured: false,
    inPerson: false
  },
  {
    given_name: 'Aishwarya',
    surname: 'Khade',
    professional_title: 'Mental Health Practitioner / Expressive Arts ',
    bio: '',
    abstract: 'Mental Health Arts and Astronomy',
    avatar: 'aishwarya-khade',
    featured: false,
    inPerson: true
  },
  {
    given_name: 'Hossein',
    surname: 'Khezri',
    professional_title: 'Associate of Commission C1 WG Astronomy Education Research & Methods',
    bio: '',
    abstract: 'Road to Sky',
    avatar: 'hossein-khezri',
    featured: false,
    inPerson: false
  },
  {
    given_name: 'Shweta',
    surname: 'Kulkarni',
    professional_title: 'Founder/Director of AstronEra',
    bio: '',
    abstract: 'Skill Training in Astronomy for Income Generation',
    avatar: 'shweta-kulkarni',
    featured: true,
    inPerson: true
  }
] as Speaker[]

const filterSpeakers = (featured: boolean, toSort = false) => {
  return speakers
    .filter((s: Speaker): boolean | undefined => s.featured === featured)
    .sort((a: Speaker, b: Speaker) => {
      if (!toSort) return 0
      if (a.given_name < b.given_name) {
        return -1
      }
      if (a.given_name > b.given_name) {
        return 1
      }
      return 0
    })
}
</script>

<style scoped></style>
