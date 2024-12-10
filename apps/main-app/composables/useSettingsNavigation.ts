import { computed } from 'vue'

export interface SettingsRoute {
  key: string
  label: string
  url: string
  icon?: string
  visible: boolean
  disabled: boolean
  children?: SettingsRoute[]
}

export interface TitleType {
  main: string
  subtitle?: string
}

export interface SettingsItem {
  id: string
  label: string
  tip?: string
  placeholder?: string
  type: string
  disabled?: boolean
  value?: any
}

export function useSettingsNavigation() {
  const user = useCurrentUser()

  const settingsRoutes = computed<SettingsRoute[]>(() => [
    {
      key: 'settings-account',
      label: 'Account Profile',
      url: '/settings/account',
      icon: 'material-symbols:home',
      visible: true,
      disabled: false,
    },
    {
      key: 'settings-security',
      label: 'Security',
      url: '/settings/security',
      icon: 'material-symbols:key',
      visible: true,
      disabled: false,
      children: [
        {
          key: 'settings-password',
          label: 'Password',
          url: '/settings/security/password',
          visible: user.profile?.providers?.includes('email'),
          disabled: false,
        },
      ],
    },
    {
      key: 'settings-payments',
      label: 'Payments',
      url: '/settings/payments',
      icon: 'mdi:credit-card',
      visible: true,
      disabled: false,
    },
    {
      key: 'settings-notifications',
      label: 'Notifications',
      url: '/settings/notifications',
      icon: 'material-symbols:notifications',
      visible: true,
      disabled: false,
    },
  ])

  return {
    settingsRoutes,
  }
}
