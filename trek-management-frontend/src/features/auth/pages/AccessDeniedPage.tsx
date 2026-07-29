import { ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'

export default function AccessDeniedPage() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="w-24 h-24 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-6">
        <ShieldAlert className="w-12 h-12" />
      </div>
      <h1 className="font-display font-bold text-4xl mb-4">Access Denied</h1>
      <p className="text-muted-foreground text-lg max-w-md mb-8">
        You don't have the required permissions to access this page. If you believe this is a mistake, please contact support.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild variant="outline" className="px-8">
          <Link to={ROUTES.HOME}>Return Home</Link>
        </Button>
        {!isAuthenticated && (
          <Button asChild className="px-8">
            <Link to={ROUTES.LOGIN}>Log In</Link>
          </Button>
        )}
      </div>
    </div>
  )
}
