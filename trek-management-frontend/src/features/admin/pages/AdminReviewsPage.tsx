import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDebounce } from '@/hooks/useDebounce';
import adminReviewService from '@/services/adminReviewService';
import type { AdminReviewFilterParams } from '@/types/api';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Star,
  CheckCircle,
  XCircle,
  Clock,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminReviewsPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED'>('ALL');
  const [page, setPage] = useState(0);
  const size = 20;

  const debouncedSearch = useDebounce(searchTerm, 300);

  const filters: AdminReviewFilterParams = {
    page,
    size,
    sortBy: 'createdAt',
    sortDir: 'desc',
    search: debouncedSearch,
    status: statusFilter,
  };

  const { data, isLoading } = useQuery({
    queryKey: ['adminReviews', filters],
    queryFn: () => adminReviewService.searchReviews(filters),
  });

  const approvalMutation = useMutation({
    mutationFn: ({ id, approved }: { id: string; approved: boolean }) =>
      adminReviewService.setApprovalStatus(id, approved),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminReviews'] });
      // In a real app we'd also invalidate public review queries if they existed
    },
  });

  const featuredMutation = useMutation({
    mutationFn: ({ id, featured }: { id: string; featured: boolean }) =>
      adminReviewService.setFeaturedStatus(id, featured),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminReviews'] });
    },
  });

  const reviews = data?.content || [];
  const totalPages = data?.totalPages || 1;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-gray-900">Reviews</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Moderate trekker reviews and choose testimonials to feature.
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by reviewer, email, or trek..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(0);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as any);
              setPage(0);
            }}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white text-sm"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-sm font-semibold text-gray-900">Reviewer</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900">Trek</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900">Review</th>
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
                      Loading reviews...
                    </div>
                  </td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                        <Star className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-gray-900 font-medium">No reviews found</p>
                      <p className="text-gray-500 text-sm mt-1">
                        {searchTerm || statusFilter !== 'ALL'
                          ? 'Try adjusting your search or filters.'
                          : 'No reviews have been submitted yet.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                reviews.map((review) => (
                  <tr key={review.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4 align-top">
                      <div className="flex items-center gap-3">
                        {review.user.profileImageUrl ? (
                          <img
                            src={review.user.profileImageUrl}
                            alt=""
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm">
                            {getInitials(review.user.name)}
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-gray-900">{review.user.name}</div>
                          <div className="text-xs text-gray-500">{review.user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="text-sm text-gray-900 font-medium max-w-[200px] truncate">
                        {review.trek.title}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top max-w-xs">
                      <div className="flex items-center gap-1 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      {review.title && (
                        <div className="font-semibold text-sm text-gray-900 truncate mb-1">
                          "{review.title}"
                        </div>
                      )}
                      <div className="text-sm text-gray-600 line-clamp-2">
                        {review.body}
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="flex flex-col gap-2">
                        {review.approved ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 w-max">
                            <CheckCircle className="w-3 h-3" />
                            Approved
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 w-max">
                            <Clock className="w-3 h-3" />
                            Pending
                          </span>
                        )}

                        {review.featured && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 w-max">
                            <Award className="w-3 h-3" />
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="flex items-center gap-2 flex-wrap">
                        {review.approved ? (
                          <>
                            <Button
                              variant="secondary"
                              size="sm"
                              className="h-8 px-3 bg-amber-50 text-amber-700 hover:bg-amber-100 border-none"
                              onClick={() => {
                                if (confirm('Hide this review from the public?')) {
                                  approvalMutation.mutate({ id: review.id, approved: false });
                                }
                              }}
                              disabled={approvalMutation.isPending}
                            >
                              <XCircle className="w-4 h-4 mr-1.5" />
                              Hide
                            </Button>
                            
                            <Button
                              variant="secondary"
                              size="sm"
                              className={`h-8 px-3 border-none ${
                                review.featured 
                                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                                  : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                              }`}
                              onClick={() => featuredMutation.mutate({ id: review.id, featured: !review.featured })}
                              disabled={featuredMutation.isPending}
                            >
                              <Award className="w-4 h-4 mr-1.5" />
                              {review.featured ? 'Unfeature' : 'Feature'}
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant="secondary"
                            size="sm"
                            className="h-8 px-3 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-none"
                            onClick={() => approvalMutation.mutate({ id: review.id, approved: true })}
                            disabled={approvalMutation.isPending}
                          >
                            <CheckCircle className="w-4 h-4 mr-1.5" />
                            Approve
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
