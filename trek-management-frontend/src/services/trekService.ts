/**
 * Trek service — all API calls for the trek domain.
 *
 * Endpoints consumed:
 *   GET /api/v1/treks                              → ENDPOINTS.TREKS.LIST_PUBLIC
 *   GET /api/v1/treks/{id}                         → ENDPOINTS.TREKS.BY_ID(id)
 *   GET /api/v1/treks/{id}/departures              → ENDPOINTS.DEPARTURES.BY_TREK(id)
 *   GET /api/v1/treks/departures/upcoming          → ENDPOINTS.DEPARTURES.UPCOMING_PUBLIC
 *
 * Rules:
 * - Returns raw DTOs only — no mapping here.
 * - Mapping happens in hooks via React Query select().
 * - All endpoint references use the ENDPOINTS registry.
 */
import apiClient from '@/api/apiClient'
import { ENDPOINTS } from '@/api/endpoints'
import type {
  ApiResponse,
  PageResponse,
  TrekFilterParams,
  TrekSummaryResponse,
  TrekResponseDto,
  DepartureResponseDto,
  UpcomingBatchResponse,
} from '@/types/api'

const trekService = {
  listPublic: (params: TrekFilterParams): Promise<PageResponse<TrekSummaryResponse>> =>
    apiClient
      .get<ApiResponse<PageResponse<TrekSummaryResponse>>>(ENDPOINTS.TREKS.LIST_PUBLIC, { params })
      .then((r) => r.data.data),

  getById: (id: string): Promise<TrekResponseDto> =>
    apiClient
      .get<ApiResponse<TrekResponseDto>>(ENDPOINTS.TREKS.BY_ID(id))
      .then((r) => r.data.data),

  getDepartures: (trekId: string): Promise<DepartureResponseDto[]> =>
    apiClient
      .get<ApiResponse<DepartureResponseDto[]>>(ENDPOINTS.DEPARTURES.BY_TREK(trekId))
      .then((r) => r.data.data),

  listUpcomingBatches: (params: { page: number; size: number }): Promise<PageResponse<UpcomingBatchResponse>> =>
    apiClient
      .get<ApiResponse<PageResponse<UpcomingBatchResponse>>>(ENDPOINTS.DEPARTURES.UPCOMING_PUBLIC, { params })
      .then((r) => r.data.data),
}

export default trekService
