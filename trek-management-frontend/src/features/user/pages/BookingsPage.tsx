import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, MapPin, Loader2 } from 'lucide-react'
import { useUserBookings } from '@/features/booking/hooks/useUserBookings'
import { formatCurrency } from '@/utils/formatters/currency'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { EmptyState, QueryErrorState } from '@/components/ui'
import { ROUTES } from '@/constants/routes'

type Tab = 'UPCOMING' | 'PAST'

export default function BookingsPage() {
  const { data: bookings = [], isLoading, error, refetch } = useUserBookings()
  const [activeTab, setActiveTab] = useState<Tab>('UPCOMING')

  // Filter logic based on start date
  const upcomingBookings = bookings.filter(b => b.status === 'CONFIRMED' && new Date(b.startDate) >= new Date())
  
  // Past bookings include COMPLETED and any past departures. Also include CANCELLED here for history.
  const pastBookings = bookings.filter(b => 
    b.status === 'COMPLETED' || 
    b.status === 'CANCELLED' || 
    new Date(b.startDate) < new Date()
  )

  const displayedBookings = activeTab === 'UPCOMING' ? upcomingBookings : pastBookings

  const getDaysUntil = (dateStr: string) => {
    const diff = new Date(dateStr).getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 3600 * 24));
    if (days < 0) return null;
    return days === 0 ? 'Starts today' : `Starts in ${days} day${days === 1 ? '' : 's'}`;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground mb-2">My Bookings</h1>
          <p className="text-muted-foreground text-[0.95rem]">
            Manage your upcoming treks and view your past adventures.
          </p>
        </div>
        
        <Link to={ROUTES.TREKS}>
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-xl w-full sm:w-auto h-11">
            Find a Trek
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-muted rounded-xl w-full max-w-[400px]">
        <button
          onClick={() => setActiveTab('UPCOMING')}
          className={`flex-1 py-2.5 px-4 text-sm font-semibold rounded-lg transition-all ${
            activeTab === 'UPCOMING' 
              ? 'bg-background text-foreground shadow-sm' 
              : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
          }`}
        >
          Upcoming ({upcomingBookings.length})
        </button>
        <button
          onClick={() => setActiveTab('PAST')}
          className={`flex-1 py-2.5 px-4 text-sm font-semibold rounded-lg transition-all ${
            activeTab === 'PAST' 
              ? 'bg-background text-foreground shadow-sm' 
              : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
          }`}
        >
          Past & Cancelled ({pastBookings.length})
        </button>
      </div>

      {/* States */}
      {isLoading && (
        <div className="py-20 flex flex-col items-center justify-center text-center">
          <Loader2 className="w-10 h-10 text-accent animate-spin mb-4" />
          <p className="text-muted-foreground font-medium">Loading your bookings...</p>
        </div>
      )}

      {error && !isLoading && (
        <QueryErrorState error={error} onRetry={refetch} className="my-8" />
      )}

      {!isLoading && !error && displayedBookings.length === 0 && (
        <EmptyState
          className="my-8"
          icon={<Calendar className="w-8 h-8" />}
          title={activeTab === 'UPCOMING' ? 'No upcoming treks' : 'No past treks'}
          description={activeTab === 'UPCOMING' 
            ? 'You have no upcoming treks scheduled. Ready for your next adventure?' 
            : 'You haven\'t completed any treks yet.'}
          primaryAction={activeTab === 'UPCOMING' ? (
            <Button asChild>
              <Link to={ROUTES.TREKS}>Explore Treks</Link>
            </Button>
          ) : undefined}
        />
      )}

      {/* List */}
      {!isLoading && !error && displayedBookings.length > 0 && (
        <div className="grid gap-4 sm:gap-6">
          {displayedBookings.map((booking) => (
            <Card key={booking.id} className="overflow-hidden flex flex-col sm:flex-row group border border-border hover:border-border/80 transition-colors shadow-sm">
              <div className="sm:w-64 h-48 sm:h-auto relative shrink-0 bg-muted flex items-center justify-center">
                {/* Fallback image as API doesn't provide trekImageUrl in summary yet */}
                <div className="absolute inset-0 bg-accent/10 flex flex-col items-center justify-center opacity-80">
                  <Calendar className="w-12 h-12 text-accent/50 mb-2" />
                  <span className="text-xs font-semibold text-accent/70 uppercase">Trek Summary</span>
                </div>
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-md shadow-sm ${
                    booking.status === 'CONFIRMED' ? 'bg-success text-white' : 
                    booking.status === 'CANCELLED' ? 'bg-destructive text-white' :
                    booking.status === 'COMPLETED' ? 'bg-foreground text-background' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {booking.status}
                  </span>
                </div>
              </div>
              
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-center">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="font-display font-bold text-xl text-foreground line-clamp-1">
                    {booking.trekTitle}
                  </h3>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-lg text-foreground mb-1">{formatCurrency(booking.totalAmount)}</p>
                    <Badge variant={booking.paymentStatus === 'SUCCESS' ? 'default' : 'secondary'} className="uppercase text-[10px]">
                      {booking.paymentStatus}
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-col gap-2 mt-4">
                  {activeTab === 'UPCOMING' && getDaysUntil(booking.startDate) && (
                    <div className="inline-flex w-fit px-2.5 py-1 bg-accent/10 text-accent text-xs font-bold rounded-md mb-1">
                      {getDaysUntil(booking.startDate)}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                    <Calendar className="w-4 h-4 shrink-0 text-foreground/70" />
                    <span>{new Date(booking.startDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                    <MapPin className="w-4 h-4 shrink-0 text-foreground/70" />
                    <span>{booking.totalParticipants} {booking.totalParticipants === 1 ? 'Traveller' : 'Travellers'}</span>
                  </div>
                </div>

                {/* Actions removed as endpoints/routes are unsupported */}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
