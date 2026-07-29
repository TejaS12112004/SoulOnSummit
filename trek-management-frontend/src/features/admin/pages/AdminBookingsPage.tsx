import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Eye, XCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Pagination } from '@/components/ui/Pagination'
import { EmptyState, QueryErrorState, ConfirmDialog } from '@/components/ui'
import { toAdminBookingDetail } from '@/constants/routes'
import { formatCurrency } from '@/utils/formatters/currency'
import { formatDate } from '@/utils/formatters/formatDate'
import { useDebounce } from '@/hooks/useDebounce'
import { useAdminBookings, useUpdateBooking } from '../hooks/useAdminBookings'
import type { BookingStatus, PaymentStatus } from '@/features/booking/types/booking'

function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const styles: Record<string, string> = {
    PENDING_PAYMENT: 'bg-amber-100 text-amber-800',
    CONFIRMED: 'bg-emerald-100 text-emerald-800',
    CANCELLED: 'bg-destructive/10 text-destructive',
    EXPIRED: 'bg-muted text-muted-foreground',
    COMPLETED: 'bg-blue-100 text-blue-800',
    REFUNDED: 'bg-purple-100 text-purple-800',
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[status] || styles.EXPIRED}`}>
      {status}
    </span>
  )
}

function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const styles: Record<string, string> = {
    CREATED: 'bg-gray-100 text-gray-800',
    ATTEMPTED: 'bg-orange-100 text-orange-800',
    SUCCESS: 'bg-emerald-100 text-emerald-800',
    FAILED: 'bg-destructive/10 text-destructive',
    REFUNDED: 'bg-purple-100 text-purple-800',
    PARTIALLY_REFUNDED: 'bg-indigo-100 text-indigo-800',
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[status] || styles.CREATED}`}>
      {status}
    </span>
  )
}


export default function AdminBookingsPage() {
  const [page, setPage] = useState(0)
  const [searchInput, setSearchInput] = useState('')
  const debouncedSearch = useDebounce(searchInput, 500)
  const [statusFilter, setStatusFilter] = useState<string>('ALL')

  const [cancelDialog, setCancelDialog] = useState<{isOpen: boolean, bookingId?: string}>({ isOpen: false })

  const filters = {
    page,
    size: 10,
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(statusFilter !== 'ALL' && { status: statusFilter }),
  }

  const { data: bookingsPage, isLoading, isError, refetch } = useAdminBookings(filters)
  const updateMutation = useUpdateBooking()

  const handleCancelBooking = () => {
    if (cancelDialog.bookingId) {
      updateMutation.mutate({ id: cancelDialog.bookingId, data: { status: 'CANCELLED' } })
    }
    setCancelDialog({ isOpen: false })
  }

  const handleResetFilters = () => {
    setSearchInput('')
    setStatusFilter('ALL')
    setPage(0)
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <ConfirmDialog 
        isOpen={cancelDialog.isOpen}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking? This action is irreversible and the customer will be notified."
        isDestructive={true}
        onCancel={() => setCancelDialog({ isOpen: false })}
        onConfirm={handleCancelBooking}
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Booking Management</h1>
          <p className="text-muted-foreground mt-1">Manage all customer bookings and reservations.</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by ID, name, or email..."
              className="pl-9"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value)
                setPage(0)
              }}
            />
          </div>
          
          <div className="w-full md:w-48">
            <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val || 'ALL'); setPage(0); }}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="PENDING_PAYMENT">Pending</SelectItem>
                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {(searchInput || statusFilter !== 'ALL') && (
            <Button variant="ghost" onClick={handleResetFilters} className="text-muted-foreground">
              Reset Filters
            </Button>
          )}
        </CardContent>
      </Card>

      {isError ? (
        <QueryErrorState error={isError} onRetry={refetch} className="my-6" />
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left" aria-label="Bookings">
              <caption className="sr-only">List of all customer bookings</caption>
              <thead className="bg-muted/50 text-muted-foreground border-b border-border whitespace-nowrap">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium">Booking ID</th>
                  <th scope="col" className="px-4 py-3 font-medium">Customer</th>
                  <th scope="col" className="px-4 py-3 font-medium">Trek</th>
                  <th scope="col" className="px-4 py-3 font-medium">Date</th>
                  <th scope="col" className="px-4 py-3 font-medium">Amount</th>
                  <th scope="col" className="px-4 py-3 font-medium">Payment</th>
                  <th scope="col" className="px-4 py-3 font-medium">Status</th>
                  <th scope="col" className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td className="px-4 py-4"><Skeleton className="h-4 w-24" /></td>
                      <td className="px-4 py-4"><Skeleton className="h-4 w-32" /></td>
                      <td className="px-4 py-4"><Skeleton className="h-4 w-40" /></td>
                      <td className="px-4 py-4"><Skeleton className="h-4 w-20" /></td>
                      <td className="px-4 py-4"><Skeleton className="h-4 w-24" /></td>
                      <td className="px-4 py-4"><Skeleton className="h-6 w-20 rounded-full" /></td>
                      <td className="px-4 py-4"><Skeleton className="h-6 w-20 rounded-full" /></td>
                      <td className="px-4 py-4"><Skeleton className="h-8 w-16 ml-auto" /></td>
                    </tr>
                  ))
                ) : bookingsPage?.content.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-0 py-16">
                      <EmptyState 
                        icon={<Search />}
                        title="No bookings found"
                        description="No bookings match your current filter criteria."
                        primaryAction={(searchInput || statusFilter !== 'ALL') ? (
                          <Button variant="outline" onClick={handleResetFilters}>
                            Clear Filters
                          </Button>
                        ) : undefined}
                      />
                    </td>
                  </tr>
                ) : (
                  bookingsPage?.content.map((booking) => (
                    <tr key={booking.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-medium text-foreground">{booking.bookingReference}</div>
                        <div className="text-xs text-muted-foreground">Source: {booking.bookingSource}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-medium">{booking.userName}</div>
                        <div className="text-xs text-muted-foreground">{booking.userEmail}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap max-w-[200px] truncate" title={booking.trekTitle}>
                        <div className="font-medium truncate">{booking.trekTitle}</div>
                        <div className="text-xs text-muted-foreground">{booking.totalParticipants} pax</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-medium">{formatDate(booking.startDate)}</div>
                        <div className="text-xs text-muted-foreground">Booked: {formatDate(booking.bookedAt)}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap font-medium">
                        {formatCurrency(booking.totalAmount)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <PaymentStatusBadge status={booking.paymentStatus} />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <BookingStatusBadge status={booking.status} />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild title="View Details" aria-label="View Booking Details">
                            <Link to={toAdminBookingDetail(booking.id)}>
                              <Eye className="w-4 h-4" />
                            </Link>
                          </Button>
                          {booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-destructive hover:text-destructive hover:bg-destructive/10" 
                              title="Cancel Booking"
                              aria-label="Cancel Booking"
                              onClick={() => setCancelDialog({ isOpen: true, bookingId: booking.id })}
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {bookingsPage && bookingsPage.totalPages > 1 && (
            <div className="p-4 border-t border-border">
              <Pagination
                currentPage={page}
                totalPages={bookingsPage.totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
