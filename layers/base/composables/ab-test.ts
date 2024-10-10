import type { DefineComponent } from 'vue'

export enum TestGoal {
  SignUp = 'sign_up',
  Purchase = 'purchase',
  FeatureUsage = 'feature_usage',
  TimeOnPage = 'time_on_page',
  ClickThroughRate = 'click_through_rate',
}

interface ABTestVariant<T> {
  name: string
  value: T
}

interface ABTestConfig<T> {
  experimentName: string
  variants: ABTestVariant<T>[]
  defaultVariant: ABTestVariant<T>
  goals: TestGoal[]
}

export function useABTest<T>({ experimentName, variants, defaultVariant, goals }: ABTestConfig<T>) {
  const { $posthog } = useNuxtApp()

  const selectedVariant = ref<ABTestVariant<T>>(defaultVariant)

  // Use PostHog's experiment feature to get the variant
  const variantName = $posthog.getFeatureFlag(experimentName)
  selectedVariant.value = variants.find((v) => v.name === variantName) || defaultVariant

  // Capture experiment exposure
  $posthog.capture('$experiment_started', {
    experiment: experimentName,
    variant: selectedVariant.value.name,
    goals: goals,
  })

  const value = computed(() => selectedVariant.value.value)

  // Function to track goal completion
  const trackGoal = (goal: TestGoal, properties: Record<string, any> = {}) => {
    $posthog.capture(goal, {
      ...properties,
      $experiment_name: experimentName,
      $variant: selectedVariant.value.name,
    })
  }

  return {
    variant: selectedVariant,
    value,
    trackGoal,
  }
}

// Helper function for component-based A/B tests
type ComponentVariant = ABTestVariant<DefineComponent<any, any, any>>

export function useComponentABTest(config: ABTestConfig<DefineComponent<any, any, any>>) {
  const { variant, trackGoal } = useABTest(config)

  const TestComponent = computed(() => ({
    render() {
      return h(variant.value.value.component)
    },
  }))

  return {
    TestComponent,
    trackGoal,
  }
}
