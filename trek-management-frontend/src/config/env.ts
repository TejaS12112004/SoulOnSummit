const getEnvVar = (key: string, fallback?: string): string => {
  const value = import.meta.env[key] as string | undefined
  if (value !== undefined && value !== '') return value
  if (fallback !== undefined) return fallback
  throw new Error(`Missing required environment variable: ${key}`)
}

export const env = {
  apiBaseUrl: getEnvVar('VITE_API_BASE_URL', 'http://localhost:8080/api/v1'),
  appName: getEnvVar('VITE_APP_NAME', 'TrekManagement'),
  razorpayKeyId: import.meta.env.VITE_RAZORPAY_KEY_ID || '', // User will configure this in .env
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const

export type Env = typeof env
