import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { type ReactNode, useState } from 'react'
import { env } from '@/config/env'
import type { ApiError } from '@/types/api'

const makeQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 2,      // 2 min — most trek/booking data is not real-time
        gcTime: 1000 * 60 * 10,        // 10 min cache
        retry: (failureCount, error) => {
          const apiError = error as unknown as ApiError
          // Never retry on 4xx client errors
          if (apiError.status && apiError.status >= 400 && apiError.status < 500) return false
          return failureCount < 2
        },
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  })

interface QueryProviderProps {
  children: ReactNode
}

export function QueryProvider({ children }: QueryProviderProps) {
  // Stable client per component tree (avoids re-creating on re-renders)
  const [queryClient] = useState(makeQueryClient)

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {env.isDev && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  )
}
