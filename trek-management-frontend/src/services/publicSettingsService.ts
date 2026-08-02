import apiClient from '@/api/apiClient';
import type { ApiResponse, PublicSiteSettingsResponse } from '@/types/api';

const publicSettingsService = {
  getPublicSettings: (): Promise<PublicSiteSettingsResponse> => {
    return apiClient
      .get<ApiResponse<PublicSiteSettingsResponse>>('/settings/public')
      .then((res) => res.data.data);
  },
};

export default publicSettingsService;
