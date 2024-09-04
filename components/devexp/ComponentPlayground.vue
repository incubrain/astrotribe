<template>
  <div class="component-playground">
    <DevexpComponentList
      :componentNames="availableComponentNames"
      @select="selectComponent"
    />
    <div class="main-area">
      <DevexpPreviewArea
        v-if="false"
        :component="selectedComponentName.component"
        :props="props"
        :state="state"
        @event="logEvent"
      />
      <DevexpPropsEditor
        :props="props"
        @update:props="updateProps"
      />
      <DevexpStateManager
        v-if="hasState"
        :state="state"
        @update:state="updateState"
      />
      <DevexpEventLogger :events="events" />
      <DevexpResponsiveTester @change="setViewportSize" />
      <DevexpCodePreview
        :component="selectedComponent"
        :props="props"
        :state="state"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const availableComponentNames = ref<string[]>([])
const selectedComponentName = ref<string | null>(null)
const props = ref({})
const state = ref({})
const events = ref([])
const hasState = computed(() => Object.keys(state.value).length > 0)

onMounted(async () => {
  // Dynamically get all component names
  const componentContext = import.meta.glob('~/components/**/*.vue')
  availableComponentNames.value = Object.keys(componentContext).map((key) => {
    return key.split('/').pop()?.replace('.vue', '') || ''
  })
  if (availableComponentNames.value.length > 0) {
    selectComponent(availableComponentNames.value[0])
  }
})

const selectComponent = (component) => {
  selectedComponentName.value = component
  props.value = getDefaultProps(component)
  state.value = getInitialState(component)
  events.value = []
}

const updateProps = (newProps) => {
  props.value = newProps
}

const updateState = (newState) => {
  state.value = newState
}

const logEvent = (event) => {
  events.value.push({
    name: event.name,
    payload: event.payload,
    timestamp: new Date()
  })
}

const previewAreaSize = ref({ width: '100%', height: '300px' })

const setViewportSize = (size: 'mobile' | 'tablet' | 'desktop') => {
  switch (size) {
    case 'mobile':
      previewAreaSize.value = { width: '375px', height: '667px' }
      break
    case 'tablet':
      previewAreaSize.value = { width: '768px', height: '1024px' }
      break
    case 'desktop':
    default:
      previewAreaSize.value = { width: '100%', height: '600px' }
      break
  }
}

const getDefaultProps = (component: any) => {
  const defaultProps: Record<string, any> = {}
  if (component.props) {
    Object.entries(component.props).forEach(([key, value]: [string, any]) => {
      if (value.default !== undefined) {
        defaultProps[key] = typeof value.default === 'function' ? value.default() : value.default
      } else if (value.type) {
        // Provide sensible defaults based on prop type
        switch (value.type) {
          case String:
            defaultProps[key] = ''
            break
          case Number:
            defaultProps[key] = 0
            break
          case Boolean:
            defaultProps[key] = false
            break
          case Array:
            defaultProps[key] = []
            break
          case Object:
            defaultProps[key] = {}
            break
          // Add more types as needed
        }
      }
    })
  }
  return defaultProps
}

const getInitialState = (component: any) => {
  const initialState: Record<string, any> = {}
  if (component.setup) {
    // This is a basic approach and might not work for all components
    // A more robust solution would involve analyzing the setup function
    const setupResult = component.setup()
    Object.entries(setupResult).forEach(([key, value]: [string, any]) => {
      if (value.value !== undefined) {
        // Assume it's a ref
        initialState[key] = value.value
      } else if (typeof value === 'function') {
        // Assume it's a computed property or method, skip it
      } else {
        // Assume it's a plain value
        initialState[key] = value
      }
    })
  }
  return initialState
}
</script>

<style scoped>
.component-playground {
  display: flex;
  height: 100vh;
}

.main-area {
  flex-grow: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto 1fr 1fr;
  gap: 1rem;
  padding: 1rem;
}
</style>
