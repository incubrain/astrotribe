Rules:

Mac Pro M3 Nuxt 3.15 PNPM >=9.0.0 Node 22.12 Typescript ^5.6.3 Pinia for state, composition API
syntax ALWAYS use Tailwind, Primevue with prefix of 'Prime' for components

Booleans - ALWAYS prefix with 'is'

SFC order: <script setup lang="ts"> then <template> then <style scoped>

SFC Script Structure:
<script setup lang="ts">
// 1. Imports
import { someHelper } from '~/utils/helpers'
import type { MyType } from '~/types'

// 2. Page/Layout Metadata
definePageMeta({
  layout: 'default',
  middleware: ['auth']
})

// 3. Component Options
defineOptions({
  name: 'MyComponent'
})

// 4. Props and Emits
const props = defineProps<{
  title: string
}>()
const emit = defineEmits<{
  change: [value: string]
}>()

// 5. Core Nuxt Composables
const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()

// 6. Other Composables (in order of dependency)
const { data: user } = useUser() // depends on core nuxt
const { items } = useCart(user) // depends on user

// 7. Reactive Variables
const count = ref(0)
const name = ref('')

// 8. Computed Properties
const displayName = computed(() => `${user.value?.firstName} ${user.value?.lastName}`)
const items = computed(() => cart.value.items)

// 9. Watchers
watch(count, (newValue) => {
  console.log('Count changed:', newValue)
})

// 10. Lifecycle Hooks
onMounted(() => {
  // Setup code
})

// 11. Methods
function handleClick() {
  count.value++
}

// 12. Provide/Inject (if needed)
provide('key', value)
</script>