import { useState, useCallback, useRef } from 'react'
import { ServerCrash, WifiOff, Timer, FileWarning, AlertTriangle } from 'lucide-react'
import { Button } from './button'
import { cn } from '@/lib/utils'

export interface QueryErrorStateProps {
  error: unknown
  onRetry?: () => void
  className?: string
}

type ErrorCategory = 'offline' | 'timeout' | 'server' | 'not_found' | 'unexpected'

function categorizeError(error: unknown): ErrorCategory {
  if (!navigator.onLine) return 'offline'
  
  if (error && typeof error === 'object') {
    // Check for ApiError shape where status is a direct property
    const status = (error as any).status || (error as any).response?.status
    if (status === 404) return 'not_found'
    if (status >= 500) return 'server'
  }
  
  if (error instanceof Error) {
    if (error.message.toLowerCase().includes('timeout') || error.name === 'TimeoutError') {
      return 'timeout'
    }
    if (error.message.toLowerCase().includes('network') || error.message.toLowerCase().includes('failed to fetch')) {
      return 'offline'
    }
  }
  
  return 'unexpected'
}

export function QueryErrorState({ error, onRetry, className }: QueryErrorStateProps) {
  const [isRetrying, setIsRetrying] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const category = categorizeError(error)
  const isDev = import.meta.env.DEV

  const getErrorContent = () => {
    switch (category) {
      case 'offline':
        return {
          icon: <WifiOff className="w-8 h-8" />,
          title: 'No Internet Connection',
          message: 'It looks like you are offline. Please check your network connection and try again.'
        }
      case 'timeout':
        return {
          icon: <Timer className="w-8 h-8" />,
          title: 'Connection Timed Out',
          message: 'The server took too long to respond. Please try again.'
        }
      case 'server':
        return {
          icon: <ServerCrash className="w-8 h-8" />,
          title: 'Server Error',
          message: 'We are experiencing some technical difficulties on our end. Our team has been notified.'
        }
      case 'not_found':
        return {
          icon: <FileWarning className="w-8 h-8" />,
          title: 'Content Not Found',
          message: 'The requested information could not be found.'
        }
      case 'unexpected':
      default:
        return {
          icon: <AlertTriangle className="w-8 h-8" />,
          title: 'Something went wrong',
          message: 'We encountered an unexpected error while loading this data.'
        }
    }
  }

  const { icon, title, message } = getErrorContent()

  const handleRetry = useCallback(async () => {
    if (!onRetry || isRetrying) return
    setIsRetrying(true)
    
    try {
      await Promise.resolve(onRetry())
    } finally {
      // The component unmounts on success, but if it fails again, we stop spinning
      setIsRetrying(false)
      // Attempt to restore focus to retry button to maintain accessibility, 
      // or to the container if we want to ensure visibility
      requestAnimationFrame(() => {
        containerRef.current?.focus()
      })
    }
  }, [onRetry, isRetrying])

  return (
    <div 
      ref={containerRef}
      tabIndex={-1}
      className={cn(
        "flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl border border-destructive/20 bg-destructive/5 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
    >
      <div className="w-16 h-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-4">
        {icon}
      </div>
      
      <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
      
      <p className="text-muted-foreground max-w-md mb-6">
        {message}
      </p>

      {isDev && error ? (
        <div className="mb-6 p-4 rounded bg-muted/50 text-left text-xs font-mono text-muted-foreground w-full max-w-lg overflow-x-auto">
          <p className="font-semibold text-foreground mb-1">Dev Details:</p>
          {error instanceof Error ? error.stack || error.message : JSON.stringify(error, null, 2)}
        </div>
      ) : null}
      
      {onRetry && (
        <Button 
          onClick={handleRetry} 
          disabled={isRetrying}
          variant="outline"
          className="min-w-[120px]"
        >
          {isRetrying ? 'Retrying...' : 'Retry'}
        </Button>
      )}
    </div>
  )
}
