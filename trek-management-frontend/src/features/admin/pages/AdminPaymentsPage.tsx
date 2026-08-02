import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDebounce } from '@/hooks/useDebounce';
import adminPaymentService from '@/services/adminPaymentService';
import type { AdminPaymentFilterParams } from '@/types/api';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  FileText,
  CheckCircle,
  RefreshCcw,
  IndianRupee,
  Clock,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminPaymentsPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const size = 20;

  const debouncedSearch = useDebounce(searchTerm, 300);

  const filters: AdminPaymentFilterParams = {
    page,
    size,
    sortBy: 'createdAt',
    sortDir: 'desc',
    search: debouncedSearch,
  };

  const { data, isLoading } = useQuery({
    queryKey: ['adminPayments', filters],
    queryFn: () => adminPaymentService.searchPayments(filters),
  });

  const markPaidMutation = useMutation({
    mutationFn: (paymentId: string) => adminPaymentService.markAsPaid(paymentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPayments'] });
    },
  });

  const refundMutation = useMutation({
    mutationFn: (paymentId: string) => adminPaymentService.refundPayment(paymentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPayments'] });
    },
  });

  const payments = data?.content || [];
  const totalPages = data?.totalPages || 1;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
            <CheckCircle className="w-3 h-3" />
            SUCCESS
          </span>
        );
      case 'PENDING':
      case 'CREATED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
            <Clock className="w-3 h-3" />
            {status}
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3" />
            FAILED
          </span>
        );
      case 'REFUNDED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <RefreshCcw className="w-3 h-3" />
            REFUNDED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-gray-900">Payments</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Manage transactions, view invoices, and process refunds.
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by order ID, booking ref, or user email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(0);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-sm font-semibold text-gray-900">Reference / Order ID</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900">User / Trek</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900">Amount</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                      Loading payments...
                    </div>
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                        <Search className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-gray-900 font-medium">No payments found</p>
                      <p className="text-gray-500 text-sm mt-1">
                        Try adjusting your search criteria.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="hover:bg-gray-50 transition-colors group"
                  >
                    <td className="px-6 py-4 align-top">
                      <div className="font-medium text-gray-900">
                        {payment.bookingReference}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 font-mono">
                        {payment.razorpayOrderId}
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="font-medium text-gray-900">{payment.userName}</div>
                      <div className="text-sm text-gray-500">{payment.userEmail}</div>
                      <div className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded mt-2 inline-block">
                        {payment.trekTitle}
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="flex items-center font-medium text-gray-900">
                        <IndianRupee className="w-3 h-3 mr-0.5 text-gray-500" />
                        {payment.amount.toLocaleString('en-IN')}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {payment.paidAt ? new Date(payment.paidAt).toLocaleDateString() : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      {getStatusBadge(payment.status)}
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="flex items-center gap-2 flex-wrap">
                        {payment.invoiceUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-3"
                            onClick={() => window.open(payment.invoiceUrl, '_blank')}
                          >
                            <FileText className="w-4 h-4 mr-1.5" />
                            Invoice
                          </Button>
                        )}
                        
                        {payment.status !== 'SUCCESS' && payment.status !== 'REFUNDED' && (
                          <Button
                            variant="secondary"
                            size="sm"
                            className="h-8 px-3 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-none"
                            onClick={() => {
                              if (confirm('Are you sure you want to mark this as paid manually?')) {
                                markPaidMutation.mutate(payment.id);
                              }
                            }}
                            disabled={markPaidMutation.isPending}
                          >
                            <CheckCircle className="w-4 h-4 mr-1.5" />
                            Mark Paid
                          </Button>
                        )}

                        {payment.status === 'SUCCESS' && (
                          <Button
                            variant="secondary"
                            size="sm"
                            className="h-8 px-3 bg-red-50 text-red-600 hover:bg-red-100 border-none"
                            onClick={() => {
                              if (confirm('Are you sure you want to refund this payment?')) {
                                refundMutation.mutate(payment.id);
                              }
                            }}
                            disabled={refundMutation.isPending}
                          >
                            <RefreshCcw className="w-4 h-4 mr-1.5" />
                            Refund
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing page {page + 1} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
