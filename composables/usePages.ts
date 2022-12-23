import { ref, computed } from 'vue'

interface Page {
    id: number
    name: string
    current: boolean
    slug: string
    children?: Page[]
}

const pages = ref([
    {
        id: 0,
        name: 'News',
        current: true,
        slug: '/news',
        children: [
            { id: 1, name: 'New', current: false, slug: '/' },
            { id: 2, name: 'Discover', current: false, slug: '/discover' },
        ],
    },
    {
        id: 1,
        name: 'Events',
        current: false,
        slug: '/events',
        children: [
            { id: 10, name: 'New', current: false, slug: '/' },
            { id: 11, name: 'Discover', current: false, slug: '/discover' },
        ],
    },
    {
        id: 2,
        name: 'Users',
        current: false,
        slug: '/users',
        children: [
            { id: 20, name: 'All', current: false, slug: '/' },
            { id: 21, name: 'Nearby', current: false, slug: '/nearby' },
        ],
    },
] as Page[])

const currentPage = ref('Home')

export default function usePages() {
    return {
        currentPage: computed(() => currentPage.value),
        setPage: (newPage: string) => {
            currentPage.value = newPage
        },
        pages: computed(() => pages.value),
        tabs: (currentPage: string) =>
            pages.value.find((p) => p.name.toLocaleLowerCase() === currentPage),
    }
}
