import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Eye, FilterX } from 'lucide-react';
import adminBookingService, { type AdminBookingFilters } from '@/services/adminBookingService';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pagination } from '@/components/ui/Pagination';
import { QueryErrorState } from '@/components/ui/QueryErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { formatCurrency } from '@/utils/formatters/currency';
import type { AdminBookingResponse, BookingStatus, PaymentStatus } from '@/types/api';
import { AdminBookingDetailsModal } from '../components/AdminBookingDetailsModal';

export function AdminBookingsPage() {
  const [page, setPage] = useState(0);
  
  // Filters State
  const [filters, setFilters] = useState<AdminBookingFilters>({
    page: 0,
    size: 15,
  });

  const [bookingRefInput, setBookingRefInput] = useState('');
  const [emailInput, setEmailInput] = useState('');

  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['adminBookings', filters],
    queryFn: () => adminBookingService.listBookings(filters),
  });

  const handleApplyFilters = () => {
    setFilters(prev => ({
      ...prev,
      bookingReference: bookingRefInput || undefined,
      email: emailInput || undefined,
      page: 0 // reset to first page on new filter
    }));
    setPage(0);
  };

  const clearFilters = () => {
    setBookingRefInput('');
    setEmailInput('');
    setFilters({ page: 0, size: 15 });
    setPage(0);
  };

  const getStatusBadge = (status: BookingStatus) => {
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

  const getPaymentBadge = (status: PaymentStatus) => {
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

  if (isError) {
    return <QueryErrorState error={error as Error} onRetry={() => refetch()} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
          <p className="text-gray-500 mt-1">Manage and track customer bookings.</p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-wrap items-end gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Booking Reference</label>
          <Input 
            placeholder="e.g. BKG-1234..." 
            value={bookingRefInput} 
            onChange={(e) => setBookingRefInput(e.target.value)} 
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Email</label>
          <Input 
            placeholder="user@example.com" 
            value={emailInput} 
            onChange={(e) => setEmailInput(e.target.value)} 
          />
        </div>
        <div className="flex-1 min-w-[150px]">
          <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Booking Status</label>
          <select 
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            value={filters.status || ''}
            onChange={(e) => {
              setFilters(prev => ({ ...prev, status: (e.target.value as BookingStatus) || undefined, page: 0 }));
              setPage(0);
            }}
          >
            <option value="">All Statuses</option>
            <option value="PENDING_PAYMENT">Pending Payment</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="COMPLETED">Completed</option>
            <option value="REFUNDED">Refunded</option>
          </select>
        </div>
        <div className="flex-1 min-w-[150px]">
          <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Payment Status</label>
          <select 
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            value={filters.paymentStatus || ''}
            onChange={(e) => {
              setFilters(prev => ({ ...prev, paymentStatus: (e.target.value as PaymentStatus) || undefined, page: 0 }));
              setPage(0);
            }}
          >
            <option value="">All Payments</option>
            <option value="PENDING">Pending</option>
            <option value="SUCCESS">Success</option>
            <option value="FAILED">Failed</option>
            <option value="REFUNDED">Refunded</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <Button onClick={handleApplyFilters} className="bg-gray-900 text-white hover:bg-gray-800 flex items-center gap-2">
            <Search className="w-4 h-4" />
            Search
          </Button>
          <Button variant="outline" onClick={clearFilters} title="Clear Filters">
            <FilterX className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Reference</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Trek & Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-6 w-20 rounded-full" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-6 w-20 rounded-full" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-16" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-8 w-10 float-right" /></td>
                  </tr>
                ))
              ) : data?.content.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12">
                    <EmptyState
                      title="No bookings found"
                      description="Try adjusting your search filters."
                    />
                  </td>
                </tr>
              ) : (
                data?.content.map((booking: AdminBookingResponse) => (
                  <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-gray-900">{booking.bookingReference}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{booking.userName}</div>
                      <div className="text-xs text-gray-500">{booking.userEmail}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{booking.trekTitle}</div>
                      <div className="text-xs text-gray-500">
                        {format(new Date(booking.startDate), 'MMM d, yyyy')}
                      </div>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(booking.status)}</td>
                    <td className="px-6 py-4">{getPaymentBadge(booking.paymentStatus)}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {formatCurrency(booking.totalAmount)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedBookingId(booking.id)}
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {data && data.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100">
            <Pagination
              currentPage={page + 1}
              totalPages={data.totalPages}
              onPageChange={(p) => {
                const newPage = p - 1;
                setPage(newPage);
                setFilters(prev => ({ ...prev, page: newPage }));
              }}
            />
          </div>
        )}
      </div>

      {selectedBookingId && (
        <AdminBookingDetailsModal 
          bookingId={selectedBookingId} 
          onClose={() => setSelectedBookingId(null)} 
        />
      )}
    </div>
  );
}
