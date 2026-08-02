import apiClient from '@/api/apiClient';
import type { ApiResponse, PageResponse, AdminUserResponse, AdminUserFilterParams } from '@/types/api';

const adminUserService = {
  searchUsers: (params: AdminUserFilterParams): Promise<PageResponse<AdminUserResponse>> => {
    return apiClient
      .get<ApiResponse<PageResponse<AdminUserResponse>>>('/admin/users', { params })
      .then((res) => res.data.data);
  },
};

export default adminUserService;
