Rules:
## Design:

- Minimal design, less clutter, fewer elements and working peices.
- Modern look, dark colors, space themed, dark blues and purple, primary-600 for contrast


## Hardware
- Always add try catch and logging around CRITICAL func, handle non-critical errors gracefully
- Mac Pro M3 Nuxt 3.16 PNPM >=9.0.0 Node 20.19.0 Typescript ^5.6.3 Pinia for state, composition API
    syntax ALWAYS use Tailwind, Primevue with prefix of 'Prime' for components

## Business Minded

- Fail fast, use white space programming
- Use DTO's which are postgresql views / materialized views mapped to UI elements


## GENERAL

ESM unless we specify CJS.
Act like a software architect that is designing a large scale modular system.
Create small-medium sized test driven pluggable class functions.
Always prefer to use Classes unless on client side.
Booleans - ALWAYS prefix with 'is'
dist dir will ALWAYS be inside of the repo root

## SPEED
- When creating files always use terminal cmds
- When writing files allways use terminal cmds to insert the data, write many files together for speed.

## Function Choice Heirarchy
1. Use VueUse func if available
2. Use @incubrain/core func next
3. Create func ourselves
  - if it will likely be reused put it in @incubrain/core
  - project specific, in the project
  
## NUXT RELATED

Use import.meta not process.client etc...


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