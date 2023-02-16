<template>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div class="col-span-2 col-start-1">
            <h1 class="text-2xl font-semibold">{{ user.name }}</h1>
            <h4 class="text-lg">{{ user.profession }} {{ type === 'mentor' ?   `- Associated with: ${user.associated_companies}` : `` }}</h4>
            <h6 class="text-md pt-3 flex items-center">
                <Icon name="uil:location-point" size="18px" />
                {{ home.town }}, {{ home.district }}, {{ home.state }},
                {{ home.country }}
            </h6>
        </div>
        <div class="col-span-1 lg:col-start-2 flex flex-col gap-2"></div>
    </div>
</template>

<script setup lang="ts">
interface Props {
    type: string
    user: {
        id: number
        name: string
        profession: string
        avatar: string
        dob: string
        location: [
            {
                type: string
                country: string
                state: string
                district: string
                town: string
            }
        ]
        introduction: string
        hashtags: string[]
        socials: [
            {
                name: string
                url: string
            }
        ]
        quote: string
        associated_companies: string
        interests: string[]
        awards: string
        information: string
    }
}

const props = withDefaults(defineProps<Props>(), {
    type: 'user',
    user: Object,
})

const { user } = props

const home = user.location.find((l) => l.type === 'home')!

</script>

<style scoped>

</style>
