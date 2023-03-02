<template>
    <article
        class="rounded-lg p-1 text-center flex items-center relative flex-col
            overflow-hidden animate-swipe-in scale-x-0 origin-left"
    >
        <div
            class="bg-white w-full flex items-center flex-row rounded-lg h-full p-6 gap-4 justify-between"
        >
            <div class="flex gap-2 justify-center items-center">
                <img
                    src="https://idsifamzvzlpgnmlnldw.supabase.co/storage/v1/object/public/profile-public/1/avatar/upwork.png"
                    class="rounded-full h-20 aspect-square object-cover object-top"
                />
                <div class="flex flex-col gap-2 align-start">
                    <h2 class="text-lg font-semibold">{{ props.user.given_name }} {{ props.user.surname }}</h2>
                    <small class="text-xs font-light">@{{ props.user.username }}, online: {{ lastSeen }}</small>
                </div>
            </div>
            <div class="flex flex-col align-start h-full justify-between">
                <Icon name="simple-line-icons:user-follow" size="26px" />
                <!-- <Icon name="simple-line-icons:user-unfollow" size="26px" /> -->
                <NuxtLink :to="`/profile/${props.user.id}`">
                    <Icon name="carbon:user-profile" size="26px" />
                </NuxtLink>
            </div>
        </div>
    </article>
</template>

<script setup lang="ts">

interface Props {
    user: {
        id: number
        given_name: string
        surname: string
        username: string
        featured_image: string
        last_seen: string
        user_roles: string[]
    }
}

const props = withDefaults(defineProps<Props>(), {
    user: () => ({
        id: 0,
        given_name: '',
        surname: '',
        username: '',
        featured_image: '',
        last_seen: '',
        user_roles: [],
    }),
})

const h = useHelpers()

const lastSeen = h.time.lastSeen(props.user.last_seen)

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

</style>
