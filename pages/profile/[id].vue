<template>
    <div>
        <!-- <ProfileUser v-if="visible"/> -->
        <!-- <ProfileMentor /> -->
        <p>{{ s.user }}</p>
        <p>{{ id }}</p>

    </div>
</template>

<script setup lang="ts">

const route = useRoute()
const id = route.params.id

console.log('profile', id)

const u = useUsersStore()
await u.getSingleUser({ userId: id })

const s = appState()
console.log('userProfile', s.user)

definePageMeta({
    name: 'Profile',
})

</script>
