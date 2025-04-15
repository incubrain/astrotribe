import { computed } from 'vue'

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
  const selectedVariant = ref<ABTestVariant<T>>(defaultVariant)

  if (import.meta.server) {
    return {
      variant: selectedVariant,
      value: computed(() => defaultVariant.value),
      trackGoal: () => {},
    }
  }

  const { $posthog } = useNuxtApp()
  if (!$posthog) {
    console.warn('PostHog not available – skipping AB test')
    return {
      variant: selectedVariant,
      value: computed(() => defaultVariant.value),
      trackGoal: () => {},
    }
  }

  const variantName = $posthog.getFeatureFlag(experimentName)
  selectedVariant.value = variants.find((v) => v.name === variantName) || defaultVariant

  $posthog.capture('$experiment_started', {
    experiment: experimentName,
    variant: selectedVariant.value.name,
    goals,
  })

  const value = computed(() => selectedVariant.value.value)

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
