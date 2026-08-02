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
import type { AuthState, LoginRequest, RegisterRequest, User } from '@/types/auth'

interface AuthContextValue extends AuthState {
  login: (data: LoginRequest) => Promise<User>
  register: (data: RegisterRequest) => Promise<User>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  establishSession: (user: User, accessToken: string, refreshToken: string) => void
}

// eslint-disable-next-line react-refresh/only-export-components
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

  // Listen for refresh events from apiClient to sync React state
  useEffect(() => {
    const handleStorageChange = () => {
      const stored = loadFromStorage();
      if (stored.accessToken !== accessToken) {
        setAccessToken(stored.accessToken);
        setRefreshToken(stored.refreshToken);
        setUser(stored.user);
      }
    };

    window.addEventListener('session_refreshed', handleStorageChange);
    return () => window.removeEventListener('session_refreshed', handleStorageChange);
  }, [accessToken]);

  const establishSession = useCallback((u: User, at: string, rt: string) => {
    persistSession(u, at, rt)
    setUser(u)
    setAccessToken(at)
    setRefreshToken(rt)
  }, [])

  const login = useCallback(async (data: LoginRequest): Promise<User> => {
    setLoading(true)
    try {
      const response = await authService.login(data)
      const { accessToken: at, refreshToken: rt, user: u } = response.data
      establishSession(u, at, rt)
      return u
    } finally {
      setLoading(false)
    }
  }, [establishSession])

  const register = useCallback(async (data: RegisterRequest): Promise<User> => {
    setLoading(true)
    try {
      await authService.register(data)
      // Automatically login after successful registration
      return await login({ email: data.email, password: data.password })
    } finally {
      setLoading(false)
    }
  }, [login])

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

  const refreshUser = useCallback(async () => {
    try {
      const userService = (await import('@/services/userService')).default;
      const updatedUser = await userService.getProfile();
      // Need to cast to User because UserResponse lacks 'roles' which is on User from AuthState. 
      // Assuming 'roles' is available or merging it.
      const newUser = { ...user, ...updatedUser } as User;
      setUser(newUser);
      if (accessToken && refreshToken) {
        persistSession(newUser, accessToken, refreshToken);
      }
    } catch (err) {
      console.error('Failed to refresh user profile', err);
    }
  }, [user, accessToken, refreshToken]);

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
      register,
      logout,
      refreshUser,
      establishSession,
    }),
    [user, accessToken, refreshToken, isAuthenticated, isAdmin, loading, login, register, logout, refreshUser, establishSession],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
