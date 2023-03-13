<template>
    <div>
        <CommonCoverImg
            :url="`https://idsifamzvzlpgnmlnldw.supabase.co/storage/v1/object/public/profile-public/${s.user.cover_image}`"
        />
        <div
            class="min-h-full grid grid-cols-[minmax(160px,1fr)] lg:grid-cols-[minmax(140px,.4fr)_minmax(600px,4fr)_minmax(140px,0.4fr)] lg:max-w-[1240px] mx-auto max-w-[95%]"
        >
            <div
                class="rounded-lg row-start-1 col-span-1 lg:col-start-2 w-full h-[220px] lg:h-[420px] relative bg-cover"
            >
                <ProfileBlockBadge
                    class="lg:col-start-2 absolute bottom-0 right-0 bg-[#343434] py-2 px-4 rounded-t-lg"
                    :role="s.user.main_role.role"
                />
            </div>
            <div
                class="bg-white w-full h-[200px] relative lg:col-start-2 row-span-1 row-start-2 py-[140px] px-12 rounded-b-lg"
            >
                <ProfileBlockAvatar :avatar="s.user.avatar" />
                <ProfileBlockInfo :user="s.user" :type="s.user.main_role.role"/>
            </div>
                <!-- <ProfileUser v-if="role === 'User'" :user="s.user" /> -->
                <ProfileMentor v-if="s.user.main_role.role === 'Mentor'" :user="s.user" />
                <ProfileGuide v-if="s.user.main_role.role  === 'Guide'" :user="s.user" />
                <ProfileAdmin v-if="s.user.main_role.role  === 'Admin'" :user="s.user" />
        </div>
    </div>
</template>

<script setup lang="ts">

import ProfileGuide from './partials/ProfileGuide.vue'
import ProfileMentor from './partials/ProfileMentor.vue'
import ProfileAdmin from './partials/ProfileAdmin.vue'


const route = useRoute()
const id = route.params.id

console.log('profile', id)

const u = useUsersStore()
await u.getSingleUser({ userId: Number(id) })

const s = appState()
console.log('userProfile', s.user)

definePageMeta({
    name: 'Profile',
})

</script>
