import { SupabaseClient } from '@supabase/supabase-js'
import {
  SessionType,
  UserType,
  authSchema,
  AuthType,
  SimpleUserType,
  EmailUnvalidatedUserType,
  emailUnvalidatedUserSchema,
  sessionSchema,
  userSchema
} from '@/types/auth'

export default defineStore('auth', () => {
  // !TODO: add isAdmin check
  const AUTHENTICATED_AUD = 'authenticated'
  const PROTECTED_ROUTE = 'astrotribe'

  const router = useRouter()
  const client: SupabaseClient = useNuxtApp().$supabase.client

  const user = ref<UserType | EmailUnvalidatedUserType | null>(null)
  const session = ref<SessionType | null>(null)
  const createdUsers = ref([] as SimpleUserType[])

  // !TODO: add types for cookies
  const accessToken = useCookie('access_token')
  const refreshToken = useCookie('refresh_token')
  const expiresIn = useCookie('expires_in', {
    decode: (value) => Number(value)
  }) as Ref<number | null>
  const expiresAt = useCookie('expires_at', {
    decode: (value) => Number(value)
  }) as Ref<number | null>

  // const createUsers = async () => {
  //   console.log('register')

  //   const { data } = await useFetch('/api/admin/register-many-users', {
  //     method: 'POST',
  //     headers: useRequestHeaders(['cookie']),
  //     body: JSON.stringify({})
  //   })
  //   console.log(data)
  //   if (!data.value) throw createError({ message: 'No Register data', statusCode: 401 })
  //   createdUsers.value = data.value.users
  // }

  const register = async ({ email, password }: { email: string; password: string }) => {
    const { data, error } = await client.auth.signUp({
      email,
      password
    })
    if (error) throw createError(`Error registering user: ${error}`)

    const validatedUser = emailUnvalidatedUserSchema.safeParse(data.user)
    if (!validatedUser.success) {
      throw createError(validatedUser.error)
    }

    user.value = validatedUser.data
    router.push('/auth/success')
  }

  const clearUserData = () => {
    user.value = null
    session.value = null
    accessToken.value = null
    refreshToken.value = null
    expiresAt.value = null
    expiresIn.value = null
  }

  const logout = async () => {
    const { error } = await client.auth.signOut()
    if (error) {
      throw createError({
        statusCode: 401,
        message: error.message
      })
    }
    clearUserData()
    router.push('/auth/login')
  }

  const updateSession = (newSession: SessionType) => {
    session.value = newSession
    accessToken.value = newSession.access_token
    refreshToken.value = newSession.refresh_token
    expiresAt.value = Number(newSession.expires_at)
    expiresIn.value = Number(newSession.expires_in)
  }

  const updateUser = (data: UserType) => {
    user.value = data
  }

  const updateData = (data: AuthType) => {
    updateUser(data.user)
    updateSession(data.session)
  }

  const login = async ({ email, password }: { email: string; password: string }) => {
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password
    })
    if (error) {
      throw createError(`Login Error: ${error}`)
    }

    const validatedUser = userSchema.safeParse(data.user)
    if (!validatedUser.success) {
      // Handle validation error
      throw createError(validatedUser.error)
    }

    if (!data) throw createError('Login Error: No data returned from supabase')
    const validatedSession = sessionSchema.safeParse(data.session)
    if (!validatedSession.success) {
      throw createError(validatedSession.error)
    }

    updateData({ user: validatedUser.data, session: validatedSession.data })
    router.push('/astrotribe/users')
  }

  // const requestPasswordReset = async (email: string): Promise<boolean> => {
  //   return true
  // }

  // const resetPassword = async (confirmPassword: string, password: string): Promise<boolean> => {
  //   return true
  // }

  async function setSession(): Promise<boolean> {
    // Update the session expiration time in your cookies if available from the auth response
    const { data, error } = await client.auth.setSession({
      refresh_token: refreshToken.value!,
      access_token: accessToken.value!
    })
    if (error) throw createError({ message: error.message, statusCode: 401 })
    const validatedData = authSchema.parse(data)
    if (!validatedData) {
      throw createError({ message: 'Invalid session data', statusCode: 401 })
    }
    updateData(validatedData)
    return true
  }

  const isAuthenticated = computed(() => {
    return user.value?.aud === AUTHENTICATED_AUD
  })

  const hasSessionExpired = computed(() => {
    if (!expiresAt.value) return true
    return Number((Date.now() / 1000).toFixed(0)) >= expiresAt.value
  })

  const hasTokens = computed(() => {
    return Boolean(refreshToken.value && accessToken.value && expiresAt.value)
  })

  const hasSession = computed(() => {
    return Boolean(session.value)
  })

  const isFirstLogin = computed(() =>
    Boolean(refreshToken.value && accessToken.value && !expiresAt.value && expiresIn.value)
  )

  const isProtectedRoute = (path: string) => {
    return path.includes(PROTECTED_ROUTE)
  }

  return {
    user,
    isAuthenticated,
    isFirstLogin,
    accessToken,
    refreshToken,
    hasSessionExpired,
    hasSession,
    hasTokens,
    isProtectedRoute,
    session,
    setSession,
    login,
    logout,
    register,
    // resetPassword,
    // requestPasswordReset,
    // createUsers,
    updateData,
    updateSession,
    updateUser,
    createdUsers
  }
})
