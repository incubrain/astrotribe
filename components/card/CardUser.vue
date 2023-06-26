<template>
  <article
    class="relative flex flex-col text-center origin-left md:rounded-lg md:overflow-hidden animate-swipe-in"
  >
    <div class="relative flex flex-col w-full h-full gap-2 p-4 foreground md:p-6 md:gap-4">
      <div
        v-if="props.user"
        class="flex flex-row items-center justify-between w-full gap-2 md:gap-4"
      >
        <NuxtLink
          :to="`profile/${props.user.id}`"
          class="group"
        >
          <div class="flex items-center justify-center gap-2">
            <NuxtImg
              :src="
                s.image.single({
                  bucket: 'profile-public',
                  folderPath: `${props.user.id}/avatar`,
                  file: props.user.avatar,
                  fileType: 'user-avatar',
                  isPrivate: false,
                })
              "
              loading="lazy"
              width="40"
              height="40"
              quality="80"
              class="object-top rounded-full"
            />
            <div class="flex flex-col gap-2 align-start">
              <h2
                class="text-sm font-semibold tracking-tighter text-left md:text-lg group-hover:underline group-hover:underline-offset-2"
              >
                {{ props.user.given_name }} {{ props.user.surname }}
              </h2>
              <div class="flex items-start w-full gap-1 text-xs">
                <span
                  v-if="props.user.main_role.name !== 'User'"
                  class="flex items-center justify-center font-light"
                >
                  <UIcon
                    :name="u.users.roleIcon(props.user.main_role.id)"
                    class="w-5 h-5 mr-1 text-green-700"
                  />
                  {{ props.user.main_role.name }} | @{{ props.user.username }}
                </span>
                <span
                  v-else
                  class="font-light"
                >
                  @{{ props.user.username }}
                </span>
              </div>
            </div>
          </div>
        </NuxtLink>
        <div class="absolute flex-row justify-center gap-1 top-2 right-3 align-center">
          <UIcon
            v-if="props.user.is_following"
            name="i-mdi-account-multiple-check"
            class="flex justify-end items-start w-[26px] h-[26px] text-green-800 hover:text-red-800 cursor-pointer"
          />
          <UIcon
            v-else
            name="i-mdi-account-multiple-plus"
            class="flex justify-end items-start w-[26px] h-[26px] hover:text-green-800 cursor-pointer"
          />
        </div>
      </div>
      <p
        v-if="props.user.introduction"
        class="text-xs text-left"
      >
        {{ props.user.introduction?.slice(0, 120) }}...
      </p>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { UserBasic } from '@/types'

const s = useStorage()

const props = defineProps({
  user: {
    type: Object as PropType<UserBasic>,
    required: true
  }
})

const u = useUtils()

// const lastSeen = u.time.lastSeen(props.user.last_seen)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
</style>
