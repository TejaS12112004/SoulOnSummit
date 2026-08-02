import apiClient from '@/api/apiClient';
import type { ApiResponse, PageResponse, AdminPaymentResponse, AdminPaymentFilterParams } from '@/types/api';

const adminPaymentService = {
  searchPayments: (params: AdminPaymentFilterParams): Promise<PageResponse<AdminPaymentResponse>> => {
    return apiClient
      .get<ApiResponse<PageResponse<AdminPaymentResponse>>>('/admin/payments', { params })
      .then((res) => res.data.data);
  },

  markAsPaid: (paymentId: string): Promise<void> => {
    return apiClient
      .post<ApiResponse<void>>(`/admin/payments/${paymentId}/mark-paid`)
      .then(() => {});
  },

  refundPayment: (paymentId: string): Promise<void> => {
    return apiClient
      .post<ApiResponse<void>>(`/admin/payments/${paymentId}/refund`)
      .then(() => {});
  },
};

export default adminPaymentService;
