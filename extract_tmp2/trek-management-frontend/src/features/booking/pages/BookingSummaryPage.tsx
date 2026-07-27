import { useParams, Link } from 'react-router-dom'
import { Loader2, AlertCircle } from 'lucide-react'
import { useBooking } from '../hooks/useBooking'
import { ROUTES } from '@/constants/routes'
import { BookingReviewHeader } from '../components/BookingReviewHeader'
import { BookingTravellerList } from '../components/BookingTravellerList'
import { BookingPriceBreakdown } from '../components/BookingPriceBreakdown'
import { BookingPolicies } from '../components/BookingPolicies'
import { BookingReviewSidebar } from '../components/BookingReviewSidebar'
import { BookingActions } from '../components/BookingActions'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function BookingSummaryPage() {
  const { id } = useParams<{ id: string }>()
  const { data: booking, isLoading, isError } = useBooking(id)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-accent animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">Loading your booking…</p>
        </div>
      </div>
    )
  }

  if (isError || !booking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <AlertCircle className="w-10 h-10 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-display font-bold text-foreground mb-2">Booking not found</h2>
          <p className="text-muted-foreground text-sm mb-5">
            We couldn't retrieve your booking details.
          </p>
          <Link
            to={ROUTES.BOOKINGS}
            className={cn(buttonVariants({ variant: 'default' }), "inline-block")}
          >
            View My Bookings
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8 px-6 lg:py-12">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 items-start">
        {/* Main Content */}
        <div className="flex-1 w-full min-w-0">
          <BookingReviewHeader booking={booking} />
          
          <BookingTravellerList booking={booking} />
          
          <div className="lg:hidden">
            <BookingPriceBreakdown booking={booking} />
          </div>

          <BookingPolicies booking={booking} />

          {/* Desktop/Tablet Actions */}
          <div className="hidden sm:block">
            <BookingActions />
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-[400px] shrink-0">
          <BookingReviewSidebar booking={booking} />
          
          {/* Mobile Actions */}
          <div className="mt-6 sm:hidden">
            <BookingActions />
          </div>
        </div>
      </div>
    </div>
  )
}
