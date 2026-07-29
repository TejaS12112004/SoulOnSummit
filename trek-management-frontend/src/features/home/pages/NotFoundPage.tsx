import { Compass } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="w-24 h-24 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6">
        <Compass className="w-12 h-12" />
      </div>
      <h1 className="font-display font-bold text-4xl mb-4">404 - Lost on the Trail?</h1>
      <p className="text-muted-foreground text-lg max-w-md mb-8">
        We can't seem to find the page you're looking for. It might have been moved or no longer exists.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button variant="outline" onClick={() => navigate(-1)} className="px-8">
          Go Back
        </Button>
        <Button asChild className="px-8">
          <Link to={ROUTES.HOME}>Return Home</Link>
        </Button>
        <Button variant="secondary" asChild className="px-8">
          <Link to={ROUTES.TREKS}>Search Treks</Link>
        </Button>
      </div>
    </div>
  )
}
