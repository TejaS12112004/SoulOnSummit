import type { BookingDetailViewModel } from '../types/booking'
import { formatCurrency } from '@/utils/formatters/currency'

interface BookingPriceBreakdownProps {
  booking: BookingDetailViewModel
}

export function BookingPriceBreakdown({ booking }: BookingPriceBreakdownProps) {
  // We can derive price per traveller
  const pricePerTraveller = booking.subtotal / booking.totalParticipants

  return (
    <div className="bg-card shadow-sm rounded-2xl border border-border/40 p-7 mb-6">
      <h2 className="text-[1.1rem] font-bold text-foreground mb-6 uppercase tracking-widest">Price Breakdown</h2>
      
      <div className="space-y-4 text-[0.95rem]">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground font-medium">
            {formatCurrency(pricePerTraveller)} × {booking.totalParticipants} Traveller{booking.totalParticipants > 1 ? 's' : ''}
          </p>
          <p className="text-foreground font-semibold">{formatCurrency(booking.subtotal)}</p>
        </div>
        
        {booking.discountAmount > 0 && (
          <div className="flex items-center justify-between text-success font-medium">
            <p>Discount applied</p>
            <p>-{formatCurrency(booking.discountAmount)}</p>
          </div>
        )}

        <div className="border-t border-border/40 mt-6 pt-6 flex items-end justify-between">
          <div>
            <p className="text-foreground font-bold text-lg mb-0.5">Total Amount</p>
            <p className="text-muted-foreground text-[0.75rem] font-medium">Includes 5% GST & Permits</p>
          </div>
          <p className="text-3xl lg:text-[2.2rem] leading-none font-display font-bold text-accent tracking-tight">
            {formatCurrency(booking.totalAmount)}
          </p>
        </div>
      </div>
    </div>
  )
}
