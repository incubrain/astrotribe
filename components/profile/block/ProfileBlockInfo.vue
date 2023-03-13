<template>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div class="col-span-2 col-start-1">
            <h1 class="text-2xl font-semibold">{{ props.user.given_name }} {{ props.user.surname }}</h1>
            <!-- <h4 class="text-lg">{{ props.user.profession }} {{ type === 'mentor' ?   `- Associated with: ${props.user.associated_companies}` : `` }}</h4> -->
            <h6
                v-if="home"
                class="text-md pt-3 flex items-center"
            >
                <Icon name="uil:location-point" size="18px" />
                {{ home.locations.city }}, {{ home.locations.state_province }},
                {{ home.locations.country }}
            </h6>
        </div>
        <div class="col-span-1 lg:col-start-2 flex flex-col gap-2"></div>
    </div>
</template>

<script setup lang="ts">

import type { UserFull } from '@/types/types'


const props = defineProps({
    user: {
        type: Object as PropType<UserFull>,
        required: true,
    },
})

const home = props.user.user_locations?.find((location) => location.is_home === true)

</script>

<style scoped>

</style>
