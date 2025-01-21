// composables/usePopupStorage.ts
import { useLocalStorage } from '@vueuse/core'
import { readonly } from 'vue'

interface PopupHistory {
  lastSeen: number
  interactions: number
  dismissed: boolean
}

export const usePopupStorage = () => {
  const popupHistory = useLocalStorage<Record<string, PopupHistory>>('astronera_popup_history', {})

  const canShowPopup = (variantId: string, frequency: PopupSettings['frequency']): boolean => {
    const history = popupHistory.value[variantId]
    if (!history) return true

    const now = Date.now()
    switch (frequency) {
      case 'once':
        return !history.dismissed
      case 'daily': {
        const oneDayMs = 24 * 60 * 60 * 1000
        return now - history.lastSeen > oneDayMs
      }
      case 'always':
        return true
      default:
        return false
    }
  }

  const recordInteraction = (variantId: string, type: 'view' | 'click' | 'dismiss') => {
    const history = popupHistory.value[variantId] || {
      lastSeen: Date.now(),
      interactions: 0,
      dismissed: false,
    }

    popupHistory.value[variantId] = {
      ...history,
      lastSeen: Date.now(),
      interactions: history.interactions + 1,
      dismissed: type === 'dismiss' ? true : history.dismissed,
    }
  }

  return {
    popupHistory: readonly(popupHistory),
    canShowPopup,
    recordInteraction,
  }
}
