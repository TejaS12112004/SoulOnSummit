import apiClient from '@/api/apiClient';
import type { ApiResponse, PageResponse, AdminReviewResponse, AdminReviewFilterParams } from '@/types/api';

const adminReviewService = {
  searchReviews: (params: AdminReviewFilterParams): Promise<PageResponse<AdminReviewResponse>> => {
    return apiClient
      .get<ApiResponse<PageResponse<AdminReviewResponse>>>('/admin/reviews', { params })
      .then((res) => res.data.data);
  },

  setApprovalStatus: (reviewId: string, approved: boolean): Promise<void> => {
    return apiClient
      .patch<ApiResponse<void>>(`/admin/reviews/${reviewId}/approval`, { status: approved })
      .then(() => {});
  },

  setFeaturedStatus: (reviewId: string, featured: boolean): Promise<void> => {
    return apiClient
      .patch<ApiResponse<void>>(`/admin/reviews/${reviewId}/featured`, { status: featured })
      .then(() => {});
  },
};

export default adminReviewService;
