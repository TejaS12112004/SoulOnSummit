/**
 * Departure service ?" placeholder for future API integration.
 *
 * Will consume:
 *   GET /api/v1/treks/upcoming-departures ?' ENDPOINTS.DEPARTURES.UPCOMING
 *   GET /api/v1/treks/:trekId/departures  ?' ENDPOINTS.DEPARTURES.BY_TREK(trekId)
 */
import apiClient from '@/api/apiClient'
import { ENDPOINTS } from '@/api/endpoints'
import type { ApiResponse, HomeUpcomingDepartureResponse } from '@/types/api'

const departureService = {
  // TODO: implement ?" GET /api/v1/treks/upcoming-departures
  getUpcoming: (): Promise<ApiResponse<HomeUpcomingDepartureResponse[]>> =>
    apiClient.get<ApiResponse<HomeUpcomingDepartureResponse[]>>(ENDPOINTS.DEPARTURES.UPCOMING).then((r) => r.data),

  // TODO: implement ?" GET /api/v1/treks/:trekId/departures
  getByTrek: (trekId: string): Promise<ApiResponse<HomeUpcomingDepartureResponse[]>> =>
    apiClient.get<ApiResponse<HomeUpcomingDepartureResponse[]>>(ENDPOINTS.DEPARTURES.BY_TREK(trekId)).then((r) => r.data),
}

export default departureService
