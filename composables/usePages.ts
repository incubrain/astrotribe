import { ref, computed } from 'vue'

interface Page {
    id: number
    name: string
    current: boolean
    icon: string
    slug: string
    children?: Page[]
}

const pages = ref([
    {
        id: 0,
        name: 'News',
        current: true,
        slug: '/news',
        icon: 'bi:newspaper',
        children: [
            { id: 1, name: 'New', current: false, slug: '/', icon: 'bi:newspaper' },
            { id: 2, name: 'Discover', current: false, slug: '/discover', icon: 'ri:compass-discover-line' },
        ],
    },
    {
        id: 1,
        name: 'Events',
        current: false,
        slug: '/events',
        icon: 'material-symbols:event',
        children: [
            { id: 10, name: 'New', current: false, slug: '/', icon: 'material-symbols:event' },
            { id: 11, name: 'Discover', current: false, slug: '/discover', icon: 'ri:compass-discover-line' },
        ],
    },
    {
        id: 2,
        name: 'Users',
        current: false,
        slug: '/users',
        icon: 'fa-solid:user-astronaut',
        children: [
            { id: 20, name: 'All', current: false, slug: '/', icon: 'fa-solid:user-astronaut' },
            { id: 21, name: 'Discover', current: false, slug: '/discover', icon: 'ri:compass-discover-line' },
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
