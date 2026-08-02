import apiClient from '@/api/apiClient';
import type { ApiResponse, PageResponse } from '@/types/api';
import type { 
  TrekResponse, 
  TrekSummaryResponse, 
  CreateTrekRequest, 
  UpdateTrekRequest,
  CreateItineraryDayRequest,
  UpdateItineraryDayRequest,
  ItineraryDayResponse,
  TrekFilterRequest
} from '@/types/trek';

class AdminTrekService {
  // ── TREK MANAGEMENT ───────────────────────────────────────────────────────

  async listAdminTreks(filter: TrekFilterRequest = {}): Promise<PageResponse<TrekSummaryResponse>> {
    const response = await apiClient.get<ApiResponse<PageResponse<TrekSummaryResponse>>>('/admin/treks', { params: filter });
    return response.data.data;
  }

  async getAdminTrekById(id: string): Promise<TrekResponse> {
    const response = await apiClient.get<ApiResponse<TrekResponse>>(`/admin/treks/${id}`);
    return response.data.data;
  }

  async createTrek(data: CreateTrekRequest): Promise<TrekResponse> {
    const response = await apiClient.post<ApiResponse<TrekResponse>>('/admin/treks', data);
    return response.data.data;
  }

  async updateTrek(id: string, data: UpdateTrekRequest): Promise<TrekResponse> {
    const response = await apiClient.put<ApiResponse<TrekResponse>>(`/admin/treks/${id}`, data);
    return response.data.data;
  }

  async deleteTrek(id: string): Promise<void> {
    await apiClient.delete(`/admin/treks/${id}`);
  }

  async publishTrek(id: string): Promise<void> {
    await apiClient.patch(`/admin/treks/${id}/publish`);
  }

  async unpublishTrek(id: string): Promise<void> {
    await apiClient.patch(`/admin/treks/${id}/unpublish`);
  }

  async featureTrek(id: string, featured: boolean): Promise<void> {
    await apiClient.patch(`/admin/treks/${id}/feature`, null, { params: { featured } });
  }

  // ── ITINERARY MANAGEMENT ──────────────────────────────────────────────────

  async createItineraryDay(trekId: string, data: CreateItineraryDayRequest): Promise<ItineraryDayResponse> {
    const response = await apiClient.post<ApiResponse<ItineraryDayResponse>>(`/admin/treks/${trekId}/itinerary`, data);
    return response.data.data;
  }

  async updateItineraryDay(dayId: string, data: UpdateItineraryDayRequest): Promise<ItineraryDayResponse> {
    const response = await apiClient.put<ApiResponse<ItineraryDayResponse>>(`/admin/itinerary/${dayId}`, data);
    return response.data.data;
  }

  async deleteItineraryDay(dayId: string): Promise<void> {
    await apiClient.delete(`/admin/itinerary/${dayId}`);
  }

  // ── STORAGE MANAGEMENT ────────────────────────────────────────────────────

  async uploadTrekCover(trekId: string, file: File): Promise<{ publicUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post<ApiResponse<{ publicUrl: string }>>(
      `/admin/storage/treks/${trekId}/cover`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data.data;
  }

  async uploadTrekItineraryPdf(trekId: string, file: File): Promise<{ publicUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post<ApiResponse<{ publicUrl: string }>>(
      `/admin/storage/treks/${trekId}/itinerary`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data.data;
  }
}

export default new AdminTrekService();
