<template>
    <!-- <ProfileUser v-if="visible"/> -->
    <ProfileMentor />
</template>

<script setup lang="ts">

let visible = ref(true)

function change(v) {
    visible.value = v
    console.log('change', visible)
}

definePageMeta({
    name: 'Profile',
})

</script>
