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
const isExpanded = ref(false)

// Generate a quote for each team member based on their role
const memberQuote = computed(() => {
  const quotes = {
    'CEO': "The universe is not just something to observe; it's something to share.",
    'CTO': 'Technology is our telescope to bring astronomy closer to everyone.',
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

// Handle navigation to team member page with view transitions
const navigateToProfile = () => {
  navigateTo(`/team/${props.member.name.toLowerCase().replaceAll(' ', '-')}`)
}
</script>

<template>
  <div
    class="team-card-wrapper"
    :style="{ 'animation-delay': animationDelay }"
  >
    <LandingGlass
      hover-effect="glow"
      glow-color="purple"
      gradient="mixed"
      intensity="low"
      interactive
      isolate-content
      class="relative team-card"
      :class="{ expanded: isExpanded }"
      @mouseenter="isExpanded = true"
      @mouseleave="isExpanded = false"
      @click="navigateToProfile"
    >
      <!-- Background elements -->
      <div class="absolute h-full w-full animate-pulse">
        <SvgStars
          class="bottom-46 left-12"
          :size="15"
          svg-color="#303030"
        />
        <SvgStars
          class="bottom-22 left-36"
          :size="8"
          svg-color="#303030"
        />
        <SvgStars
          class="right-14 top-24"
          :size="12"
          svg-color="#303030"
        />
        <SvgStars
          class="bottom-12 left-44"
          :size="20"
          svg-color="#303030"
        />
        <SvgStars
          class="left-12 top-52"
          :size="14"
          svg-color="#303030"
        />
      </div>

      <!-- Connection points for lines -->
      <div
        class="connection-point"
        :style="{ left: `${connectionPosition.x}%`, top: `${connectionPosition.y}%` }"
      ></div>

      <!-- Wrapper for content to avoid shifts -->
      <div class="card-content">
        <!-- Photo with flip effect -->
        <div class="profile-image-container">
          <div
            class="flip-card-inner"
            :class="{ 'is-flipped': isFlipped || isExpanded }"
          >
            <div class="flip-card-front">
              <div class="profile-image">
                <IBImage
                  :img="{
                    src: member.avatar,
                    alt: member.name,
                    loading: 'lazy',
                    width: '150',
                    height: '150',
                  }"
                  class="w-full h-full object-cover"
                />
              </div>
            </div>
            <div class="flip-card-back">
              <div class="profile-image">
                <IBImage
                  :img="{
                    // This would be the cartoonized version
                    src: member.avatar.replace('.jpg', '-cartoon.jpg'),
                    alt: `Cartoon version of ${member.name}`,
                    loading: 'lazy',
                    width: '150',
                    height: '150',
                  }"
                  class="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Member information -->
        <div class="member-info">
          <p class="member-name">
            {{ member.name }}
          </p>
          <p class="member-title">
            {{ member.position.title }}
          </p>

          <!-- Quote section - absolute positioned to avoid layout shifts -->
          <div
            class="member-details"
            :class="{ 'is-visible': isExpanded }"
          >
            <div class="member-quote">
              <span class="quote-marks">"</span>{{ memberQuote }}<span class="quote-marks">"</span>
            </div>

            <!-- Bio snippet -->
            <div class="member-bio">
              <p
                >{{ member.bio?.[0]?.substring(0, 120)
                }}{{ member.bio?.[0]?.length > 120 ? '...' : '' }}</p
              >
            </div>
          </div>

          <div class="member-footer">
            <AppSocialBlock
              :socials="member.socials"
              :has-title="false"
              class="relative flex items-center justify-center space-x-2"
            />
            <div class="profile-button-container">
              <NuxtLink :to="`/team/${member.name.toLowerCase().replaceAll(' ', '-')}`">
                <PrimeButton
                  severity="secondary"
                  class="profile-button"
                >
                  <span>View Profile</span>
                  <Icon
                    name="mdi:arrow-right"
                    class="ml-2 profile-arrow"
                  />
                </PrimeButton>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </LandingGlass>
  </div>
</template>

<style scoped>
.team-card-wrapper {
  animation: fadeUp 0.5s ease forwards;
  opacity: 0;
  transform: translateY(20px);
}

@keyframes fadeUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.team-card {
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  will-change: transform;
  min-height: 420px;
  position: relative;
}

.team-card:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 170px;
  position: relative;
  width: 100%;
}

.profile-image-container {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 150px;
  height: 150px;
  perspective: 1000px;
  z-index: 20;
}

.profile-image {
  width: 150px;
  height: 150px;
  overflow: hidden;
  border-radius: 9999px;
  border: 2px solid rgba(147, 51, 234, 0.3);
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.8s;
  transform-style: preserve-3d;
}

.is-flipped {
  transform: rotateY(180deg);
}

.flip-card-front,
.flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.flip-card-back {
  transform: rotateY(180deg);
}

.member-info {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 16px;
}

.member-name {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 4px;
  text-align: center;
}

.member-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: rgba(147, 51, 234, 0.9);
  margin-bottom: 16px;
  text-align: center;
}

.member-details {
  opacity: 0;
  max-height: 0;
  overflow: hidden;
  transition: all 0.3s ease;
  width: 100%;
}

.member-details.is-visible {
  opacity: 1;
  max-height: 200px;
  margin: 12px 0;
}

.member-quote {
  font-style: italic;
  font-size: 0.875rem;
  text-align: center;
  color: rgba(167, 139, 250, 0.9);
  margin-bottom: 12px;
}

.member-bio {
  font-size: 0.75rem;
  text-align: center;
}

.member-footer {
  margin-top: 16px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.quote-marks {
  font-size: 1.2em;
  font-weight: bold;
  color: rgba(99, 102, 241, 0.5);
}

.connection-point {
  position: absolute;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: rgba(99, 102, 241, 0.3);
  z-index: 20;
}

.profile-button-container {
  width: 100%;
  display: flex;
  justify-content: center;
}

.profile-button {
  transition: all 0.3s ease;
}

.profile-button:hover .profile-arrow {
  transform: translateX(4px);
}

.profile-arrow {
  transition: transform 0.3s ease;
}
</style>
