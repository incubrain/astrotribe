// composables/usePopupSettings.ts
import type { Ref } from 'vue'
import { readonly, ref } from 'vue'

export interface PopupSettings {
  frequency: 'once' | 'daily' | 'always'
  delay: number
  position: 'center' | 'bottom-right' | 'top'
  animation: 'fade' | 'slide' | 'scale'
  trigger: 'immediate' | 'scroll' | 'exit-intent'
}

export const DEFAULT_SETTINGS: PopupSettings = {
  frequency: 'once',
  delay: 5000,
  position: 'center',
  animation: 'fade',
  trigger: 'immediate',
}

export const usePopupSettings = () => {
  const popupSettings = ref<PopupSettings>(DEFAULT_SETTINGS)

  const updateSettings = (settings: Partial<PopupSettings>) => {
    popupSettings.value = {
      ...popupSettings.value,
      ...settings,
    }
  }

  return {
    settings: readonly(popupSettings.value),
    updateSettings,
  }
}
