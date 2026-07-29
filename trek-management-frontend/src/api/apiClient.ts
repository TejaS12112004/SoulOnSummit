import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'
import { env } from '@/config/env'
import type { ApiError } from '@/types/api'

// Storage keys — single source of truth
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'trek_access_token',
  REFRESH_TOKEN: 'trek_refresh_token',
  USER: 'trek_user',
} as const

const apiClient: AxiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// ── Request interceptor: attach JWT ─────────────────────────────────────────
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: unknown) => Promise.reject(error),
)

// ── Response interceptor: normalize errors ──────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const status = error.response?.status

    // 401 — token expired or invalid: clear session, redirect to login
    if (status === 401) {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.USER)
      // Avoid circular import by using window.location directly
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }

    // Network errors, timeouts, etc (no response)
    if (!error.response) {
      const isTimeout = error.code === 'ECONNABORTED' || error.message.toLowerCase().includes('timeout')
      const isOffline = !navigator.onLine
      
      const message = isOffline 
        ? 'No internet connection.' 
        : isTimeout 
          ? 'The request timed out. Please try again.' 
          : 'Something went wrong.'

      const apiError: ApiError = {
        success: false,
        message,
        errors: undefined,
        status: 0,
      }
      return Promise.reject(apiError)
    }

    // 5xx Server Errors
    if (status && status >= 500) {
      const apiError: ApiError = {
        success: false,
        message: 'Our servers are temporarily unavailable. Please try again shortly.',
        errors: undefined,
        status,
      }
      return Promise.reject(apiError)
    }

    // Normalize error so callers always get a consistent shape for 400, 401, 403, 404
    const apiError: ApiError = {
      success: false,
      message:
        error.response?.data?.message ??
        error.message ??
        'Something went wrong.',
      errors: error.response?.data?.errors,
      status: error.response?.status,
    }

    return Promise.reject(apiError)
  },
)

export default apiClient
