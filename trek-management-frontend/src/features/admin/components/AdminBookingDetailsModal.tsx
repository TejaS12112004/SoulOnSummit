import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Loader2, Calendar, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import adminBookingService from '@/services/adminBookingService';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/formatters/currency';
import { format } from 'date-fns';
import { toast } from 'sonner';
import type { BookingStatus } from '@/types/api';

interface AdminBookingDetailsModalProps {
  bookingId: string;
  onClose: () => void;
}

export function AdminBookingDetailsModal({ bookingId, onClose }: AdminBookingDetailsModalProps) {
  const queryClient = useQueryClient();
  const [updating, setUpdating] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState<BookingStatus | null>(null);

  const { data: booking, isLoading, isError } = useQuery({
    queryKey: ['adminBookingDetails', bookingId],
    queryFn: () => adminBookingService.getBookingDetails(bookingId),
  });

  const updateMutation = useMutation({
    mutationFn: (newStatus: BookingStatus) => 
      adminBookingService.updateBooking(bookingId, { status: newStatus }),
    onMutate: () => setUpdating(true),
    onSuccess: () => {
      toast.success('Booking status updated successfully');
      queryClient.invalidateQueries({ queryKey: ['adminBookingDetails', bookingId] });
      queryClient.invalidateQueries({ queryKey: ['adminBookings'] });
    },
    onError: () => toast.error('Failed to update booking status'),
    onSettled: () => {
      setUpdating(false);
      setStatusUpdate(null);
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
      case 'COMPLETED':
        return <Badge className="bg-emerald-500">{status}</Badge>;
      case 'PENDING_PAYMENT':
        return <Badge className="bg-amber-500">{status}</Badge>;
      case 'CANCELLED':
      case 'REFUNDED':
        return <Badge variant="destructive">{status}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return <Badge className="bg-emerald-500">{status}</Badge>;
      case 'PENDING':
        return <Badge className="bg-amber-500">{status}</Badge>;
      case 'FAILED':
      case 'REFUNDED':
        return <Badge variant="destructive">{status}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value) {
      setStatusUpdate(e.target.value as BookingStatus);
    } else {
      setStatusUpdate(null);
    }
  };

  const handleUpdateClick = () => {
    if (statusUpdate) {
      updateMutation.mutate(statusUpdate);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
    }}>
      <div style={{
        background: '#fff', borderRadius: '24px', width: '100%', maxWidth: '800px',
        maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px 32px', borderBottom: '1px solid #E5E7EB',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F9FAFB'
        }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1C2B3A', margin: 0, fontFamily: 'inherit' }}>
              Booking Details
            </h2>
            {booking && (
              <p className="text-sm text-gray-500 mt-1 font-mono">Ref: {booking.bookingReference}</p>
            )}
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#6B7280', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '32px', overflowY: 'auto', flex: 1 }} className="space-y-8">
          {isLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="animate-spin text-gray-400 w-8 h-8" /></div>
          ) : isError || !booking ? (
            <div className="text-center py-12 text-red-500">Failed to load booking details.</div>
          ) : (
            <>
              {/* Overview Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div className="text-xs text-gray-500 font-semibold uppercase mb-1">Trek Info</div>
                  <div className="font-bold text-gray-900 text-lg mb-2">{booking.trekTitle}</div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <Calendar className="w-4 h-4" /> {format(new Date(booking.startDate), 'MMM d, yyyy')} - {format(new Date(booking.endDate), 'MMM d, yyyy')}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" /> {booking.location}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div className="text-xs text-gray-500 font-semibold uppercase mb-1">Status Overview</div>
                  <div className="flex flex-col gap-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Booking Status:</span>
                      {getStatusBadge(booking.status)}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Payment Status:</span>
                      {getPaymentBadge(booking.paymentStatus)}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Booking Source:</span>
                      <span className="text-sm font-semibold">{booking.bookingSource}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Participants */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Participants ({booking.totalParticipants})</h3>
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 font-semibold text-gray-700">Name</th>
                        <th className="px-4 py-3 font-semibold text-gray-700">Age / Gender</th>
                        <th className="px-4 py-3 font-semibold text-gray-700">Contact</th>
                        <th className="px-4 py-3 font-semibold text-gray-700">Emergency</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {booking.participants.map((p, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">{p.fullName}</td>
                          <td className="px-4 py-3">{p.age} yrs • {p.gender}</td>
                          <td className="px-4 py-3">
                            <div>{p.phone || '-'}</div>
                            <div className="text-xs text-gray-500">{p.email || ''}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div>{p.emergencyContactName || '-'}</div>
                            <div className="text-xs text-gray-500">{p.emergencyContactPhone || ''}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Breakdown</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatCurrency(booking.subtotal)}</span>
                  </div>
                  {booking.discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-emerald-600">
                      <span>Discount Applied</span>
                      <span>-{formatCurrency(booking.discountAmount)}</span>
                    </div>
                  )}
                  <div className="pt-3 mt-3 border-t border-gray-200 flex justify-between font-bold text-lg text-gray-900">
                    <span>Total Amount</span>
                    <span>{formatCurrency(booking.totalAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Special Requests */}
              {booking.specialRequests && (
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                  <h4 className="text-sm font-bold text-amber-900 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Special Requests
                  </h4>
                  <p className="text-sm text-amber-800 whitespace-pre-wrap">{booking.specialRequests}</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div style={{
          padding: '20px 32px', borderTop: '1px solid #E5E7EB', background: '#F9FAFB',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          {/* Admin Override controls */}
          <div className="flex items-center gap-3">
            <select 
              className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={statusUpdate || ''}
              onChange={handleStatusChange}
              disabled={isLoading || !booking}
            >
              <option value="">-- Change Status --</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="CANCELLED">CANCELLED</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="REFUNDED">REFUNDED</option>
            </select>
            <Button 
              onClick={handleUpdateClick} 
              disabled={!statusUpdate || updating}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {updating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
              Update Status
            </Button>
          </div>

          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
