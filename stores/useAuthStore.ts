import { SupabaseClient } from '@supabase/supabase-js'
import {
  SessionType,
  UserType,
  authSchema,
  AuthType,
  SimpleUserType,
  EmailUnvalidatedUserType
} from '@/types/auth'

export default defineStore('auth', () => {
  // !TODO: add isAdmin check
  const AUTHENTICATED_AUD = 'authenticated'
  const PROTECTED_ROUTE = 'astrotribe'

  const router = useRouter()
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
    console.log('register')

    const { data, error } = await useFetch('/api/auth/register', {
      method: 'POST',
      headers: useRequestHeaders(['cookie']),
      body: JSON.stringify({ email, password })
    })
    if (error.value) throw createError(`Error registering user: ${error.value}`)
    if (!data.value) throw createError({ message: 'No Register data', statusCode: 401 })
    user.value = data.value.data.user
    router.push('/auth/confirm')
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
    const data = await useFetch('/api/auth/logout')
    console.log('user logged out client', data)
    clearUserData()
    router.push('/auth/login')
  }

  const updateSession = (newSession: SessionType) => {
    console.log('updateSession')
    session.value = newSession
    accessToken.value = newSession.access_token
    refreshToken.value = newSession.refresh_token
    expiresAt.value = Number(newSession.expires_at)
    expiresIn.value = Number(newSession.expires_in)
    console.log(
      'updateSession',
      session.value,
      accessToken.value,
      refreshToken.value,
      expiresAt.value,
      expiresIn.value
    )
  }

  const updateUser = (data: UserType) => {
    console.log('updateUser')
    user.value = data
  }

  const updateData = (data: AuthType) => {
    updateUser(data.user)
    updateSession(data.session)
  }

  const login = async ({ email, password }: { email?: string; password?: string }) => {
    console.log('login', email, password)
    const { data, error } = await useFetch('/api/auth/login', {
      method: 'POST',
      headers: useRequestHeaders(['cookie']),
      body: JSON.stringify({ email, password })
    })

    if (error.value) throw createError({ message: error.value.message, statusCode: 401 })
    if (!data.value) throw createError({ message: 'No Login data', statusCode: 401 })

    console.log(data)
    updateData(data.value.data)
  }

  async function setSession(client: SupabaseClient): Promise<boolean> {
    // Update the session expiration time in your cookies if available from the auth response
    console.log('setSession')
    const { data, error } = await client.auth.setSession({
      refresh_token: refreshToken.value!,
      access_token: accessToken.value!
    })
    if (error) throw createError({ message: error.message, statusCode: 401 })
    const validatedData = authSchema.parse(data)
    if (!validatedData) {
      throw createError({ message: 'Invalid session data', statusCode: 401 })
    }
    console.log('setSession success')
    updateData(validatedData)
    return true
  }

  const isAuthenticated = computed(() => {
    console.log('isAuthenticated', user.value)
    return user.value?.aud === AUTHENTICATED_AUD
  })

  const hasSessionExpired = computed(() => {
    if (!expiresAt.value) return true
    return Number((Date.now() / 1000).toFixed(0)) >= expiresAt.value
  })

  const hasTokens = computed(() =>
    Boolean(refreshToken.value && accessToken.value && expiresAt.value)
  )

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
    hasTokens,
    isProtectedRoute,
    session,
    setSession,
    login,
    logout,
    register,
    // createUsers,
    updateData,
    updateSession,
    updateUser,
    createdUsers
  }
})
