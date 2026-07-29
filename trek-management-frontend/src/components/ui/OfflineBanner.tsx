import { useState, useEffect } from 'react'
import { WifiOff } from 'lucide-react'

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (!isOffline) return null

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-5">
      <div className="bg-destructive text-destructive-foreground px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 font-medium text-sm">
        <WifiOff className="w-4 h-4 shrink-0" />
        <span>You are currently offline. Some features may not be available.</span>
      </div>
    </div>
  )
}
