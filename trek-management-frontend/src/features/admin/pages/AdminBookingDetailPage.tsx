import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  ArrowLeft, Calendar, CreditCard, User, Map, AlertCircle, Edit2 
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { ROUTES } from '@/constants/routes'
import { formatCurrency } from '@/utils/formatters/currency'
import { formatDate } from '@/utils/formatters/formatDate'
import { useAdminBooking, useUpdateBooking } from '../hooks/useAdminBookings'
import type { BookingStatus, PaymentStatus } from '@/features/booking/types/booking'

const updateBookingSchema = z.object({
  status: z.string(),
  paymentStatus: z.string(),
})

type UpdateBookingFormValues = z.infer<typeof updateBookingSchema>

function StatusBadge({ status, type }: { status: string, type: 'booking' | 'payment' }) {
  const bookingStyles: Record<string, string> = {
    PENDING_PAYMENT: 'bg-amber-100 text-amber-800',
    CONFIRMED: 'bg-emerald-100 text-emerald-800',
    CANCELLED: 'bg-destructive/10 text-destructive',
    EXPIRED: 'bg-muted text-muted-foreground',
    COMPLETED: 'bg-blue-100 text-blue-800',
    REFUNDED: 'bg-purple-100 text-purple-800',
  }
  const paymentStyles: Record<string, string> = {
    CREATED: 'bg-gray-100 text-gray-800',
    ATTEMPTED: 'bg-orange-100 text-orange-800',
    SUCCESS: 'bg-emerald-100 text-emerald-800',
    FAILED: 'bg-destructive/10 text-destructive',
    REFUNDED: 'bg-purple-100 text-purple-800',
    PARTIALLY_REFUNDED: 'bg-indigo-100 text-indigo-800',
  }
  
  const styles = type === 'booking' ? bookingStyles : paymentStyles
  const fallbackClass = type === 'booking' ? styles.EXPIRED : styles.CREATED

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[status] || fallbackClass}`}>
      {status}
    </span>
  )
}

export default function AdminBookingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [isEditOpen, setIsEditOpen] = useState(false)

  const { data: booking, isLoading, isError, refetch } = useAdminBooking(id)
  const updateMutation = useUpdateBooking()

  const { handleSubmit, control, reset } = useForm<UpdateBookingFormValues>({
    resolver: zodResolver(updateBookingSchema)
  })

  const openEditSheet = () => {
    if (booking) {
      reset({
        status: booking.status,
        paymentStatus: booking.paymentStatus,
      })
      setIsEditOpen(true)
    }
  }

  const onUpdateSubmit = (data: UpdateBookingFormValues) => {
    if (!id) return
    updateMutation.mutate({ 
      id, 
      data: { 
        status: data.status as BookingStatus, 
        paymentStatus: data.paymentStatus as PaymentStatus 
      } 
    }, {
      onSuccess: () => setIsEditOpen(false)
    })
  }

  if (isLoading) {
    return (
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <div className="flex gap-4 items-center">
          <Skeleton className="h-10 w-10 rounded-md" />
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  if (isError || !booking) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <Button variant="ghost" asChild className="mb-6 -ml-4 text-muted-foreground">
          <Link to={ROUTES.ADMIN_BOOKINGS}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Bookings
          </Link>
        </Button>
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-3 text-destructive">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm font-medium">Failed to load booking details.</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => refetch()}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate(ROUTES.ADMIN_BOOKINGS)} className="shrink-0">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Booking {booking.bookingReference}
              </h1>
              <StatusBadge status={booking.status} type="booking" />
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Booked on {formatDate(booking.bookedAt)} via {booking.bookingSource}
            </p>
          </div>
        </div>
        <Button onClick={openEditSheet} variant="secondary">
          <Edit2 className="w-4 h-4 mr-2" /> Update Status
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer Info */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="w-5 h-5 text-muted-foreground" /> Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Name</p>
                <p className="text-sm font-semibold">{booking.userName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Email</p>
                <p className="text-sm font-semibold">{booking.userEmail}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Participants</p>
                <p className="text-sm font-semibold">{booking.totalParticipants}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trek & Departure Info */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Map className="w-5 h-5 text-muted-foreground" /> Trek Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <p className="text-sm font-medium text-muted-foreground mb-1">Trek Name</p>
                <p className="text-sm font-semibold">{booking.trekTitle}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Departure Date</p>
                <p className="text-sm font-semibold flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-muted-foreground" /> 
                  {formatDate(booking.startDate)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Info */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-muted-foreground" /> Payment Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row justify-between p-4 bg-muted/30 rounded-lg border border-border">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                <p className="text-2xl font-bold tracking-tight text-foreground">
                  {formatCurrency(booking.totalAmount)}
                </p>
              </div>
              <div className="mt-4 sm:mt-0 space-y-1 text-left sm:text-right">
                <p className="text-sm font-medium text-muted-foreground">Payment Status</p>
                <div>
                  <StatusBadge status={booking.paymentStatus} type="payment" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Sheet */}
      <Sheet open={isEditOpen} onOpenChange={setIsEditOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Update Booking</SheetTitle>
            <SheetDescription>
              Update the booking status or payment status.
            </SheetDescription>
          </SheetHeader>
          
          <form onSubmit={handleSubmit(onUpdateSubmit)} className="mt-6 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Booking Status</label>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING_PAYMENT">PENDING_PAYMENT</SelectItem>
                      <SelectItem value="CONFIRMED">CONFIRMED</SelectItem>
                      <SelectItem value="COMPLETED">COMPLETED</SelectItem>
                      <SelectItem value="CANCELLED">CANCELLED</SelectItem>
                      <SelectItem value="EXPIRED">EXPIRED</SelectItem>
                      <SelectItem value="REFUNDED">REFUNDED</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Payment Status</label>
              <Controller
                control={control}
                name="paymentStatus"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CREATED">CREATED</SelectItem>
                      <SelectItem value="ATTEMPTED">ATTEMPTED</SelectItem>
                      <SelectItem value="SUCCESS">SUCCESS</SelectItem>
                      <SelectItem value="FAILED">FAILED</SelectItem>
                      <SelectItem value="REFUNDED">REFUNDED</SelectItem>
                      <SelectItem value="PARTIALLY_REFUNDED">PARTIALLY_REFUNDED</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  )
}
