import { Lock, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { BookingDetailViewModel } from '../types/booking'
import { formatCurrency } from '@/utils/formatters/currency'
import { formatDate } from '@/utils/formatters/formatDate'
import { useNavigate } from 'react-router-dom'

interface BookingReviewSidebarProps {
  booking: BookingDetailViewModel
}

export function BookingReviewSidebar({ booking }: BookingReviewSidebarProps) {
  const navigate = useNavigate()

  const handleProceedToPayment = () => {
    // Placeholder for Sprint 6 Payment Integration
    navigate('/payment')
  }

  return (
    <div className="bg-card shadow-sm rounded-2xl border border-border p-6 space-y-5 sticky top-6">
      <div>
        <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Total Amount</p>
        <p className="text-accent font-display font-bold text-3xl">
          {formatCurrency(booking.totalAmount)}
        </p>
        <p className="text-muted-foreground text-xs mt-1">
          For {booking.totalParticipants} traveller{booking.totalParticipants !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="border-t border-border" />

      <div className="space-y-1.5">
        <p className="text-muted-foreground text-xs uppercase tracking-wider">Departure</p>
        <p className="text-foreground text-sm font-medium">
          {formatDate(booking.startDate)} → {formatDate(booking.endDate)}
        </p>
      </div>

      <div className="border-t border-border" />

      {/* Secure Checkout Badge */}
      <div className="flex items-center justify-center gap-2 py-2 px-3 bg-muted rounded-xl border border-border">
        <Lock className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-muted-foreground text-xs">Secure checkout — SSL encrypted</span>
      </div>

      {/* CTA */}
      <Button
        onClick={handleProceedToPayment}
        className="w-full py-3.5 rounded-xl font-semibold text-sm transition-colors duration-200 flex items-center justify-center gap-2 bg-accent hover:bg-accent/80 text-accent-foreground"
      >
        <CreditCard className="w-4 h-4" />
        Proceed to Payment
      </Button>
      
      <p className="text-center text-muted-foreground text-xs">
        Payment integration coming in Sprint 6
      </p>
    </div>
  )
}
