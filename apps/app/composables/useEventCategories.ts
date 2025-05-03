// composables/useEventCategories.ts
import { ref, computed } from 'vue'

export function useEventCategories() {
  // Define categories within the composable - single source of truth
  const categories = ref([
    {
      name: 'Lunar Event',
      icon: 'mdi:moon-waning-crescent',
      color: 'gray',
      colorIntensity: '500',
    },
    {
      name: 'Meteor Shower',
      icon: 'mdi:meteor',
      color: 'red',
      colorIntensity: '400',
    },
    {
      name: 'Solar Event',
      icon: 'mdi:white-balance-sunny',
      color: 'yellow',
      colorIntensity: '500',
    },
    {
      name: 'Planetary Event',
      icon: 'mdi:planet',
      color: 'purple',
      colorIntensity: '500',
    },
    {
      name: 'Eclipse',
      icon: 'mdi:moon-new',
      color: 'indigo',
      colorIntensity: '500',
    },
    {
      name: 'Event by Astronera',
      icon: 'mdi:event-heart',
      color: 'blue',
      colorIntensity: '400',
    },
  ])

  /**
   * Get the icon for a specified category name
   */
  const getCategoryIcon = (categoryName) => {
    const category = categories.value.find((c) => c.name === categoryName)
    return category ? category.icon : 'mdi:star'
  }

  /**
   * Get the color for a specified category name
   */
  const getCategoryColor = (categoryName) => {
    const category = categories.value.find((c) => c.name === categoryName)
    return category ? category.color : 'gray'
  }

  /**
   * Get the color intensity for a specified category name
   */
  const getCategoryIntensity = (categoryName) => {
    const category = categories.value.find((c) => c.name === categoryName)
    return category ? category.colorIntensity : '500'
  }

  /**
   * Get the CSS class for a specified category name
   */
  const getCategoryClass = (categoryName) => {
    const color = getCategoryColor(categoryName)
    const intensity = getCategoryIntensity(categoryName)
    return `bg-${color}-${intensity}`
  }

  /**
   * Get the text color CSS class for a specified category name
   */
  const getCategoryTextColor = (categoryName) => {
    const color = getCategoryColor(categoryName)
    return `text-${color}-400`
  }

  /**
   * Get all available categories
   */
  const getAllCategories = () => categories.value

  return {
    categories: categories.value,
    getCategoryIcon,
    getCategoryColor,
    getCategoryIntensity,
    getCategoryClass,
    getCategoryTextColor,
    getAllCategories,
  }
}
