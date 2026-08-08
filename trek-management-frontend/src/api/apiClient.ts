import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'
import { env } from '@/config/env'
import type { ApiError } from '@/types/api'

// Storage keys — single source of truth
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'trek_access_token',
  REFRESH_TOKEN: 'trek_refresh_token',
  USER: 'trek_user',
} as const

let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void, reject: (err: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token as string);
    }
  });
  failedQueue = [];
};

const apiClient: AxiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 60_000,
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

    // 401 — token expired or invalid: attempt refresh
    if (status === 401) {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
      
      // If we're already trying to refresh, queue the request
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = 'Bearer ' + token;
          return apiClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      // If we haven't retried yet and there's a refresh token available
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        isRefreshing = true;

        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        if (refreshToken) {
          try {
            // Call refresh endpoint natively to avoid interceptor loops
            const response = await axios.post(`${env.apiBaseUrl}/auth/refresh`, { refreshToken }, {
              headers: { 'Content-Type': 'application/json' }
            });
            
            const newAccessToken = response.data.data.accessToken;
            const newRefreshToken = response.data.data.refreshToken;
            const newUser = response.data.data.user;

            localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, newAccessToken);
            localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));

            window.dispatchEvent(new Event('session_refreshed'));

            processQueue(null, newAccessToken);
            
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return apiClient(originalRequest);
            
          } catch (refreshError) {
            processQueue(refreshError, null);
            // Refresh failed, clear session and log out
            localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER);
            if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/oauth2/callback')) {
              window.location.href = '/login';
            }
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        }
      }

      // If no refresh token or retry already happened, clear session
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.USER)
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/oauth2/callback')) {
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
      const serverMessage = error.response?.data?.message || 'Our servers are temporarily unavailable. Please try again shortly.';
      const apiError: ApiError = {
        success: false,
        message: serverMessage,
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
