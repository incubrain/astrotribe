import { z } from 'zod'

const ProfileValidation = z.object({
  given_name: z.string().min(1, 'Given Name is required'),
  surname: z.string().min(1, 'Surname is required'),
  username: z.string(),
  email: z.string().email(),
  avatar: z.string().optional(),
  introduction: z.string().min(240, 'At least 240 characters required').optional(),
  quote: z.string().min(10, 'At least 10 characters required').optional(),
})

type ProfileData = z.infer<typeof ProfileValidation>

export function useSettingsProfile() {
  const currentUser = useCurrentUser()
  const supabase = useSupabaseClient()
  const toast = useNotification()

  const profile = ref<ProfileData>({
    given_name: '',
    surname: '',
    username: '',
    email: '',
    avatar: '',
  })

  const isUpdating = ref(false)

  // Initialize profile data
  watch(
    () => currentUser.profile,
    (newProfile) => {
      if (newProfile) {
        profile.value = {
          given_name: newProfile.given_name || '',
          surname: newProfile.surname || '',
          username: newProfile.username || '',
          email: newProfile.email || '',
          avatar: newProfile.avatar || '',
          introduction: newProfile.introduction,
          quote: newProfile.quote,
        }
      }
    },
    { immediate: true },
  )

  // Update profile
  async function updateProfile(data: Partial<ProfileData>) {
    try {
      isUpdating.value = true

      // Validate data
      const validatedData = ProfileValidation.partial().parse(data)

      // Update profile in Supabase
      const { error } = await supabase
        .from('user_profiles')
        .update(validatedData)
        .eq('id', currentUser.profile?.id)

      if (error) throw error

      // Update local state
      Object.assign(profile.value, validatedData)

      // Update user store
      currentUser.updateProfile(validatedData)

      toast.success({
        summary: 'Profile Updated',
        message: 'Your profile has been successfully updated',
      })
    } catch (error: any) {
      console.error('Profile update failed:', error)
      toast.error({
        summary: 'Update Failed',
        message: error.message || 'Failed to update profile',
      })
    } finally {
      isUpdating.value = false
    }
  }

  // Update avatar specifically
  async function updateAvatar(avatarUrl: string) {
    return updateProfile({ avatar: avatarUrl })
  }

  return {
    profile,
    isUpdating,
    updateProfile,
    updateAvatar,
  }
}
