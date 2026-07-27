import { Clock, CheckCircle, XCircle, AlertCircle, MapPin, Calendar, Activity } from 'lucide-react'
import type { BookingDetailViewModel } from '../types/booking'
import { formatDate } from '@/utils/formatters/formatDate'

interface BookingReviewHeaderProps {
  booking: BookingDetailViewModel
}

const statusConfig = {
  PENDING_PAYMENT: { label: 'Pending Payment', icon: Clock, colorClass: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  CONFIRMED: { label: 'Confirmed', icon: CheckCircle, colorClass: 'text-green-400 bg-green-500/10 border-green-500/20' },
  CANCELLED: { label: 'Cancelled', icon: XCircle, colorClass: 'text-red-400 bg-red-500/10 border-red-500/20' },
  EXPIRED: { label: 'Expired', icon: AlertCircle, colorClass: 'text-red-400 bg-red-500/10 border-red-500/20' },
  COMPLETED: { label: 'Completed', icon: CheckCircle, colorClass: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  REFUNDED: { label: 'Refunded', icon: AlertCircle, colorClass: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
}

export function BookingReviewHeader({ booking }: BookingReviewHeaderProps) {
  const config = statusConfig[booking.status] || statusConfig.PENDING_PAYMENT
  const StatusIcon = config.icon

  return (
    <div className="bg-white shadow-sm rounded-2xl border border-white/10 p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
        <div>
          <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Booking Reference</p>
          <h1 className="text-2xl font-mono font-bold text-white">{booking.bookingReference}</h1>
        </div>
        <div className="flex flex-col items-start md:items-end gap-2">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium ${config.colorClass}`}>
            <StatusIcon className="w-4 h-4" />
            {config.label}
          </span>
          <p className="text-white/40 text-xs">
            Created: {formatDate(booking.bookedAt)}
          </p>
        </div>
      </div>

      <div className="border-t border-white/10 pt-6">
        <h2 className="text-xl font-display font-bold text-white mb-4">{booking.trekTitle}</h2>
        <div className="flex flex-wrap gap-x-6 gap-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-white/40" />
            <div>
              <p className="text-white/40 text-xs mb-0.5">Dates</p>
              <p className="text-white text-sm">
                {formatDate(booking.startDate)} – {formatDate(booking.endDate)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-white/40" />
            <div>
              <p className="text-white/40 text-xs mb-0.5">Difficulty</p>
              <p className="text-white text-sm capitalize">{booking.difficulty.toLowerCase()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-white/40" />
            <div>
              <p className="text-white/40 text-xs mb-0.5">Duration</p>
              <p className="text-white text-sm">{booking.durationDays} Days</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-white/40" />
            <div>
              <p className="text-white/40 text-xs mb-0.5">Location</p>
              <p className="text-white text-sm">{booking.location}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
