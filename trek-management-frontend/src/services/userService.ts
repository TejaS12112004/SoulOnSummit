import apiClient from '@/api/apiClient';
import { ENDPOINTS } from '@/api/endpoints';
import type { ApiResponse } from '@/types/api';
import type { User as UserResponse } from '@/types/auth';

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface UpdatePreferencesRequest {
  notifyBookingUpdates: boolean;
  notifyUpcomingTreks: boolean;
  notifyPromotions: boolean;
}

export interface ChangePasswordRequest {
  currentPassword?: string; // Or however the backend defines it
  newPassword?: string;
}

const userService = {
  /**
   * Get the current user's profile
   */
  getProfile: (): Promise<UserResponse> =>
    apiClient
      .get<ApiResponse<UserResponse>>(ENDPOINTS.USERS.ME)
      .then((res) => res.data.data),

  /**
   * Update the current user's profile
   */
  updateProfile: (data: UpdateProfileRequest): Promise<UserResponse> =>
    apiClient
      .put<ApiResponse<UserResponse>>(ENDPOINTS.USERS.ME, data)
      .then((res) => res.data.data),

  updatePreferences: (data: UpdatePreferencesRequest): Promise<void> =>
    apiClient
      .put<ApiResponse<void>>('/users/preferences', data)
      .then((res) => res.data.data),

  changePassword: (data: any): Promise<void> =>
    apiClient
      .put<ApiResponse<void>>('/users/me/password', data)
      .then((res) => res.data.data),

  deleteAccount: (): Promise<void> =>
    apiClient
      .delete<ApiResponse<void>>('/users/me')
      .then((res) => res.data.data),

  updateProfileImage: (file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient
      .put<ApiResponse<void>>('/users/profile-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((res) => res.data.data);
  },
};

export default userService;
