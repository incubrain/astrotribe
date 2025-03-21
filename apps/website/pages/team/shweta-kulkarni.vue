<script setup lang="ts">
// Import required composables
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'

// Page metadata
definePageMeta({
  name: 'Shweta',
})

// Media items - doubled content for the Spotlight section
const mediaItems = [
  {
    type: 'article',
    title: 'Shweta Kulkarni is RAS fellow at 23',
    source: 'ThePrint',
    description: 'A milestone for Indian astronomy.',
    thumbnail: '/images/team/media/shweta-print.jpg',
    link: 'https://theprint.in/science/indian-astronomer-peers-into-infant-universe-becomes-first-indian-woman-to-be-ras-fellow-at-23/160131/',
  },
  {
    type: 'article',
    title: 'Sky Is Literally The Limit For Astro-entrepreneur Shweta Kulkarni',
    source: 'SheThePeople',
    description: 'Her journey as a trailblazer.',
    thumbnail: '/images/team/media/shweta-shethepeople.jpg',
    link: 'https://www.shethepeople.tv/news/astro-entrepreneur-shweta-kulkarni/',
  },
  {
    type: 'video',
    title: 'An Astronomer turned Entrepreneur',
    source: 'YouTube',
    description: 'Shweta shares her story.',
    thumbnail: '/images/team/media/shweta-youtube.jpg',
    link: 'https://www.youtube.com/watch?v=7TFIaOOHw4M',
  },
  {
    type: 'video',
    title: 'OddVata ft. Shweta Kulkarni',
    source: 'YouTube',
    description: 'A deep dive into her impact.',
    thumbnail: '/images/team/media/shweta-oddvata.jpg',
    link: 'https://www.youtube.com/watch?v=UiLZo1fYATI',
  },
  {
    type: 'article',
    title: 'Women in Astronomy: Breaking Barriers',
    source: 'Space Mag',
    description: "Featuring Shweta's pioneering work.",
    thumbnail: '/images/team/media/women-astronomy.jpg',
    link: '#',
  },
  {
    type: 'article',
    title: 'Astronomy Education in Rural Areas',
    source: 'Education Today',
    description: 'How AstronEra is making a difference.',
    thumbnail: '/images/team/media/rural-education.jpg',
    link: '#',
  },
  {
    type: 'video',
    title: 'Dark Sky Conservation Interview',
    source: 'EcoTalk',
    description: 'Discussing light pollution solutions.',
    thumbnail: '/images/team/media/dark-sky-interview.jpg',
    link: '#',
  },
  {
    type: 'article',
    title: 'Top 30 Under 30: Science & Education',
    source: 'Forbes India',
    description: 'Recognition for innovation in astronomy.',
    thumbnail: '/images/team/media/forbes-feature.jpg',
    link: '#',
  },
]

// Awards
const awards = [
  {
    title: 'Royal Astronomical Society Fellow',
    year: '2018',
    description: 'First Indian woman to become RAS Fellow at age 23',
    icon: 'mdi:medal-outline',
  },
  {
    title: 'Dark Sky Defender Award',
    year: '2024',
    description: 'Recognition for light pollution advocacy and conservation',
    icon: 'mdi:shield-star-outline',
  },
  {
    title: 'International Astronomical Union Award',
    year: '2022',
    description: 'For exceptional contribution to astronomy education',
    icon: 'mdi:star-shooting-outline',
  },
  {
    title: 'Top 100 Women Entrepreneurs',
    year: '2020',
    description: "Listed among India's most innovative business leaders",
    icon: 'mdi:trophy-outline',
  },
]

// Achievements timeline
const achievements = [
  {
    year: 2015,
    title: 'Co-founded AstronEra',
    description: 'Launched a platform for astronomy education.',
    icon: 'mdi:rocket-launch',
  },
  {
    year: 2017,
    title: 'Top-Rated Udemy Course',
    description: 'Reached thousands with online learning.',
    icon: 'mdi:school',
  },
  {
    year: 2018,
    title: 'First Indian Woman RAS Fellow at 23',
    description: 'A historic achievement for Indian astronomy.',
    icon: 'mdi:medal',
  },
  {
    year: 2018,
    title: 'IIM-Nagpur Incubation',
    description: 'Recognized for innovation in astronomy education.',
    icon: 'mdi:office-building',
  },
  {
    year: 2023,
    title: "India's First Dark Sky Conference",
    description: 'Pioneered conservation efforts for dark skies in India.',
    icon: 'mdi:weather-night',
  },
  {
    year: 2024,
    title: 'Dark Sky Defender Award',
    description: 'Honored for advocacy in light pollution reduction.',
    icon: 'mdi:shield-star',
  },
  {
    year: 'Ongoing',
    title: 'Global Speaker & IAU Award Winner',
    description: 'Inspiring audiences worldwide through astronomy.',
    icon: 'mdi:microphone',
  },
]

// Contact form
const contactForm = ref({
  name: '',
  email: '',
  message: '',
})

const isSubmitting = ref(false)
const showSuccessMessage = ref(false)

const submitForm = async () => {
  isSubmitting.value = true

  try {
    // Simulating API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Reset form
    contactForm.value = {
      name: '',
      email: '',
      message: '',
    }

    showSuccessMessage.value = true
    setTimeout(() => {
      showSuccessMessage.value = false
    }, 3000)
  } catch (error) {
    console.error('Error submitting form:', error)
  } finally {
    isSubmitting.value = false
  }
}

// Initialize animations after component mounts
onMounted(() => {
  // Hero section animations
  gsap.from('.hero-title', {
    y: 30,
    opacity: 0,
    duration: 0.8,
    delay: 0.2,
  })

  gsap.from('.hero-subtitle', {
    y: 20,
    opacity: 0,
    duration: 0.8,
    delay: 0.4,
  })

  gsap.from('.hero-tagline', {
    y: 20,
    opacity: 0,
    duration: 0.8,
    delay: 0.6,
  })

  gsap.from('.hero-cta', {
    y: 20,
    opacity: 0,
    duration: 0.8,
    delay: 0.8,
  })
})

// Scroll to section
const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId)
  if (element) {
    window.scrollTo({
      top: element.offsetTop - 80, // Adjust for header height
      behavior: 'smooth',
    })
  }
}
</script>

<template>
  <div class="shweta-page">
    <!-- Hero Section -->
    <section
      id="hero"
      class="hero relative h-screen flex items-center"
    >
      <div class="stars-bg absolute inset-0"></div>
      <div
        class="wrapper max-w-6xl mx-auto z-10 flex flex-col md:flex-row items-center justify-between"
      >
        <div class="hero-content md:w-1/2 mb-10 md:mb-0">
          <h1 class="hero-title text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span class="text-white">Shweta</span>
            <span class="text-primary-600">Kulkarni</span>
          </h1>

          <h2 class="hero-subtitle text-xl md:text-2xl text-gray-200 mb-6">
            AstroPreneur | Director of AstronEra | Champion of Dark Skies
          </h2>

          <p class="hero-tagline text-lg text-gray-300 italic mb-2">
            Democratizing Astronomy for a Brighter Future
          </p>

          <!-- Dark Sky Defender Award highlight -->
          <div
            class="award-highlight flex items-center mb-8 py-2 px-3 bg-primary-900/30 border border-primary-600/30 rounded-md w-fit"
          >
            <Icon
              name="mdi:shield-star"
              class="text-primary-600 mr-2"
              size="20"
            />
            <span class="text-primary-400 text-sm font-medium"
              >Dark Sky Defender Award Recipient 2024</span
            >
          </div>

          <button
            class="hero-cta bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded transition duration-300"
            @click="scrollToSection('about')"
          >
            Explore My Journey
          </button>
        </div>

        <div class="hero-image md:w-1/2 flex justify-end">
          <div class="relative w-full max-w-md">
            <div
              class="absolute inset-0 bg-primary-600/20 rounded-full blur-xl -z-10 scale-90"
            ></div>
            <IBImage
              :img="{
                src: '/images/team/shweta-kulkarni.jpg',
                alt: 'Shweta Kulkarni',
                width: '500',
                height: '500',
              }"
              class="rounded-full border-2 border-primary-600/30 shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- About & Awards Section -->
    <section
      id="about"
      class="py-16 relative"
    >
      <div
        class="absolute inset-0 bg-gradient-to-br from-slate-900 via-primary-900/30 to-slate-900 z-0"
      ></div>
      <div
        class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-600/50 to-transparent"
      ></div>
      <div
        class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-600/50 to-transparent"
      ></div>

      <div class="wrapper max-w-6xl mx-auto z-10 relative">
        <div class="section-title mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-white">
            About <span class="text-primary-600">Shweta</span>
          </h2>
          <div class="h-1 w-20 bg-primary-600 mt-2"></div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <!-- About Content -->
          <div class="about-content space-y-6">
            <p class="text-lg text-gray-200">
              Shweta Kulkarni is an AstroPreneur and the Director of AstronEra, dedicated to
              democratizing astronomy through innovative e-learning and outreach. With a passion for
              both science and education, she has spent over a decade building bridges between
              astronomy and society.
            </p>
            <p class="text-lg text-gray-200">
              As the first Indian woman to become a Royal Astronomical Society Fellow at just 23
              years old, Shweta has broken barriers and set new benchmarks in the field of astronomy
              education in India.
            </p>
            <p class="text-lg text-gray-200">
              Through her initiatives, she has reached thousands of learners across the globe,
              inspiring the next generation of stargazers while advocating for dark sky
              conservation.
            </p>

            <!-- Mission Statement -->
            <div
              class="mt-8 p-6 bg-gray-900/50 backdrop-blur-sm border border-primary-800/50 rounded-lg"
            >
              <h3 class="text-xl font-bold text-white mb-4 flex items-center">
                <Icon
                  name="mdi:flag"
                  class="text-primary-600 mr-2"
                  size="24"
                />
                My Mission
              </h3>
              <p class="text-lg text-white mb-2 font-semibold">
                To make astronomy accessible to all, fostering scientific curiosity and preserving
                our night skies for future generations.
              </p>
              <p class="text-gray-300">
                Through initiatives like AstroTribe and dark sky advocacy, I empower underprivileged
                communities and champion sustainable stargazing practices.
              </p>
            </div>
          </div>

          <!-- Awards Section -->
          <div class="awards-section">
            <h3 class="text-xl font-bold text-white mb-6 flex items-center">
              <Icon
                name="mdi:trophy"
                class="text-primary-600 mr-2"
                size="24"
              />
              Recognition & Awards
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                v-for="(award, index) in awards"
                :key="index"
                class="award-item bg-gray-900/30 backdrop-blur-sm border border-primary-800/30 rounded-lg p-4 transition-all duration-300 hover:border-primary-600/50 hover:shadow-[0_0_15px_rgba(102,126,234,0.15)]"
              >
                <div class="flex items-start">
                  <div
                    class="award-icon w-12 h-12 rounded-full bg-primary-900/50 flex items-center justify-center mr-4 flex-shrink-0"
                  >
                    <Icon
                      :name="award.icon"
                      class="text-primary-400"
                      size="20"
                    />
                  </div>
                  <div>
                    <h4 class="text-lg font-semibold text-white">{{ award.title }}</h4>
                    <p class="text-primary-400 text-sm mb-1">{{ award.year }}</p>
                    <p class="text-gray-300 text-sm">{{ award.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Achievements Section - Vertical Timeline -->
    <section
      id="achievements"
      class="py-16 relative"
    >
      <div class="wrapper max-w-6xl mx-auto z-10 relative">
        <div class="section-title mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-white">
            A Decade of <span class="text-primary-600">Impact</span>
          </h2>
          <div class="h-1 w-20 bg-primary-600 mt-2"></div>
        </div>

        <div class="timeline-vertical relative">
          <!-- Center line -->
          <div
            class="absolute left-[20px] md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-px bg-primary-600/40"
          ></div>

          <div class="space-y-10">
            <div
              v-for="(achievement, index) in achievements"
              :key="index"
              class="relative flex flex-col md:flex-row md:even:flex-row-reverse items-start"
            >
              <!-- Timeline dot -->
              <div
                class="absolute left-[20px] md:left-1/2 transform md:-translate-x-1/2 w-10 h-10 rounded-full bg-primary-900 border-2 border-primary-600 flex items-center justify-center z-10"
              >
                <Icon
                  :name="achievement.icon"
                  class="text-primary-400"
                  size="16"
                />
              </div>

              <!-- Content -->
              <div class="md:w-[calc(50%-30px)] pl-16 md:pl-0 md:pr-10 md:even:pl-10 md:even:pr-0">
                <div
                  class="bg-gray-900/30 backdrop-blur-sm border border-primary-800/30 rounded-lg p-5 transition-all duration-300 hover:border-primary-600/50 hover:shadow-[0_0_15px_rgba(102,126,234,0.15)]"
                >
                  <div
                    class="inline-block px-3 py-1 bg-primary-900/50 text-primary-400 rounded-full text-sm font-bold mb-3"
                  >
                    {{ achievement.year }}
                  </div>

                  <h3 class="text-lg font-semibold text-white mb-2">{{ achievement.title }}</h3>
                  <p class="text-gray-300">{{ achievement.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Media Section -->
    <section
      id="media"
      class="media py-16 relative"
    >
      <div class="wrapper max-w-6xl mx-auto z-10 relative">
        <div class="section-title mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-white">
            In the <span class="text-primary-600">Spotlight</span>
          </h2>
          <div class="h-1 w-20 bg-primary-600 mt-2"></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="(item, index) in mediaItems"
            :key="index"
            class="media-item group bg-gray-900/30 backdrop-blur-sm border border-primary-800/30 rounded-lg overflow-hidden transition-all duration-300 hover:border-primary-600/50 hover:shadow-[0_0_15px_rgba(102,126,234,0.15)]"
          >
            <a
              :href="item.link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div class="media-thumbnail relative aspect-video overflow-hidden">
                <IBImage
                  :img="{
                    src: item.thumbnail,
                    alt: item.title,
                    width: '400',
                    height: '225',
                  }"
                  class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div
                  v-if="item.type === 'video'"
                  class="absolute inset-0 flex items-center justify-center bg-black/30"
                >
                  <div
                    class="w-12 h-12 rounded-full bg-primary-600/80 flex items-center justify-center"
                  >
                    <Icon
                      name="mdi:play"
                      size="24"
                      class="text-white ml-1"
                    />
                  </div>
                </div>
                <div
                  class="absolute top-2 left-2 px-2 py-1 bg-gray-900/70 rounded text-xs font-semibold"
                >
                  {{ item.source }}
                </div>
              </div>

              <div class="p-4">
                <h3 class="text-lg font-semibold text-white mb-1 line-clamp-2">{{ item.title }}</h3>
                <p class="text-sm text-gray-400">{{ item.description }}</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section
      id="contact"
      class="contact py-16 relative"
    >
      <div
        class="absolute inset-0 bg-gradient-to-br from-slate-900 via-primary-900/30 to-slate-900 z-0"
      ></div>
      <div
        class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-600/50 to-transparent"
      ></div>
      <div
        class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-600/50 to-transparent"
      ></div>

      <div class="wrapper max-w-6xl mx-auto z-10 relative">
        <div class="section-title mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-white">
            Get in <span class="text-primary-600">Touch</span>
          </h2>
          <div class="h-1 w-20 bg-primary-600 mt-2"></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div
            class="contact-form bg-gray-900/30 backdrop-blur-sm border border-primary-800/30 rounded-lg p-6"
          >
            <form @submit.prevent="submitForm">
              <div class="mb-5">
                <label
                  for="name"
                  class="block text-white mb-2"
                  >Name</label
                >
                <input
                  id="name"
                  v-model="contactForm.name"
                  type="text"
                  required
                  class="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded focus:border-primary-600 focus:ring focus:ring-primary-600/20 text-white"
                  placeholder="Your name"
                />
              </div>

              <div class="mb-5">
                <label
                  for="email"
                  class="block text-white mb-2"
                  >Email</label
                >
                <input
                  id="email"
                  v-model="contactForm.email"
                  type="email"
                  required
                  class="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded focus:border-primary-600 focus:ring focus:ring-primary-600/20 text-white"
                  placeholder="your@email.com"
                />
              </div>

              <div class="mb-5">
                <label
                  for="message"
                  class="block text-white mb-2"
                  >Message</label
                >
                <textarea
                  id="message"
                  v-model="contactForm.message"
                  required
                  class="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded focus:border-primary-600 focus:ring focus:ring-primary-600/20 text-white h-32"
                  placeholder="Your message here..."
                ></textarea>
              </div>

              <button
                type="submit"
                class="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded font-semibold transition duration-300 disabled:bg-primary-800/70 disabled:cursor-not-allowed"
                :disabled="isSubmitting"
              >
                <span v-if="isSubmitting">
                  <Icon
                    name="mdi:loading"
                    class="animate-spin mr-2"
                  />
                  Sending...
                </span>
                <span v-else>Send Message</span>
              </button>

              <div
                v-if="showSuccessMessage"
                class="mt-4 p-3 bg-green-800/50 text-green-200 rounded text-center"
              >
                Message sent successfully! I'll get back to you soon.
              </div>
            </form>
          </div>

          <div class="contact-details flex flex-col justify-between">
            <div>
              <h3 class="text-xl font-bold text-white mb-6 flex items-center">
                <Icon
                  name="mdi:account-circle"
                  class="text-primary-600 mr-2"
                  size="24"
                />
                Connect With Me
              </h3>

              <div class="mb-6">
                <h4 class="text-lg font-semibold text-primary-400 mb-2">Email</h4>
                <a
                  href="mailto:shweta@astronera.org"
                  class="text-gray-300 hover:text-primary-400 transition-colors flex items-center"
                >
                  <Icon
                    name="mdi:email"
                    class="mr-2"
                    size="18"
                  />
                  shweta@astronera.org
                </a>
              </div>

              <div class="mb-10">
                <h4 class="text-lg font-semibold text-primary-400 mb-2">Social Media</h4>
                <div class="flex space-x-3">
                  <a
                    href="https://www.linkedin.com/in/shweta-kulkarni-11096a122/"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="w-10 h-10 rounded-full bg-primary-900/50 flex items-center justify-center hover:bg-primary-700 transition-colors"
                  >
                    <Icon
                      name="mdi:linkedin"
                      size="18"
                      class="text-white"
                    />
                  </a>
                  <a
                    href="https://twitter.com/ShwetaKulkarni"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="w-10 h-10 rounded-full bg-primary-900/50 flex items-center justify-center hover:bg-primary-700 transition-colors"
                  >
                    <Icon
                      name="mdi:twitter"
                      size="18"
                      class="text-white"
                    />
                  </a>
                  <a
                    href="https://www.instagram.com/shwetakk6/"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="w-10 h-10 rounded-full bg-primary-900/50 flex items-center justify-center hover:bg-primary-700 transition-colors"
                  >
                    <Icon
                      name="mdi:instagram"
                      size="18"
                      class="text-white"
                    />
                  </a>
                </div>
              </div>
            </div>

            <div
              class="quote bg-gray-900/30 backdrop-blur-sm border-l-4 border-primary-600/70 p-5 rounded-r"
            >
              <p class="text-lg italic text-gray-300 mb-2">
                "The stars have always been there to remind us that even in the darkest nights,
                there's beauty above us. My work is about bringing that beauty closer to everyone."
              </p>
              <p class="text-right text-primary-400 font-semibold">– Shweta Kulkarni</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Timeline styles */
.timeline-vertical {
  min-height: 500px;
}

/* Make sure the timeline is positioned properly on mobile */
@media (max-width: 768px) {
  .timeline-vertical .absolute {
    left: 20px;
    transform: none;
  }
}

/* Section styles */
section {
  position: relative;
}

section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100px;
  pointer-events: none;
  z-index: 1;
}

section:not(:first-child)::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100px;
  pointer-events: none;
  z-index: 1;
}
</style>
