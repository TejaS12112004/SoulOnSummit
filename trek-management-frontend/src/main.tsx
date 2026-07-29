import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'sonner'
import { QueryProvider } from '@/providers/QueryProvider'
import { AuthProvider } from '@/contexts/AuthContext'
import { AppRouter } from '@/routes/AppRouter'
import { OfflineBanner } from '@/components/ui'
import '@/styles/globals.css'

const root = document.getElementById('root')
if (!root) throw new Error('Root element not found')

createRoot(root).render(
  <StrictMode>
    <QueryProvider>
      <AuthProvider>
        <AppRouter />
        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            style: {
              fontFamily: 'var(--font-sans)',
              borderRadius: 'var(--radius-btn)',
            },
          }}
        />
        <OfflineBanner />
      </AuthProvider>
    </QueryProvider>
  </StrictMode>,
)
