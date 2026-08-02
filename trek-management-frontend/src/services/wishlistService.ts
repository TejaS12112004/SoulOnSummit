import apiClient from '@/api/apiClient';
import type { TrekSummaryResponse } from '@/types/api';

const API_URL = '/wishlist';

export const wishlistService = {
  getMyWishlist: async (): Promise<TrekSummaryResponse[]> => {
    const response = await apiClient.get(API_URL);
    return response.data;
  },

  getWishlistTrekIds: async (): Promise<string[]> => {
    const response = await apiClient.get(`${API_URL}/ids`);
    return response.data;
  },

  addToWishlist: async (trekId: string): Promise<void> => {
    await apiClient.post(`${API_URL}/${trekId}`);
  },

  removeFromWishlist: async (trekId: string): Promise<void> => {
    await apiClient.delete(`${API_URL}/${trekId}`);
  }
};
