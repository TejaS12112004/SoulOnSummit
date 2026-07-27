import type { BookingDetailViewModel } from '../types/booking'
import { formatCurrency } from '@/utils/formatters/currency'

interface BookingPriceBreakdownProps {
  booking: BookingDetailViewModel
}

export function BookingPriceBreakdown({ booking }: BookingPriceBreakdownProps) {
  // We can derive price per traveller
  const pricePerTraveller = booking.subtotal / booking.totalParticipants

  return (
    <div className="bg-white shadow-card rounded-2xl border border-white/10 p-6 mb-6">
      <h2 className="text-xl font-display font-bold text-white mb-6">Price Breakdown</h2>
      
      <div className="space-y-4 text-sm">
        <div className="flex items-center justify-between">
          <p className="text-white/70">
            {formatCurrency(pricePerTraveller)} × {booking.totalParticipants} Traveller{booking.totalParticipants > 1 ? 's' : ''}
          </p>
          <p className="text-white font-medium">{formatCurrency(booking.subtotal)}</p>
        </div>
        
        {booking.discountAmount > 0 && (
          <div className="flex items-center justify-between text-green-400">
            <p>Discount applied</p>
            <p>-{formatCurrency(booking.discountAmount)}</p>
          </div>
        )}

        <div className="border-t border-white/10 pt-4 flex items-center justify-between">
          <div>
            <p className="text-white font-bold">Total Amount</p>
            <p className="text-white/40 text-xs mt-0.5">Includes 5% GST & Permits</p>
          </div>
          <p className="text-2xl font-display font-bold text-accent">
            {formatCurrency(booking.totalAmount)}
          </p>
        </div>
      </div>
    </div>
  )
}
