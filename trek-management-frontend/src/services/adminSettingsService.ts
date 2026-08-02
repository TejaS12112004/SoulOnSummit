import apiClient from '@/api/apiClient';
import type { ApiResponse, AdminSiteSettingsResponse, SiteSettingsRequest } from '@/types/api';

const adminSettingsService = {
  getSettings: (): Promise<AdminSiteSettingsResponse> => {
    return apiClient
      .get<ApiResponse<AdminSiteSettingsResponse>>('/admin/settings')
      .then((res) => res.data.data);
  },

  updateSettings: (request: SiteSettingsRequest): Promise<AdminSiteSettingsResponse> => {
    return apiClient
      .put<ApiResponse<AdminSiteSettingsResponse>>('/admin/settings', request)
      .then((res) => res.data.data);
  },

  uploadLogo: (file: File): Promise<{ publicUrl: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient
      .post<ApiResponse<{ publicUrl: string }>>('/admin/storage/settings/logo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((res) => res.data.data);
  },

  uploadFavicon: (file: File): Promise<{ publicUrl: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient
      .post<ApiResponse<{ publicUrl: string }>>('/admin/storage/settings/favicon', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((res) => res.data.data);
  },
};

export default adminSettingsService;
