<script setup lang="ts">
import { ref, computed } from 'vue'
import type { TeamMemberType } from '@/types/team'

const props = defineProps({
  member: {
    type: Object as PropType<TeamMemberType>,
    required: true,
  },
  index: {
    type: Number,
    default: 0,
  },
})

// Handle flip animation state
const isFlipped = ref(false)

const handleHover = (isHovering: boolean) => {
  isFlipped.value = isHovering
}

const { conf } = useAnimation()

// Generate a quote for each team member based on their role
const memberQuote = computed(() => {
  const quotes = {
    'CEO': 'Dark skies and bright minds go hand in hand, together we can preserve both.',
    'CTO': 'Exploration fuels discovery; discovery fuels innovation.',
    'Operations Manager': 'In the vastness of space, teamwork is our guiding star.',
  }

  return quotes[props.member.position.title] || 'Exploring the cosmos together, one star at a time.'
})

// Calculate the animation delay for staggered appearance
const animationDelay = computed(() => `${props.index * 150}ms`)

// Calculate position for connection lines
const connectionPosition = computed(() => {
  // This would be replaced with actual position calculations in a real implementation
  const positions = [
    { x: 25, y: 60 },
    { x: 75, y: 40 },
    { x: 50, y: 80 },
  ]
  return positions[props.index % positions.length]
})

// Placeholder URL for missing images
const getPlaceholderUrl = (width: number, height: number) => {
  return `https://via.placeholder.com/${width}x${height}?text=No+Image`
}

const imageUrl = computed(() => props.member.avatar || getPlaceholderUrl(350, 350))

// Handle profile link with view transitions
const navigateToProfile = () => {
  navigateTo(`/team/${props.member.name.toLowerCase().replaceAll(' ', '-')}`)
}
</script>

<template>
  <div
    v-motion
    :style="{ 'animation-delay': animationDelay }"
    :initial="conf.card.initial"
    :enter="{
      ...conf.card.enter,
      transition: { ...conf.card.enter.transition, delay: index * 0.1 },
    }"
  >
    <IBGlass
      hover-effect="glow"
      gradient="mixed"
      intensity="low"
      :interactive="true"
      class="relative team-card h-full"
      @mouseenter="handleHover(true)"
      @mouseleave="handleHover(false)"
    >
      <!-- Background elements -->
      <div class="absolute h-full w-full pointer-events-none">
        <div
          v-for="i in 5"
          :key="`star-${i}`"
          class="absolute rounded-full bg-primary-400/20 animate-pulse"
          :style="{
            width: `${Math.random() * 10 + 5}px`,
            height: `${Math.random() * 10 + 5}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 3 + 2}s`,
            animationDelay: `${Math.random()}s`,
          }"
        ></div>
      </div>

      <!-- Connection points for lines -->
      <div
        class="connection-point absolute w-1 h-1 rounded-full bg-primary-400/30 z-10"
        :style="{ left: `${connectionPosition.x}%`, top: `${connectionPosition.y}%` }"
      ></div>

      <!-- Wrapper for fixed height content -->
      <div class="card-content flex flex-col items-center justify-between gap-4 h-full">
        <!-- Photo with flip effect -->
        <div class="profile-image-container relative w-32 h-32 perspective-1000 mb-2">
          <div
            class="flip-card-inner relative w-full h-full transition-transform duration-700 transform-style-preserve-3d"
            :class="{ 'rotate-y-180': isFlipped }"
          >
            <div
              class="flip-card-front absolute w-full h-full backface-hidden rounded-full overflow-hidden"
            >
              <NuxtImg
                :src="imageUrl"
                :alt="member.name"
                loading="lazy"
                width="128"
                height="128"
                class="w-full h-full object-cover"
                view-transition-name="team-avatar"
              />
            </div>
            <div
              class="flip-card-back absolute w-full h-full backface-hidden rotate-y-180 rounded-full overflow-hidden"
            >
              <NuxtImg
                :src="imageUrl.replace('.jpg', '-cartoon.jpg')"
                :alt="`Cartoon version of ${member.name}`"
                loading="lazy"
                width="128"
                height="128"
                class="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <!-- Member information -->
        <div class="member-info flex flex-col items-center text-center flex-grow">
          <h3 class="text-xl font-bold text-white mb-1">{{ member.name }}</h3>
          <p class="text-primary-400 text-sm font-medium mb-4">{{ member.position.title }}</p>

          <!-- Member quote -->
          <p class="member-quote text-sm italic text-primary-200 mb-4 px-2">
            "{{ memberQuote }}"
          </p>
        </div>

        <div class="member-footer w-full">
          <!-- Social links -->
          <div class="flex justify-center mb-4">
            <AppSocialBlock
              :socials="member.socials"
              :has-title="false"
              size="24px"
            />
          </div>

          <!-- View Profile button -->
          <!-- <div class="profile-button-container">
            <NuxtLink
              v-slot="{ navigate }"
              :to="`/team/${member.name.toLowerCase().replaceAll(' ', '-')}`"
              custom
            >
              <PrimeButton
                severity="secondary"
                @click="navigate"
              >
                <span>View Profile</span>
                <Icon
                  name="mdi:arrow-right"
                  class="ml-2 profile-arrow transition-transform duration-300"
                />
              </PrimeButton>
            </NuxtLink>
          </div> -->
        </div>
      </div>
    </IBGlass>
  </div>
</template>

<style scoped>
.team-card {
  transition: transform 0.3s ease;
  transform-origin: center center;
}

.team-card:hover {
  transform: scale(1.02);
}

.profile-button:hover .profile-arrow {
  transform: translateX(4px);
}

/* 3D flip effect styles */
.perspective-1000 {
  perspective: 1000px;
}

.transform-style-preserve-3d {
  transform-style: preserve-3d;
}

.backface-hidden {
  backface-visibility: hidden;
}

.rotate-y-180 {
  transform: rotateY(180deg);
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
}
</style>
