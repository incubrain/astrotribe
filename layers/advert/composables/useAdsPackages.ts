// composables/useAdvertising.ts
import type { AdPackage } from '~/types/ads'

export const useAdvertising = () => {
  const selectedPackageId = useState<string | null>('selected-package-id', () => null)

  const { adPackages } = storeToRefs(useAdsStore())

  const selectedPackage = computed(() => {
    if (!selectedPackageId.value) return null
    return adPackages.value.find((pkg) => pkg.id === selectedPackageId.value)
  })

  // Package-specific metrics (these would come from real data)
  const getPackageMetrics = (position: string) => {
    const metrics = {
      top: {
        avgViews: 15000,
        clickRate: 2.8,
        avgEngagement: '00:45',
        monthlyGrowth: 32,
      },
      feed: {
        avgViews: 12000,
        clickRate: 3.2,
        avgEngagement: '01:15',
        monthlyGrowth: 28,
      },
      newsletter: {
        avgViews: 5000,
        clickRate: 4.5,
        avgEngagement: '02:30',
        monthlyGrowth: 25,
      },
    }
    return metrics[position as keyof typeof metrics] || null
  }

  const selectPackage = (packageId: string | null) => {
    selectedPackageId.value = packageId
  }

  return {
    selectedPackageId,
    selectedPackage,
    getPackageMetrics,
    selectPackage,
  }
}
