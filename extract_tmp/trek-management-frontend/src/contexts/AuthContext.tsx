import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { STORAGE_KEYS } from '@/api/apiClient'
import authService from '@/services/authService'
import type { AuthState, LoginRequest, User } from '@/types/auth'

interface AuthContextValue extends AuthState {
  login: (data: LoginRequest) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

const loadFromStorage = (): Pick<AuthState, 'user' | 'accessToken' | 'refreshToken'> => {
  try {
    const user = localStorage.getItem(STORAGE_KEYS.USER)
    const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
    return {
      user: user ? (JSON.parse(user) as User) : null,
      accessToken,
      refreshToken,
    }
  } catch {
    return { user: null, accessToken: null, refreshToken: null }
  }
}

const persistSession = (user: User, accessToken: string, refreshToken: string) => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken)
  localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken)
}

const clearSession = () => {
  localStorage.removeItem(STORAGE_KEYS.USER)
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const stored = loadFromStorage()

  const [user, setUser] = useState<User | null>(stored.user)
  const [accessToken, setAccessToken] = useState<string | null>(stored.accessToken)
  const [refreshToken, setRefreshToken] = useState<string | null>(stored.refreshToken)
  const [loading, setLoading] = useState(false)

  // Validate stored session on mount (ensure token not stale)
  useEffect(() => {
    if (!stored.accessToken) return
    // No extra validation call needed; invalid token will trigger 401 interceptor
    // which clears storage and redirects to /login automatically
  }, [stored.accessToken])

  const login = useCallback(async (data: LoginRequest) => {
    setLoading(true)
    try {
      const response = await authService.login(data)
      const { accessToken: at, refreshToken: rt, user: u } = response.data
      persistSession(u, at, rt)
      setUser(u)
      setAccessToken(at)
      setRefreshToken(rt)
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    setLoading(true)
    try {
      if (refreshToken) {
        await authService.logout({ refreshToken }).catch(() => {
          // Ignore server errors on logout; we always clear locally
        })
      }
    } finally {
      clearSession()
      setUser(null)
      setAccessToken(null)
      setRefreshToken(null)
      setLoading(false)
    }
  }, [refreshToken])

  const isAuthenticated = !!user && !!accessToken
  const isAdmin = isAuthenticated && (user?.roles.includes('ROLE_ADMIN') ?? false)

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      accessToken,
      refreshToken,
      isAuthenticated,
      isAdmin,
      loading,
      login,
      logout,
    }),
    [user, accessToken, refreshToken, isAuthenticated, isAdmin, loading, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
